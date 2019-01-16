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

import { deleteDocumentUpload, getDocumentUpload, updateDocumentUpload } from '../actions/documentUploads';
import history from '../app/History';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';

class CreditTransactionRequestEditContainer extends Component {
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
        recordNumber: '',
        title: ''
      },
      validationErrors: {}
    };

    this.submitted = false;

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

    if (Object.keys(item).length > 0 && !this.submitted) {
      const fieldState = {
        attachments: item.attachments,
        compliancePeriod: item.compliancePeriod,
        documentType: item.type,
        files: [],
        milestone: item.milestone ? item.milestone.milestone : '',
        recordNumber: item.recordNumber || '',
        title: item.title
      };

      this.setState({
        fields: fieldState
      });
    }
  }

  _deleteCreditTransferRequest (id) {
    this.props.deleteDocumentUpload(id).then(() => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload('Draft deleted.');
    });
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

    const { id } = this.props.item;

    // API data structure
    const data = {
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      files: this.state.fields.files,
      milestoneId: this.state.fields.milestoneId,
      title: this.state.fields.title
    };

    this.props.updateDocumentUpload(data, id).then((response) => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload('Draft saved.');
    });

    return true;
  }

  render () {
    const { item } = this.props;

    return ([
      <CreditTransactionRequestForm
        addToFields={this._addToFields}
        categories={this.props.referenceData.documentCategories}
        edit
        errors={this.props.errors}
        fields={this.state.fields}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransactionForm"
        loggedInUser={this.props.loggedInUser}
        title="New Credit Transaction Request"
        validationErrors={this.state.validationErrors}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event);
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

CreditTransactionRequestEditContainer.defaultProps = {
  errors: {},
  validationErrors: {}
};

CreditTransactionRequestEditContainer.propTypes = {
  deleteDocumentUpload: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
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
  updateDocumentUpload: PropTypes.func.isRequired,
  validationErrors: PropTypes.shape()
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
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
  updateDocumentUpload: bindActionCreators(updateDocumentUpload, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestEditContainer);
