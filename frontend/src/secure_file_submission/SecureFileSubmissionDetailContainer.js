/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from '../app/components/Loading'
import SecureFileSubmissionUtilityFunctions from './SecureFileSubmissionUtilityFunctions'

import {
  addCommentToDocument, deleteDocumentUpload, getDocumentUpload,
  linkDocument, partialUpdateDocument, unlinkDocument, updateCommentOnDocument,
  getLinkableCreditTransactions
} from '../actions/documentUploads'
import Modal from '../app/components/Modal'
import SecureFileSubmissionDetails from './components/SecureFileSubmissionDetails'
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload'
import * as Lang from '../constants/langEnUs'
import toastr from '../utils/toastr'
import LinkedCreditTransferSelection from './components/LinkedCreditTransferSelection'
import { withRouter } from '../utils/withRouter'

class SecureFileSubmissionDetailContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {
        recordNumbers: []
      },
      hasFailures: false,
      hasCommented: false,
      isCommenting: false,
      isCreatingPrivilegedComment: false,
      selectedLinkId: null
    }

    this._addComment = this._addComment.bind(this)
    this._addLink = this._addLink.bind(this)
    this._cancelComment = this._cancelComment.bind(this)
    this._establishLink = this._establishLink.bind(this)
    this._getDocumentStatus = this._getDocumentStatus.bind(this)
    this._handleRecordNumberChange = this._handleRecordNumberChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._saveComment = this._saveComment.bind(this)
    this._selectLinkIdForModal = this._selectLinkIdForModal.bind(this)
    this._unLink = this._unLink.bind(this)
  }

  componentDidMount () {
    this.loadData(this.props.params.id)
  }

  loadData (id) {
    this.props.getDocumentUpload(id)
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    let hasFailures = false

    const attachments = newProps.documentUpload.item.attachments
    if (attachments) {
      attachments.forEach(attachment => {
        if (attachment.securityScanStatus === 'FAIL') {
          hasFailures = true
        }
      })
    }

    this.setState({
      hasFailures
    })
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    })
  }

  _addLink () {
    this.props.fetchCreditTransfers(this.props.params.id)
  }

  _cancelComment () {
    this.setState({
      isCommenting: false,
      isCreatingPrivilegedComment: false
    })
  }

  _deleteCreditTransferRequest (id) {
    this.props.deleteDocumentUpload(id).then(() => {
      this.props.navigate(SECURE_DOCUMENT_UPLOAD.LIST)
      toastr.documentUpload(null, 'Draft deleted.')
    })
  }

  _establishLink (id) {
    const docId = this.props.documentUpload.item.id

    const data = {
      creditTrade: id
    }

    this.props.linkDocument(docId, data).then((response) => {
      this.props.getDocumentUpload(this.props.documentUpload.item.id)
    })
  }

  _getValidationMessages () {
    const validationMessage = []

    this.props.documentUpload.item.attachments.forEach((attachment) => {
      const recordNumber = this.state.fields.recordNumbers.find(item =>
        item && item.id === attachment.id)

      if (!recordNumber || recordNumber.value === '') {
        validationMessage.push(`Please provide a TRIM Record # for ${attachment.filename}`)
      }
    })

    return validationMessage
  }

  _getDocumentStatus (status) {
    return this.props.referenceData.documentStatuses.find(documentStatus =>
      (documentStatus.status === status))
  }

  _handleRecordNumberChange (event, index, id) {
    const { value, name } = event.target
    const fieldState = { ...this.state.fields }

    fieldState[name][index] = {
      id,
      value
    }

    this.setState({
      fields: fieldState
    })
  }

  _handleSubmit (event, status) {
    event.preventDefault()

    const { id } = this.props.documentUpload.item

    // API data structure
    const data = {
      status: status.id
    }

    if (this.state.fields.recordNumbers.length > 0) {
      data.recordNumbers = this.state.fields.recordNumbers
    }

    this.props.partialUpdateDocument(id, data).then((response) => {
      this.props.navigate(SECURE_DOCUMENT_UPLOAD.LIST)
      toastr.documentUpload(status.status)
    })

    return true
  }

  _saveComment (comment) {
    const { item } = this.props.documentUpload

    // API data structure
    const data = {
      document: item.id,
      comment: comment.comment,
      privilegedAccess: comment.privilegedAccess
    }

    switch (comment.id) {
      case null:
        this.props.addCommentToDocument(data).then(() => {
          this.props.getDocumentUpload(this.props.documentUpload.item.id)
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          })
        }, () => {
          // Failed to update
        })
        break
      default:
        // we are saving a pre-existing comment
        this.props.updateCommentOnDocument(comment.id, data).then(() => {
          this.props.getDocumentUpload(this.props.documentUpload.item.id)
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          })
        }, () => {
          // Failed to update
        })
    }
  }

  _selectLinkIdForModal (id) {
    this.setState({
      selectedLinkId: id
    })
  }

  _unLink (id) {
    const docId = this.props.documentUpload.item.id

    const data = {
      creditTrade: id
    }

    this.props.unlinkDocument(docId, data).then((response) => {
      this.props.getDocumentUpload(this.props.documentUpload.item.id)
    })
  }

  renderStatic () {
    const {
      errors, item, isFetching, success
    } = this.props.documentUpload
    let availableActions = []

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      availableActions = item.actions.map(action => (
        action.status
      ))

      return ([
        <SecureFileSubmissionDetails
          addComment={this._addComment}
          availableActions={availableActions}
          addLink={this._addLink}
          cancelComment={this._cancelComment}
          canComment={SecureFileSubmissionUtilityFunctions
            .canComment(this.props.loggedInUser, this.props.documentUpload.item)}
          canCreatePrivilegedComment={
            SecureFileSubmissionUtilityFunctions.canCreatePrivilegedComment(
              this.props.loggedInUser,
              this.props.documentUpload.item
            )
          }
          canLink={
            SecureFileSubmissionUtilityFunctions.canLinkCreditTransfer(
              this.props.loggedInUser,
              this.props.documentUpload.item
            )
          }
          errors={errors}
          fields={this.state.fields}
          formValidationMessage={this._getValidationMessages()}
          handleRecordNumberChange={this._handleRecordNumberChange}
          hasFailures={this.state.hasFailures}
          hasCommented={this.state.hasCommented}
          isCommenting={this.state.isCommenting}
          isCreatingPrivilegedComment={this.state.isCreatingPrivilegedComment}
          item={item}
          key="details"
          loggedInUser={this.props.loggedInUser}
          saveComment={this._saveComment}
          selectLinkIdForModal={this._selectLinkIdForModal}
        />,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Received'))
          }}
          id="confirmReceived"
          key="confirmReceived"
        >
          Are you sure you want to mark this as received?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Archived'))
          }}
          id="confirmArchived"
          key="confirmArchived"
        >
          Are you sure you want to archive this submission?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Draft'))
          }}
          id="confirmRescind"
          key="confirmRescind"
        >
          Are you sure you want to rescind this submission back to draft?
        </Modal>,
        <Modal
          handleSubmit={() => this._deleteCreditTransferRequest(item.id)}
          id="confirmDelete"
          key="confirmDelete"
        >
          Are you sure you want to delete this draft?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Submitted'))
          }}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to securely submit these files to the
          Government of British Columbia?
        </Modal>,
        <Modal
          handleSubmit={() => this._unLink(this.state.selectedLinkId)}
          id="confirmUnlink"
          key="confirmUnlink"
        >
          Are you sure you want to delete this link with the credit transaction?
        </Modal>,
        <Modal
          cancelLabel={Lang.BTN_CANCEL_LINK_CREDIT_TRANSACTION}
          id="modalCreditTransfer"
          key="modalCreditTransfer"
          showConfirmButton={false}
          title={Lang.BTN_LINK_CREDIT_TRANSACTION}
        >
          {this.props.creditTransfers.isFetching && <Loading />}
          {!this.props.creditTransfers.isFetching &&
          <LinkedCreditTransferSelection
            creditTransfers={this.props.creditTransfers.items}
            establishLink={this._establishLink}
          />
          }
        </Modal>
      ])
    }

    return <Loading />
  }

  render () {
    if (this.props.isFetching) {
      return <Loading />
    }

    return this.renderStatic()
  }
}

