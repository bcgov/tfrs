/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import history from '../app/History';

import { getFuelSuppliers } from '../actions/organizationActions';
import {
  getCreditTransfer,
  deleteCreditTransfer,
  updateCreditTransfer,
  invalidateCreditTransfer } from '../actions/creditTransfersActions';

import CreditTransferForm from './components/CreditTransferForm';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';
import ModalDeleteCreditTransfer from './components/ModalDeleteCreditTransfer';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';
import * as Lang from '../constants/langEnUs';

const buttonActions = [Lang.BTN_DELETE, Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2];

class CreditTransferEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        initiator: {},
        tradeType: { id: 1, name: 'Sell' },
        numberOfCredits: '',
        respondent: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        tradeStatus: CREDIT_TRANSFER_STATUS.draft,
        note: ''
      },
      creditsFrom: {},
      creditsTo: {},
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  loadData (id) {
    this.props.getCreditTransfer(id);
  }

  loadPropsToFieldState (props) {
    if (Object.keys(props.item).length !== 0) {
      const { item } = props;
      const fieldState = {
        initiator: item.initiator,
        tradeType: item.type,
        numberOfCredits: item.numberOfCredits.toString(),
        respondent: item.respondent,
        fairMarketValuePerCredit: item.fairMarketValuePerCredit,
        tradeStatus: item.status,
        note: ''
      };

      this.setState({
        fields: fieldState,
        creditsFrom: item.creditsFrom,
        creditsTo: item.creditsTo,
        totalValue: item.totalValue
      });
    }
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  _changeStatus (status) {
    this.changeObjectProp(status.id, 'tradeStatus');
  }

  _deleteCreditTransfer (id) {
    this.props.deleteCreditTransfer(id).then(() => {
      history.push(CREDIT_TRANSACTIONS.LIST);
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    // console.log(typeof fieldState[name], value, name);

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      }, () => this.computeTotalValue(name));
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    // API data structure
    const data = {
      initiator: this.state.fields.initiator.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      fairMarketValuePerCredit: parseFloat(this.state.fields.fairMarketValuePerCredit).toFixed(2),
      note: this.state.fields.note,
      status: status.id,
      type: this.state.fields.tradeType.id,
      tradeEffectiveDate: null
    };

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });

    return false;
  }

  /*
   * Helper functions
   */
  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };
    if (name === 'respondent') {
      // Populate the dropdown
      const respondents = this.props.fuelSuppliers.filter(fuelSupplier => (fuelSupplier.id === id));

      fieldState.respondent = respondents.length === 1 ? respondents[0] : { id: 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else if (name === 'tradeType') {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      });
    }
  }

  changeFromTo (tradeType, initiator, respondent) {
    // Change the creditsFrom and creditsTo according to the trade type
    let creditsFrom = initiator;
    let creditsTo = respondent;
    if (tradeType.id === 2) {
      creditsFrom = respondent;
      creditsTo = initiator;
    }

    this.setState({ creditsFrom, creditsTo });
  }

  computeTotalValue (name) {
    // Compute the total value when the fields change
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.fairMarketValuePerCredit
      });
    }
  }

  render () {
    const { item } = this.props;

    return ([
      <CreditTransferForm
        buttonActions={buttonActions}
        changeStatus={this._changeStatus}
        creditsFrom={this.state.creditsFrom}
        creditsTo={this.state.creditsTo}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        id={item.id}
        key="creditTransferForm"
        title="New Credit Transfer"
        totalValue={this.state.totalValue}
        tradeStatus={this.state.tradeStatus}
      />,
      <ModalSubmitCreditTransfer
        key="confirmSubmit"
        submitCreditTransfer={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed);
        }}
        message="Do you want to sign and send this document to the other party
        named in this transfer?"
      />,
      <ModalDeleteCreditTransfer
        key="confirmDelete"
        deleteCreditTransfer={this._deleteCreditTransfer}
        message="Do you want to delete this draft?"
        selectedId={item.id}
      />
    ]);
  }
}

CreditTransferEditContainer.defaultProps = {
  errors: {}
};

CreditTransferEditContainer.propTypes = {
  updateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    creditsFrom: PropTypes.shape({}),
    creditsTo: PropTypes.shape({}),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    numberOfCredits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    totalValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    actions: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errors: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  item: state.rootReducer.creditTransfer.item,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  errors: state.rootReducer.creditTransfer.errors
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferEditContainer);
