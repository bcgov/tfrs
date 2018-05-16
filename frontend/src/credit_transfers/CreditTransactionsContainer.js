/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions';
import { getLoggedInUser } from '../actions/userActions';
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
        loggedInUser={this.props.loggedInUser}
      />
    );
  }
}

CreditTransactionsContainer.propTypes = {
  getCreditTransfersIfNeeded: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired
};

const mapStateToProps = state => ({
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfersIfNeeded: () => {
    dispatch(getCreditTransfersIfNeeded());
  },
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionsContainer);