SecureFileSubmissionDetailContainer.defaultProps = {
  creditTransfers: {},
  isFetching: false
}

SecureFileSubmissionDetailContainer.propTypes = {
  addCommentToDocument: PropTypes.func.isRequired,
  deleteDocumentUpload: PropTypes.func.isRequired,
  documentUpload: PropTypes.shape({
    errors: PropTypes.shape(),
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number,
      actions: PropTypes.arrayOf(PropTypes.string),
      attachments: PropTypes.arrayOf(PropTypes.shape)
    }),
    success: PropTypes.bool
  }).isRequired,
  getDocumentUpload: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  partialUpdateDocument: PropTypes.func.isRequired,
  referenceData: PropTypes.shape({
    documentStatuses: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  updateCommentOnDocument: PropTypes.func.isRequired,
  fetchCreditTransfers: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }),
  linkDocument: PropTypes.func.isRequired,
  unlinkDocument: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  documentUpload: {
    errors: state.rootReducer.documentUpload.errors,
    isFetching: state.rootReducer.documentUpload.isFetching,
    item: state.rootReducer.documentUpload.item,
    success: state.rootReducer.documentUpload.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentStatuses: state.rootReducer.referenceData.data.documentStatuses,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  },
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching,
    isSuccessful: state.rootReducer.creditTransfers.success
  }
})

const mapDispatchToProps = dispatch => ({
  addCommentToDocument: bindActionCreators(addCommentToDocument, dispatch),
  deleteDocumentUpload: bindActionCreators(deleteDocumentUpload, dispatch),
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch),
  partialUpdateDocument: bindActionCreators(partialUpdateDocument, dispatch),
  updateCommentOnDocument: bindActionCreators(updateCommentOnDocument, dispatch),
  fetchCreditTransfers: bindActionCreators(getLinkableCreditTransactions, dispatch),
  linkDocument: bindActionCreators(linkDocument, dispatch),
  unlinkDocument: bindActionCreators(unlinkDocument, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SecureFileSubmissionDetailContainer))
