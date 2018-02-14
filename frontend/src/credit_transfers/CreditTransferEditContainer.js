/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCreditTransfer } from '../actions/creditTransfersActions';
import CreditTransferDetails from './components/CreditTransferDetails';

import * as Lang from '../constants/langEnUs';

class CreditTransferEditContainer extends Component {
  constructor (props) {
    super(props);
    this._changeStatus = this._changeStatus.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getCreditTransfer(id);
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
      type: item.id,
      tradeEffectiveDate: null
    };

    console.log('submitting', data);

    // Update credit transfer (just the status)

    // this.props.addCreditTransfer(
    //   data,
    //   () => { history.push(Routes.CREDIT_TRANSACTIONS); }
    // );
  }

  render () {
    const { isFetching, item } = this.props;
    let buttonActions = [];

    if (!isFetching && item.actions) {
      buttonActions = item.actions.map(action => (
        action.action
      ));
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

CreditTransferEditContainer.propTypes = {
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
  getCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  item: state.rootReducer.creditTransfer.item,
  isFetching: state.rootReducer.creditTransfer.isFetching
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfer: (id) => { dispatch(getCreditTransfer(id)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferEditContainer);
