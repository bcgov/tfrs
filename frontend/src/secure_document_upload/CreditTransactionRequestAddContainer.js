/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from '../app/components/Modal';
import CreditTransactionRequestForm from './components/CreditTransactionRequestForm';
import history from '../app/History';
import { addDocumentUpload, getDocumentUploadURL, uploadDocument } from '../actions/documentUploads';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';

import Loading from '../app/components/Loading';

class CreditTransactionRequestAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        agreementName: '',
        attachmentCategory: '',
        attachmentType: props.match.params.type ? props.match.params.type : 'other',
        comment: '',
        compliancePeriod: { id: 0, description: '' },
        documentType: { id: 2 },
        files: [],
        milestoneId: ''
      },
      validationErrors: {},
      uploadState: ''
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
  }

  componentWillReceiveProps (props) {
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object' &&
      name !== 'files') {
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

    Object.keys(this.state.fields.files).forEach((file) => {
      uploadPromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const blob = reader.result;

          this.props.requestURL().then((response) => {
            uploadDocument(response.data.put, blob);

            attachments.push({
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

    // API data structure
    const data = {
      title: this.state.fields.agreementName,
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      type: this.state.fields.documentType.id,
      attachments
    };

    Promise.all(uploadPromises).then(() => {
      this.setState({ uploadState: 'success' });
      this.props.addDocumentUpload(data).then((response) => {
        history.push(SECURE_DOCUMENT_UPLOAD.LIST);
        toastr.documentUpload('Draft saved.');
      });
    }).catch((reason) => {
      this.setState({
        uploadState: 'failed'
      });
    });

    return true;
  }

  render () {
    if (this.state.uploadState === 'progress' || this.props.referenceData.isFetching) {
      return (<Loading />);
    }

    return ([
      <CreditTransactionRequestForm
        addToFields={this._addToFields}
        categories={this.props.referenceData.documentCategories}
        errors={this.props.errors}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransactionForm"
        loggedInUser={this.props.loggedInUser}
        title="New P3A Application Submission"
        validationErrors={this.state.validationErrors}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event);
        }}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to add this request?
      </Modal>
    ]);
  }
}

CreditTransactionRequestAddContainer.defaultProps = {
  errors: {},
  validationErrors: {}
};

CreditTransactionRequestAddContainer.propTypes = {
  addDocumentUpload: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
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
  requestURL: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  addDocumentUpload: bindActionCreators(addDocumentUpload, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestAddContainer);
