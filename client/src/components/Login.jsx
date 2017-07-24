import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { authStateChanged, login } from '../actions/loginActions.jsx';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      passwordText: '',
    }
  }

  componentDidMount() {
    //check if authorized handle after using this.props.user
    //this.props.authStateChanged()
  }

  onSubmit() {
    this.props.login(this.state.emailText, this.state.passwordText);
  }

  handlePasswordChange(e) {
    this.setState({
      passwordText: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      emailText: e.target.value
    });
  }
  
  render() {
    return (
      <div>
        <input type='text' onChange={this.handleEmailChange.bind(this)} />
        <input type='password' onChange={this.handlePasswordChange.bind(this)} />
        <div onClick={() => this.onSubmit()}>{'Submit'}</div>
      </div>
    )
  }
}

export default connect (
  state => ({
    data: state.rootReducer.login.data,
    success: !state.rootReducer.login.didFail,
    loading: state.rootReducer.login.isFetching,
    user: state.rootReducer.authenticate.user,
    loadingUser: state.rootReducer.authenticate.isFetching,
    successfulAuthentication: !state.rootReducer.authenticate.didFail,
  }),
  dispatch => ({
    login: (email, password) => {
      dispatch(login(email, password));
    },
    authStateChanged: () => {
      dispatch(authStateChanged());
    }
  })
)(Login)
