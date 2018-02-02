/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCreditTransfer } from '../actions/creditTransfersActions';
import CreditTransferDetails from './components/CreditTransferDetails';

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfer(this.props.match.params.id);
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    // Submit status change to API
  }

  render () {
    const { isFetching, item } = this.props;
    console.log(this.props);
    return (
      <CreditTransferDetails
        creditsFrom={item.creditsFrom}
        creditsTo={item.creditsTo}
        numberOfCredits={item.numberOfCredits}
        fairMarketValuePerCredit={item.fairMarketValuePerCredit}
        totalValue={item.totalValue}
        isFetching={isFetching}
        tradeType={item.type}
        handleSubmit={this._handleSubmit}
      />
    );
  }
}

CreditTransferViewContainer.propTypes = {
  item: PropTypes.shape({
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
    ])
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
