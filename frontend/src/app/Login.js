import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'

import CallableModal from '../app/components/CallableModal'
import * as Lang from '../constants/langEnUs'
import { login } from '../actions/keycloakActions'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hideModal: false
    }

    this.userAgent = window.navigator.userAgent
    this.redirectUri = window.location.href

    this._closeModal = this._closeModal.bind(this)
  }

  _closeModal () {
    this.setState({
      hideModal: true
    })
  }

  render () {
    const { hideModal } = this.state
    const { login } = this.props

    let showModal = false

    if (!hideModal && (this.userAgent.indexOf('MSIE ') >= 0 || this.userAgent.indexOf('Trident/') >= 0)) {
      showModal = true
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
                <button
                  type="button"
                  onClick={() => login('bceid-business')}
                  id="link-bceid"
                  className="button"
                >
                  <span className="text"> Login with </span>
                  <span className="display-name"> BCeID </span>
                </button>
              </div>
              <div className="oidc">
                <button
                  type="button"
                  onClick={() => login('idir')}
                  id="link-idir"
                  className="button"
                >
                  <span className="text">Login with</span>
                  <span className="display-name"> IDIR </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <CallableModal
          cancelLabel={Lang.BTN_OK}
          className="login-modal"
          close={() => {
            this._closeModal()
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
                this._closeModal()
              }}
              type="button"
            >
              OK
            </button>
          </div>
        </CallableModal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  authenticated: state.userAuth.authenticated
})

const mapDispatchToProps = (dispatch) => {
  return {
    login: (hint) => dispatch(login(hint))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
