/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import getCreditTransfersHistory from '../../actions/creditTransferHistoryActions';
import CreditTradeHistoryPage from './components/CreditTradeHistoryPage';
import AdminTabs from '../components/AdminTabs';

class CreditTradeHistoryContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfersHistory();
  }

  render () {
    return ([
      <AdminTabs
        active="user-activity"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <CreditTradeHistoryPage
        data={this.props.historicalData}
        key="page"
      />
    ]);
  }
}

CreditTradeHistoryContainer.defaultProps = {
  historicalData: {
    isFetching: true,
    items: []
  }
};

CreditTradeHistoryContainer.propTypes = {
  getCreditTransfersHistory: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }),
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
  historicalData: {
    items: state.rootReducer.creditTransfersHistory.items,
    isFetching: state.rootReducer.creditTransfersHistory.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfersHistory: bindActionCreators(getCreditTransfersHistory, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTradeHistoryContainer);
