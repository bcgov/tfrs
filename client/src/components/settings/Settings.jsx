import React, { Component } from 'react';
import { connect } from 'react-redux';

class Settings extends Component {
  
  render() {
    return (
      <div className="settings">
        <h1>Settings</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(Settings)
