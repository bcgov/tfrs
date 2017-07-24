import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
  
  render() {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Dashboard)
