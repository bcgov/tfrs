/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CreditTradeHistoryPage from './components/CreditTradeHistoryPage';
import AdminTabs from '../components/AdminTabs';

class CreditTradeHistoryContainer extends Component {
  render () {
    return ([
      <AdminTabs
        active="user-activity"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <CreditTradeHistoryPage
        key="page"
      />
    ]);
  }
}

CreditTradeHistoryContainer.propTypes = {
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTradeHistoryContainer);
