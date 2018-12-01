import React from 'react';
import userManager from '../store/oidc-usermanager';

class SigninPage extends React.Component {
  componentWillMount () {
    console.log('redirect fired');
   // userManager.signinRedirect();
  }

  render () {
    return (<p>redirecting</p>);
  }
}

export default SigninPage;
