import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import CONFIG from '../config';
import CallableModal from '../app/components/CallableModal';
import * as Lang from '../constants/langEnUs';

class Login extends React.Component {
  constructor () {
    super();

    this.state = {
      hideModal: false
    };

    this.userAgent = window.navigator.userAgent;
    this.redirectUri = window.location.href;

    this._closeModal = this._closeModal.bind(this);
  }

  _closeModal () {
    this.setState({
      hideModal: true
    });
  }

  render () {
    const { hideModal } = this.state;

    let showModal = false;

    if (!hideModal && (this.userAgent.indexOf('MSIE ') >= 0 || this.userAgent.indexOf('Trident/') >= 0)) {
      showModal = true;
    }

    return (
      <div id="login">
        <div id="header" className="login-tfrs-page-header">
          <div id="header-wrapper" className="login-tfrs-page-header-text">Transportation Fuels Reporting System</div>
        </div>
        <div className="login-tfrs-page">
          <div className="login-tfrs-brand" />
          <div className="card-tfrs">
            <div className="buttons-section">
              <div className="oidc">
                <a href={`${CONFIG.KEYCLOAK.AUTHORITY}/protocol/openid-connect/auth?response_type=token&client_id=${CONFIG.KEYCLOAK.CLIENT_ID}&redirect_uri=${this.redirectUri}&kc_idp_hint=bceid`} id="link-bceid" className="oidc"> <span className="text">Login with</span> <span className="display-name">BCeID</span></a>
              </div>
              <div className="oidc">
                <a href={`${CONFIG.KEYCLOAK.AUTHORITY}/protocol/openid-connect/auth?response_type=token&client_id=${CONFIG.KEYCLOAK.CLIENT_ID}&redirect_uri=${this.redirectUri}&kc_idp_hint=idir`} id="link-idir" className="oidc"> <span className="text">Login with</span> <span className="display-name">IDIR</span></a>
              </div>
            </div>
          </div>
        </div>

        <CallableModal
          cancelLabel={Lang.BTN_OK}
          className="login-modal"
          close={() => {
            this._closeModal();
          }}
          id="no-ie"
          show={showModal}
        >
          <span className="no-ie-icon">
            <FontAwesomeIcon icon={['fab', 'internet-explorer']} size="4x" />
            <FontAwesomeIcon icon="ban" size="6x" />
          </span>
          <div className="content">
            <p>
              Internet Explorer is not fully supported,
              certain features within TFRS will not work.
            </p>
            <p>Please consider using a different browser such as Chrome, Firefox or Safari.</p>
            <button
              onClick={() => {
                this._closeModal();
              }}
              type="button"
            >
              OK
            </button>
          </div>
        </CallableModal>
      </div>
    );
  }
}

export default Login;
