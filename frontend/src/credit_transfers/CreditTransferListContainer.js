/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCreditTransfers } from '../actions/creditTransfersActions';

import CreditTransferList from './components/CreditTransferList';

class CreditTransferListContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfers();
  }

  render () {
    const { isFetching, items } = this.props.creditTransfers;
    const isEmpty = items.length === 0;
    return (
      <CreditTransferList
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
    );
  }
}

CreditTransferListContainer.propTypes = {
  getCreditTransfers: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape({
    items: PropTypes.array.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferListContainer);
