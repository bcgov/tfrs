/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCreditTransfers } from '../actions/creditTransfersActions';
import CreditTransferList from './components/CreditTransferList';

class CreditTransferViewContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCreditTransfers();
  }

  render () {
    const { isFetching, items } = this.props;
    return (
      <CreditTransferList items={items}
                          isFetching={isFetching}
                          />
    );
  }
}

CreditTransferViewContainer.propTypes = {
  items: PropTypes.array.isRequired,
  getCreditTransfers: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  items: state.rootReducer.creditTransfers.items,
  isFetching: state.rootReducer.creditTransfers.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  getCreditTransfers: () => { dispatch(getCreditTransfers()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
