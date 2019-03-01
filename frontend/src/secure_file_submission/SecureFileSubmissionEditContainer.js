/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';


import {
  deleteDocumentUpload, getDocumentUpload, getDocumentUploadURL, partialUpdateDocument,
  uploadDocument
} from '../actions/documentUploads';
import history from '../app/History';
import DOCUMENT_STATUSES from '../constants/documentStatuses';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';
import SecureFileSubmissionForm from "./components/SecureFileSubmissionForm";

class SecureFileSubmissionEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        attachmentCategory: '',
        attachments: [],
        compliancePeriod: { id: 0, description: '' },
        documentType: {
          id: 1
        },
        files: [],
        milestone: '',
        title: ''
      },
      uploadState: '',
      validationErrors: {}
    };

    this.loaded = false;
    this.originalAttachments = [];

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  loadData (id) {
    this.props.getDocumentUpload(id);
  }

  loadPropsToFieldState (props) {
    const { item } = props;

    if (Object.keys(item).length > 0 && !this.loaded) {
      const fieldState = {
        attachments: item.attachments, // updated source to be compared with the original
        comment: (item.comments.length > 0) ? item.comments[0].comment : '',
        compliancePeriod: item.compliancePeriod,
        documentType: item.type,
        files: [],
        milestone: (item.milestone ? item.milestone.milestone : '') || '',
        title: item.title
      };

      // original source to see if something was removed
      this.originalAttachments = item.attachments.slice(0);

      this.setState({
        fields: fieldState
      });

      this.loaded = true;
    }
  }

  _deleteCreditTransferRequest (id) {
    this.props.deleteDocumentUpload(id).then(() => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload(null, 'Draft deleted.');
    });
  }

  _getDocumentType () {
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

  _getErrors () {
    if ('title' in this.props.errors && this._getDocumentType().theType === 'Evidence') {
      this.props.errors.title.forEach((error, index) => {
        this.props.errors.title[index] = error.replace(/Title/, 'Part 3 Agreement');
      });
    }

    return this.props.errors;
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object' &&
      name !== 'files' && name !== 'attachments') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    this.setState({
      uploadState: 'progress'
    });

    const uploadPromises = [];
    const attachments = [];
    const attachedFiles = this.state.fields.files;

    Object.keys(attachedFiles).forEach((file) => {
      uploadPromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const blob = reader.result;

          this.props.requestURL().then((response) => {
            uploadDocument(response.data.put, blob);

            attachments.push({
              filename: attachedFiles[file].name,
              mimeType: attachedFiles[file].type,
              size: attachedFiles[file].size,
              url: response.data.get
            });
            resolve();
          });
        };

        reader.readAsArrayBuffer(attachedFiles[file]);
      }));
    });

    // goes through the original attachments and see if something is missing
    // then we just fetch the id of the missing ones (ie removed), and send that to the backend
    const attachmentsToBeRemoved = this.originalAttachments
      .filter(originalAttachment => (
        this.state.fields.attachments.findIndex(attachment => (
          attachment.id === originalAttachment.id)) < 0
      ))
      .map(attachment => attachment.id);

    const { id } = this.props.item;

    // API data structure
    const data = {
      attachments,
      attachmentsToBeRemoved,
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      milestone: this.state.fields.milestone,
      status: status.id,
      title: this.state.fields.title
    };

    Promise.all(uploadPromises).then(() => (
      this.props.partialUpdateDocument(id, data).then((response) => {
        this.setState({ uploadState: 'success' });
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

  render () {
    if (this.state.uploadState === 'progress' || this.props.referenceData.isFetching || !this.loaded) {
      return (<Loading />);
    }
    const { item } = this.props;
    let availableActions = [];

    if (item.actions) {
      availableActions = item.actions.map(action => (
        action.status
      ));
    }

    return ([
      <SecureFileSubmissionForm
        addToFields={this._addToFields}
        availableActions={availableActions}
        categories={this.props.referenceData.documentCategories}
        documentType={this._getDocumentType()}
        edit
        errors={this._getErrors()}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="secureFileSubmissionForm"
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
        Are you sure you want to update this request?
      </Modal>,
      <Modal
        handleSubmit={() => this._deleteCreditTransferRequest(item.id)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ]);
  }
}

SecureFileSubmissionEditContainer.defaultProps = {
  errors: {},
  validationErrors: {}
};

SecureFileSubmissionEditContainer.propTypes = {
  deleteDocumentUpload: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.arrayOf(PropTypes.string)
  }),
  getDocumentUpload: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number
  }).isRequired,
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
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  referenceData: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  requestURL: PropTypes.func.isRequired,
  partialUpdateDocument: PropTypes.func.isRequired,
  validationErrors: PropTypes.shape()
};

const mapStateToProps = state => ({
  errors: state.rootReducer.documentUpload.errors,
  item: state.rootReducer.documentUpload.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  deleteDocumentUpload: bindActionCreators(deleteDocumentUpload, dispatch),
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch),
  partialUpdateDocument: bindActionCreators(partialUpdateDocument, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SecureFileSubmissionEditContainer);
