/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreditTransferForm from './components/CreditTransferForm';
import ModalDeleteCreditTransfer from './components/ModalDeleteCreditTransfer';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';

import { getFuelSuppliers } from '../actions/organizationActions';
import {
  deleteCreditTransfer,
  getCreditTransfer,
  invalidateCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions';
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions';
import history from '../app/History';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';
import * as Lang from '../constants/langEnUs';

const buttonActions = [Lang.BTN_DELETE_DRAFT, Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2];

class CreditTransferEditContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      creditsFrom: {},
      creditsTo: {},
      fields: {
        initiator: {},
        tradeType: { id: 1, name: 'Sell' },
        numberOfCredits: '',
        respondent: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        terms: [],
        tradeStatus: CREDIT_TRANSFER_STATUS.draft,
        note: ''
      },
      totalValue: 0
    };

    this._addToFields = this._addToFields.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
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
        fairMarketValuePerCredit: item.fairMarketValuePerCredit,
        note: '',
        numberOfCredits: item.numberOfCredits.toString(),
        respondent: item.respondent,
        terms: this.state.fields.terms,
        tradeStatus: item.status,
        tradeType: item.type
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

  _addToFields (value) {
    const fieldState = { ...this.state.fields };
    fieldState.terms.push(value);

    this.setState({
      fields: fieldState
    });
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
      fairMarketValuePerCredit: parseFloat(this.state.fields.fairMarketValuePerCredit).toFixed(2),
      initiator: this.state.fields.initiator.id,
      note: this.state.fields.note,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      tradeEffectiveDate: null,
      type: this.state.fields.tradeType.id
    };

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then((response) => {
      // if it's being proposed capture the acceptance of the terms
      if (status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        const confirmations = this.props.prepareSigningAuthorityConfirmations(
          id,
          this.state.fields.terms
        );

        this.props.addSigningAuthorityConfirmation(confirmations);
      }

      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });

    return false;
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.terms.findIndex(term => term.id === key);
    fieldState.terms[index].value = !fieldState.terms[index].value;

    this.setState({
      fields: fieldState
    });
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
        addToFields={this._addToFields}
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
        terms={this.state.terms}
        title="Edit Credit Transfer"
        toggleCheck={this._toggleCheck}
        totalValue={this.state.totalValue}
        tradeStatus={this.state.tradeStatus}
      />,
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed);
        }}
        item={
          {
            creditsFrom: this.state.creditsFrom,
            creditsTo: this.state.creditsTo,
            fairMarketValuePerCredit: item.fairMarketValuePerCredit,
            numberOfCredits: item.numberOfCredits
          }
        }
      />,
      <ModalDeleteCreditTransfer handleSubmit={() => this._deleteCreditTransfer(item.id)} />
    ]);
  }
}

CreditTransferEditContainer.defaultProps = {
  errors: {}
};

CreditTransferEditContainer.propTypes = {
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  isFetching: PropTypes.bool.isRequired,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  prepareSigningAuthorityConfirmations: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item
});

const mapDispatchToProps = dispatch => ({
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferEditContainer);
