import React, { Component } from 'react';
import { connect } from 'react-redux';

class Notifications extends Component {
  
  render() {
    return (
      <div className="notifications">
        <h1>Notifications</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Notifications)
