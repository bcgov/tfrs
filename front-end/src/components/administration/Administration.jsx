import React, { Component } from 'react';
import { connect } from 'react-redux';

class Administration extends Component {
  
  render() {
    return (
      <div className="administration">
        <h1>Administration</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Administration)
