import React, { Component } from 'react';
import { connect } from 'react-redux';


class App extends Component {
  
  login() {
    this.props.history.push('/login');
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to App</h2>
          <div onClick={() => this.login()}>Login here</div>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default connect (
  state => ({
    router: state.router
  }),
  dispatch => ({})
)(App)
