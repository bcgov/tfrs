import React from 'react';
import userManager from '../store/oidc-usermanager';

class SigninPage extends React.Component {
  componentWillMount () {
    userManager.signinRedirect();
  }

  render () {
    return (<p>redirecting</p>);
  }
}

export default SigninPage;
