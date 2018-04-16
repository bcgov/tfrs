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

import {
  getCreditTransferIfNeeded,
  deleteCreditTransfer,
  updateCreditTransfer,
  invalidateCreditTransfer } from '../actions/creditTransfersActions';
import CreditTransferDetails from './components/CreditTransferDetails';
import { getLoggedInUser } from '../actions/userActions';

import * as Lang from '../constants/langEnUs';

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props);
    this._changeStatus = this._changeStatus.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getCreditTransferIfNeeded(id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  _changeStatus (status) {
    const { item } = this.props;

    // API data structure
    const data = {
      initiator: item.initiator.id,
      numberOfCredits: item.numberOfCredits,
      respondent: item.respondent.id,
      fairMarketValuePerCredit: item.fairMarketValuePerCredit,
      note: item.note,
      status: status.id,
      type: item.type.id,
      tradeEffectiveDate: null
    };

    // Update credit transfer (just the status)

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });
  }

  _deleteCreditTransfer (id) {
    // TODO: Popup notification before delete
    this.props.deleteCreditTransfer(this.props.item.id);
  }

  render () {
    const { isFetching, item, loggedInUser } = this.props;
    let buttonActions = [];

    if (!isFetching && item.actions) {
      // TODO: Add util function to return appropriate actions
      buttonActions = item.actions.map(action => (
        action.action
      ));

      if (item.initiator.id === loggedInUser.organization.id) {
        // Current user is the initiator
        buttonActions[buttonActions.indexOf(Lang.BTN_CT_CANCEL)] = Lang.BTN_RESCIND;
      } else {
        buttonActions[buttonActions.indexOf(Lang.BTN_CT_CANCEL)] = Lang.BTN_REFUSE;
      }

      if (buttonActions.includes(Lang.BTN_SAVE_DRAFT)) {
        buttonActions.push('Delete');
        buttonActions[buttonActions.indexOf(Lang.BTN_SAVE_DRAFT)] = Lang.BTN_EDIT_DRAFT;
      }
    }

    return (
      <CreditTransferDetails
        id={item.id}
        creditsFrom={item.creditsFrom}
        creditsTo={item.creditsTo}
        numberOfCredits={item.numberOfCredits}
        fairMarketValuePerCredit={item.fairMarketValuePerCredit}
        totalValue={item.totalValue}
        isFetching={isFetching}
        tradeType={item.type}
        changeStatus={this._changeStatus}
        buttonActions={buttonActions}
      />
    );
  }
}

CreditTransferViewContainer.propTypes = {
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
  getCreditTransferIfNeeded: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  item: state.rootReducer.creditTransfer.item,
  isFetching: state.rootReducer.creditTransfer.isFetching
});

const mapDispatchToProps = dispatch => ({
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  getCreditTransferIfNeeded: bindActionCreators(getCreditTransferIfNeeded, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
