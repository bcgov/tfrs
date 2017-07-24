import React, { Component } from 'react';
import { connect } from 'react-redux';

class AccountActivity extends Component {
  
  render() {
    return (
      <div className="account-activity">
        <h1>Account Activity</h1>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(AccountActivity)
