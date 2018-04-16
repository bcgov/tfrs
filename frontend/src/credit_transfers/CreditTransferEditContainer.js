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
  invalidateCreditTransfers } from '../actions/creditTransfersActions';

import CreditTransferForm from './components/CreditTransferForm';

import { CREDIT_TRANSFER_STATUS } from '../constants/values';
import * as Lang from '../constants/langEnUs';

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
      fairMarketValuePerCredit: parseInt(this.state.fields.fairMarketValuePerCredit, 10),
      note: this.state.fields.note,
      status: this.state.fields.tradeStatus.id,
      type: this.state.fields.tradeType.id,
      tradeEffectiveDate: null
    };

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });

    return false;
  }

  _changeStatus (status) {
    this.changeObjectProp(status.id, 'tradeStatus');
  }

  _deleteCreditTransfer (id) {
    // TODO: Popup notification before delete
    this.props.deleteCreditTransfer(this.props.item.id);
  }

  /*
   * Helper functions
   */
  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };
    if (name === 'respondent') {
      // Populate the dropdown
      const respondents = this.props.fuelSuppliers.filter((fuelSupplier) => {
        return fuelSupplier.id === id;
      });

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
    const { isFetching, item } = this.props;
    let buttonActions = [];

    if (!isFetching && item.actions) {
      // TODO: Add util function to return appropriate actions
      buttonActions = item.actions.map(action => (
        action.action
      ));
      if (buttonActions.includes(Lang.BTN_SAVE_DRAFT)) {
        buttonActions.push('Delete');
      }
    }

    return (
      <div>
        <CreditTransferForm
          fuelSuppliers={this.props.fuelSuppliers}
          title="New Credit Transfer"
          fields={this.state.fields}
          totalValue={this.state.totalValue}
          tradeStatus={this.state.tradeStatus}
          handleInputChange={this._handleInputChange}
          handleSubmit={this._handleSubmit}
          creditsFrom={this.state.creditsFrom}
          creditsTo={this.state.creditsTo}
          errors={this.props.errors}
          changeStatus={this._changeStatus}
        />
      </div>
    );
  }
}

CreditTransferEditContainer.defaultProps = {
  errors: {}
};

CreditTransferEditContainer.propTypes = {
  updateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
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
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferEditContainer);
