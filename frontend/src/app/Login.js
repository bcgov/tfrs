import React from 'react';

import CONFIG from '../config';
import * as Routes from '../constants/routes';

class Login extends React.Component {
  constructor () {
    super();

    this.userAgent = window.navigator.userAgent;
  }

  render () {
    return (
      <div id="login">
        <div id="header" className="login-tfrs-page-header">
          <div id="header-wrapper" className="login-tfrs-page-header-text">Transportation Fuels Reporting System</div>
        </div>
        <div className="login-tfrs-page">
          <div className="login-tfrs-brand" />
          <div className="card-tfrs">
            <div className="social-section">
              <div className="oidc">
                <a href={`${CONFIG.KEYCLOAK.AUTHORITY}/protocol/openid-connect/auth?response_type=token&client_id=${CONFIG.KEYCLOAK.CLIENT_ID}&redirect_uri=${Routes.BASE_URL}&kc_idp_hint=bceid`} id="link-bceid" className="oidc"> <span className="text">Login with</span> <span className="display-name">BCeID</span></a>
              </div>
              <div className="oidc">
                <a href={`${CONFIG.KEYCLOAK.AUTHORITY}/protocol/openid-connect/auth?response_type=token&client_id=${CONFIG.KEYCLOAK.CLIENT_ID}&redirect_uri=${Routes.BASE_URL}&kc_idp_hint=idir`} id="link-idir" className="oidc"> <span className="text">Login with</span> <span className="display-name">IDIR</span></a>
              </div>
            </div>
          </div>
          {(this.userAgent.indexOf('MSIE ') >= 0 || this.userAgent.indexOf('Trident/') >= 0) &&
            <div className="ie-specific">We have detected that you are running a browser that is not fully supported by <span className="realm-name">Transportation Fuels Reporting System</span>. <br />We currently support Chrome, Firefox, Safari. <br />Please use one of our supported browsers to access <span className="realm-name">Transportation Fuels Reporting System</span>.</div>
          }
        </div>
      </div>
    );
  }
}

export default Login;
