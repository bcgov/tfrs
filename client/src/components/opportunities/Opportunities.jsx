import React, { Component } from 'react';
import { connect } from 'react-redux';

class Opportunities extends Component {
  
  render() {
    return (
      <div className="opportunities">
        <h1>Opportunities</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Opportunities)
