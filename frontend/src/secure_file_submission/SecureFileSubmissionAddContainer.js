/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loading from '../app/components/Loading'
import Modal from '../app/components/Modal'
import {
  addDocumentUpload,
  clearDocumentUploadError,
  getDocumentUploadURL,
  scanDocumentAttachments,
  uploadDocument
} from '../actions/documentUploads'
import DOCUMENT_STATUSES from '../constants/documentStatuses'
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload'
import toastr from '../utils/toastr'
import FileUploadProgress from './components/FileUploadProgress'
import SecureFileSubmissionForm from './components/SecureFileSubmissionForm'
import { withRouter } from '../utils/withRouter'

class SecureFileSubmissionAddContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {
        attachmentCategory: '',
        attachments: [],
        comment: '',
        compliancePeriod: { id: 0, description: '' },
        documentType: {
          id: props.params.type ? parseInt(props.params.type, 10) : 1
        },
        files: [],
        milestone: '',
        title: ''
      },
      isFormIncomplete: true,
      uploadState: '',
      uploadProgress: []
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount () {
    this.props.clearDocumentUploadError()
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields }

    fieldState[name] = { id: id || 0 }
    this.setState({
      fields: fieldState
    })
  }

  _getDocumentType () {
    let documentTypes = []
    this.props.referenceData.documentCategories.forEach((category) => {
      documentTypes = documentTypes.concat(category.types)
    })

    const foundType = documentTypes.find(type => (type.id === this.state.fields.documentType.id))

    if (foundType) {
      return foundType
    }

    return false
  }

  _getErrors () {
    if ('title' in this.props.errors && this._getDocumentType().theType === 'Evidence') {
      this.props.errors.title.forEach((error, index) => {
        this.props.errors.title[index] = error.replace(/Title/, 'Part 3 Agreement')
      })
    }

    return this.props.errors
  }

  _getValidationMessages () {
    const validationMessage = []

    if (this.state.fields.compliancePeriod.id === 0) {
      validationMessage.push('Please specify the Compliance Period to which the request relates.')
    }

    if (this._getDocumentType().theType === 'Evidence') {
      if (this.state.fields.title === '') {
        validationMessage.push('Please provide the name of the Part 3 Agreement to which the submission relates.')
      }

      if (this.state.fields.milestone === '') {
        validationMessage.push('Please indicate the Milestone(s) to which the submission relates.')
      }
    } else if (this.state.fields.title === '') {
      validationMessage.push('Please provide a Title.')
    }

    if (this.state.fields.files.length === 0) {
      validationMessage.push('Please attach at least one file before submitting.')
    }

    return validationMessage
  }

  _handleInputChange (event) {
    const { value, name } = event.target
    const fieldState = { ...this.state.fields }

    if (typeof fieldState[name] === 'object' &&
      name !== 'files') {
      this.changeObjectProp(parseInt(value, 10), name)
    } else if (name === 'files') {
      const progress = []
      fieldState[name] = value

      for (let i = 0; i < value.length; i += 1) {
        progress.push({
          index: i,
          started: false,
          complete: false,
          error: false,
          progress: {
            loaded: 0,
            total: 1
          }
        })
      }

      this.setState({
        ...this.state,
        uploadProgress: progress,
        fields: fieldState
      })
    } else {
      fieldState[name] = value
      this.setState({
        fields: fieldState
      })
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault()

    this.setState({
      ...this.state,
      uploadState: 'progress'
    })

    const uploadPromises = []
    const attachments = []
    const attachedFiles = this.state.fields.files

    for (let i = 0; i < attachedFiles.length; i += 1) {
      const file = attachedFiles[i]

      uploadPromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          const blob = reader.result

          this.props.requestURL().then((response) => {
            const progress = this.state.uploadProgress
            progress[i] = {
              ...progress[i],
              started: true
            }
            this.setState({
              ...this.state,
              uploadProgress: progress
            })

            this.props.uploadDocument(response.data.put, blob, (progressEvent) => {
              const { uploadProgress } = this.state
              uploadProgress[i] = {
                ...uploadProgress[i],
                progress: {
                  loaded: progressEvent.loaded,
                  total: progressEvent.total
                }
              }

              this.setState({
                ...this.state,
                uploadProgress
              })
            }).then(() => {
              const { uploadProgress } = this.state
              uploadProgress[i] = {
                ...uploadProgress[i],
                complete: true,
                error: false
              }
              this.setState({
                ...this.state,
                uploadProgress
              })
            }).catch(() => {
              const { uploadProgress } = this.state
              uploadProgress[i] = {
                ...uploadProgress[i],
                complete: false,
                error: true
              }
              this.setState({
                ...this.state,
                uploadProgress
              })
            })

            attachments.push({
              filename: file.name,
              mimeType: file.type,
              size: file.size,
              url: response.data.get.split(/[?#]/)[0]
            })
            resolve()
          })
        }

        reader.readAsArrayBuffer(file)
      }))
    }

    // API data structure
    const data = {
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      milestone: this.state.fields.milestone,
      status: status.id,
      title: this.state.fields.title,
      type: this.state.fields.documentType.id,
      attachments
    }

    Promise.all(uploadPromises).then(() => (
      this.props.addDocumentUpload(data).then((response) => {
        const { id } = response.data
        this.props.scanDocumentAttachments(id)

        this.setState({ uploadState: 'success' })
        this.props.navigate(SECURE_DOCUMENT_UPLOAD.LIST)
        toastr.documentUpload(status.id)
      }).catch((reason) => {
        this.setState({
          uploadState: 'failed'
        })
      })
    )).catch((reason) => {
      this.setState({
        uploadState: 'failed'
      })
    })

    return true
  }

  render () {
    if (this.props.referenceData.isFetching) {
      return (<Loading />)
    }

    if (this.state.uploadState === 'progress') {
      return (<FileUploadProgress
        progress={this.state.uploadProgress}
        files={this.state.fields.files}
      />)
    }

    const availableActions = ['Draft', 'Submitted']

    return ([
      <SecureFileSubmissionForm
        addToFields={this._addToFields}
        availableActions={availableActions}
        categories={this.props.referenceData.documentCategories}
        documentType={this._getDocumentType()}
        errors={this._getErrors()}
        fields={this.state.fields}
        formValidationMessage={this._getValidationMessages()}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="secureFileSubmission"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, DOCUMENT_STATUSES.submitted)
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to securely submit these files to the Government of British Columbia?
      </Modal>
    ])
  }
}

SecureFileSubmissionAddContainer.defaultProps = {
  errors: {}
}

SecureFileSubmissionAddContainer.propTypes = {
  addDocumentUpload: PropTypes.func.isRequired,
  clearDocumentUploadError: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.arrayOf(PropTypes.string)
  }),
  params: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  referenceData: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  requestURL: PropTypes.func.isRequired,
  scanDocumentAttachments: PropTypes.func.isRequired,
  uploadDocument: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
  errors: state.rootReducer.documentUpload.errors,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
})

const mapDispatchToProps = dispatch => ({
  addDocumentUpload: bindActionCreators(addDocumentUpload, dispatch),
  clearDocumentUploadError: bindActionCreators(clearDocumentUploadError, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch),
  scanDocumentAttachments: bindActionCreators(scanDocumentAttachments, dispatch),
  uploadDocument: bindActionCreators(uploadDocument, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SecureFileSubmissionAddContainer))
