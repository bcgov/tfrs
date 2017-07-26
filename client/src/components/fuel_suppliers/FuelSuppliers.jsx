import React, { Component } from 'react';
import { connect } from 'react-redux';

class FuelSuppliers extends Component {
  
  render() {
    return (
      <div className="fuel-suppliers">
        <h1>Fuel Suppliers</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(FuelSuppliers)
