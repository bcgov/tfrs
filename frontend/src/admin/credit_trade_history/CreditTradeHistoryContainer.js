/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import CreditTradeHistoryPage from './components/CreditTradeHistoryPage';
import AdminTabs from '../components/AdminTabs';

class CreditTradeHistoryContainer extends Component {
  render () {
    return ([
      <AdminTabs active="user-activity" key="nav" />,
      <CreditTradeHistoryPage
        key="page"
      />
    ]);
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTradeHistoryContainer);
