/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions';
import CreditTransactionsPage from './components/CreditTransactionsPage';

// import CreditTransferList from './components/CreditTransferList';

class CreditTransactionsContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfersIfNeeded();
  }

  render () {
    return (
      <CreditTransactionsPage
        title="Credit Transactions"
        creditTransfers={this.props.creditTransfers}
      />
    );
  }
}

CreditTransactionsContainer.propTypes = {
  getCreditTransfersIfNeeded: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfersIfNeeded: () => {
    dispatch(getCreditTransfersIfNeeded());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionsContainer);
