/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCreditTransfers } from '../actions/creditTransfersActions';
import CreditTransactionsPage from './components/CreditTransactionsPage';

// import CreditTransferList from './components/CreditTransferList';

class CreditTransactionsContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfers();
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
  getCreditTransfers: PropTypes.func.isRequired,
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
  getCreditTransfers: () => {
    dispatch(getCreditTransfers());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionsContainer);
