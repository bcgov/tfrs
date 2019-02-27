/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import history from '../app/History';
import {
  addDocumentUpload,
  clearDocumentUploadError,
  getDocumentUploadURL,
  uploadDocument
} from '../actions/documentUploads';
import DOCUMENT_STATUSES from '../constants/documentStatuses';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';
import FileUploadProgress from "./components/FileUploadProgress";
import SecureFileSubmissionForm from "./components/SecureFileSubmissionForm";

class SecureFileSubmissionAddContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        attachmentCategory: '',
        attachments: [],
        comment: '',
        compliancePeriod: {id: 0, description: ''},
        documentType: {
          id: props.match.params.type ? parseInt(props.match.params.type, 10) : 1
        },
        files: [],
        milestone: '',
        title: ''
      },
      validationErrors: {},
      uploadState: '',
      uploadProgress: []
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.clearDocumentUploadError();
  }

  changeObjectProp(id, name) {
    const fieldState = {...this.state.fields};

    fieldState[name] = {id: id || 0};
    this.setState({
      fields: fieldState
    });
  }

  _getDocumentType() {
    let documentTypes = [];
    this.props.referenceData.documentCategories.forEach((category) => {
      documentTypes = documentTypes.concat(category.types);
    });

    const foundType = documentTypes.find(type => (type.id === this.state.fields.documentType.id));

    if (foundType) {
      return foundType;
    }

    return false;
  }

  _getErrors() {
    if ('title' in this.props.errors && this._getDocumentType().theType === 'Evidence') {
      this.props.errors.title.forEach((error, index) => {
        this.props.errors.title[index] = error.replace(/Title/, 'Part 3 Agreement');
      });
    }

    return this.props.errors;
  }

  _handleInputChange(event) {
    const {value, name} = event.target;
    const fieldState = {...this.state.fields};

    if (typeof fieldState[name] === 'object' &&
      name !== 'files') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else if (name === 'files') {
        const progress = [];
        fieldState[name] = value;

        for (let i = 0; i < value.length; i++) {
            progress.push({
              index: i,
              started: false,
              complete: false,
              error: false,
              progress: {
                loaded: 0,
                total: 1,
              }
            });
          }

          this.setState({
            ...this.state,
            uploadProgress: progress,
            fields: fieldState,
          });
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit(event, status) {
    event.preventDefault();

    this.setState({
      ...this.state,
      uploadState: 'progress'
    });

    const uploadPromises = [];
    const attachments = [];
    const attachedFiles = this.state.fields.files;

    for (let i = 0; i < attachedFiles.length; i++) {

      let file = attachedFiles[i];

      uploadPromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const blob = reader.result;

          this.props.requestURL().then((response) => {

            let uploadProgress = this.state.uploadProgress;
            uploadProgress[i] = {
              ...uploadProgress[i],
              started: true
            };
            this.setState({
              ...this.state,
              uploadProgress
            });


            this.props.uploadDocument(response.data.put, blob,
              (progressEvent) => {
                let uploadProgress = this.state.uploadProgress;
                uploadProgress[i] = {
                  ...uploadProgress[i],
                  progress: {
                    loaded: progressEvent.loaded,
                    total: progressEvent.total
                  }
                };
                this.setState({
                  ...this.state,
                  uploadProgress
                });
              }
            ).then(
              () => {
                let uploadProgress = this.state.uploadProgress;
                uploadProgress[i] = {
                  ...uploadProgress[i],
                  complete: true,
                  error: false
                };
                this.setState({
                  ...this.state,
                  uploadProgress
                });
              }
            ).catch(
              () => {
                let uploadProgress = this.state.uploadProgress;
                uploadProgress[i] = {
                  ...uploadProgress[i],
                  complete: false,
                  error: true
                };
                this.setState({
                  ...this.state,
                  uploadProgress
                });
              }
            );

            attachments.push({
              filename: file.name,
              mimeType: file.type,
              size: file.size,
              url: response.data.get
            });
            resolve();
          });
        };

        reader.readAsArrayBuffer(file);
      }));
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
    };

    Promise.all(uploadPromises).then(() => (
      this.props.addDocumentUpload(data).then((response) => {
        this.setState({uploadState: 'success'});
        history.push(SECURE_DOCUMENT_UPLOAD.LIST);
        toastr.documentUpload(status.id);
      }).catch((reason) => {
        this.setState({
          uploadState: 'failed'
        });
      })
    )).catch((reason) => {
      this.setState({
        uploadState: 'failed'
      });
    });

    return true;
  }

  render() {
    if (this.props.referenceData.isFetching) {
      return (<Loading/>);
    }

    if (this.state.uploadState === 'progress') {
      return (<FileUploadProgress
        progress={this.state.uploadProgress}
        files={this.state.fields.files}/>);
    }

    const availableActions = ['Draft', 'Submitted'];

    return ([
      <SecureFileSubmissionForm
        addToFields={this._addToFields}
        availableActions={availableActions}
        categories={this.props.referenceData.documentCategories}
        documentType={this._getDocumentType()}
        errors={this._getErrors()}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="secureFileSubmission"
        loggedInUser={this.props.loggedInUser}
        validationErrors={this.state.validationErrors}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, DOCUMENT_STATUSES.submitted);
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to securely submit these files to the Government of British Columbia?
      </Modal>
    ]);
  }
}

SecureFileSubmissionAddContainer.defaultProps = {
  errors: {},
  validationErrors: {}
};

SecureFileSubmissionAddContainer.propTypes = {
  addDocumentUpload: PropTypes.func.isRequired,
  clearDocumentUploadError: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.arrayOf(PropTypes.string)
  }),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string
    })
  }).isRequired,
  referenceData: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  validationErrors: PropTypes.shape(),
  requestURL: PropTypes.func.isRequired,
  uploadDocument: PropTypes.func.isRequired

};

const mapStateToProps = state => ({
  errors: state.rootReducer.documentUpload.errors,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  addDocumentUpload: bindActionCreators(addDocumentUpload, dispatch),
  clearDocumentUploadError: bindActionCreators(clearDocumentUploadError, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch),
  uploadDocument: bindActionCreators(uploadDocument, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SecureFileSubmissionAddContainer);
