/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreditTransactionForm from './components/CreditTransactionForm';
import Modal from '../app/components/Modal';

import { getFuelSuppliers } from '../actions/organizationActions';
import { addCreditTransfer, invalidateCreditTransfer, invalidateCreditTransfers } from '../actions/creditTransfersActions';
import history from '../app/History';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';

class CreditTransactionAddContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        fairMarketValuePerCredit: '',
        initiator: {},
        note: '',
        numberOfCredits: '',
        respondent: { id: 0, name: '' },
        terms: [],
        tradeType: { }
      }
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.invalidateCreditTransfer();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    const fieldState = { ...this.state.fields };

    this.setState({
      fields: fieldState
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      });
    }
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    // API data structure
    const data = {
      fairMarketValuePerCredit: parseFloat(this.state.fields.fairMarketValuePerCredit).toFixed(2),
      initiator: this.state.fields.initiator.id,
      note: this.state.fields.note,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      tradeEffectiveDate: null,
      type: this.state.fields.tradeType.id
    };

    this.props.addCreditTransfer(data).then((response) => {
      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.LIST);
    });

    this.props.invalidateCreditTransfers();

    return false;
  }

  render () {
    return ([
      <CreditTransactionForm
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransferForm"
        title="New Credit Transaction"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed);
        }}
        id="confirmCreate"
        key="confirmCreate"
      >
        Are you sure you want to recommend this transaction?
      </Modal>
    ]);
  }
}

CreditTransactionAddContainer.defaultProps = {
  errors: {}
};

CreditTransactionAddContainer.propTypes = {
  addCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionAddContainer);
