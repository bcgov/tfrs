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
import {addDocumentUpload, getDocumentUploadURL} from '../actions/documentUploads';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';
import axios from 'axios';

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
        files: [],
        milestoneId: ''
      },
      validationErrors: {}
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

    // API data structure
    const data = {
      agreementName: this.state.fields.agreementName,
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      files: this.state.fields.files,
      milestoneId: this.state.fields.milestoneId
    };

    Object.keys(this.state.fields.files).forEach(
      (file) => {

        const reader = new FileReader();
        reader.onload = () => {
          const blob = reader.result;

          this.props.requestURL().then(response => {
            console.log(response.data);
            axios.put(
              response.data,
              blob
            )
          })
        };
        // reader.onabort = () =>
        // reader.onerror = () =>

        reader.readAsBinaryString(this.state.fields.files[file]);
      }
    );

    // this.props.addDocumentUpload(data).then((response) => {
    //   history.push(SECURE_DOCUMENT_UPLOAD.LIST);
    //   toastr.documentUpload('Draft saved.');
    // });

    return true;
  }

  render () {
    return ([
      <CreditTransactionRequestForm
        addToFields={this._addToFields}
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
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  validationErrors: PropTypes.shape(),
  requestURL: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addDocumentUpload: bindActionCreators(addDocumentUpload, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestAddContainer);
