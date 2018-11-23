/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CreditTransactionRequestsPage from './components/CreditTransactionRequestsPage';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';

class CreditTransactionRequestsContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
  }

  render () {
    return (
      <CreditTransactionRequestsPage
        title="Secure Document Upload"
      />
    );
  }
}

CreditTransactionRequestsContainer.defaultProps = {
};

CreditTransactionRequestsContainer.propTypes = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestsContainer);
