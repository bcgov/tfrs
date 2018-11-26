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

import { getLoggedInUser } from '../actions/userActions';
import history from '../app/History';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';
import toastr from '../utils/toastr';

class CreditTransactionRequestAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        files: []
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

    return false;
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
  validationErrors: PropTypes.shape()
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestAddContainer);
