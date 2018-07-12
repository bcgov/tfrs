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

class CreditTradeHistoryContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfersHistory();
  }

  render () {
    return (
      <CreditTradeHistoryPage
        data={this.props.historicalData}
      />
    );
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
  })
};

const mapStateToProps = state => ({
  historicalData: {
    items: state.rootReducer.creditTransfersHistory.items,
    isFetching: state.rootReducer.creditTransfersHistory.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfersHistory: bindActionCreators(getCreditTransfersHistory, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTradeHistoryContainer);
