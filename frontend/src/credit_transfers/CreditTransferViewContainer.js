/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreditTransferDetails from './components/CreditTransferDetails';
import ModalDeleteCreditTransfer from './components/ModalDeleteCreditTransfer';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';

import {
  deleteCreditTransfer,
  getCreditTransferIfNeeded,
  invalidateCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions';
import { getLoggedInUser } from '../actions/userActions';
import history from '../app/History';
import * as Lang from '../constants/langEnUs';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      terms: {}
    };

    this._addTerms = this._addTerms.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getCreditTransferIfNeeded(id);
  }

  _addTerms (terms) {
    this.setState({
      terms
    });
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
      terms: this.state.terms,
      type: item.type.id,
      tradeEffectiveDate: null
    };

    // Update credit transfer (status and capture the acceptance of terms)

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });
  }

  _deleteCreditTransfer (id) {
    this.props.deleteCreditTransfer(id).then(() => {
      history.push(CREDIT_TRANSACTIONS.LIST);
    });
  }

  _toggleCheck (key) {
    const terms = { ...this.state.terms };
    terms[key] = !terms[key];
    this.setState({
      terms
    });
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
        buttonActions.push(Lang.BTN_DELETE_DRAFT);
        buttonActions[buttonActions.indexOf(Lang.BTN_SAVE_DRAFT)] = Lang.BTN_EDIT_DRAFT;
        buttonActions[buttonActions.indexOf(Lang.BTN_PROPOSE)] = Lang.BTN_SIGN_1_2;
      }
    }

    return ([
      <CreditTransferDetails
        addTerms={this._addTerms}
        buttonActions={buttonActions}
        changeStatus={this._changeStatus}
        compliancePeriod={item.compliancePeriod}
        creditsFrom={item.creditsFrom}
        creditsTo={item.creditsTo}
        fairMarketValuePerCredit={item.fairMarketValuePerCredit}
        id={item.id}
        isFetching={isFetching}
        key="creditTransferDetails"
        note={item.note}
        numberOfCredits={item.numberOfCredits}
        status={item.status}
        terms={this.state.terms}
        toggleCheck={this._toggleCheck}
        totalValue={item.totalValue}
        tradeEffectiveDate={item.tradeEffectiveDate}
        tradeType={item.type}
      />,
      <ModalSubmitCreditTransfer
        key="confirmSubmit"
        message="Do you want to sign and send this document to the other party
        named in this transfer?"
        submitCreditTransfer={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.proposed);
        }}
      />,
      <ModalDeleteCreditTransfer
        deleteCreditTransfer={this._deleteCreditTransfer}
        key="confirmDelete"
        message="Do you want to delete this draft?"
        selectedId={item.id}
      />
    ]);
  }
}

CreditTransferViewContainer.propTypes = {
  deleteCreditTransfer: PropTypes.func.isRequired,
  getCreditTransferIfNeeded: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
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
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
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
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getCreditTransferIfNeeded: bindActionCreators(getCreditTransferIfNeeded, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
