/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { getCreditTransfers } from '../actions/creditTransfersActions.js';

import * as ReducerTypes from '../constants/reducerTypes.jsx'

import CreditTransferList from './components/CreditTransferList'

class CreditTransferListContainer extends Component {

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    this.props.getCreditTransfers()
  }

  render(){
    const {isFetching, items} = this.props;
    return (
      <CreditTransferList items={items}
                          isFetching={isFetching}
                          />
    );
  }
}

CreditTransferListContainer.propTypes = {
  items: PropTypes.array.isRequired,
  getCreditTransfers: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  items: state.rootReducer.creditTransfers.items,
  isFetching: state.rootReducer.creditTransfers.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  getCreditTransfers: () => { dispatch(getCreditTransfers()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferListContainer);
