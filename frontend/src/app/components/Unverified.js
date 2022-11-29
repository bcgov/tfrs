import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { logout } from '../../actions/keycloakActions'
import { connect } from 'react-redux'

const Unverified = (props) => {
  return (
    <div
      className='unverified'
    >
      <div className="alert alert-danger error-alert" role="alert">
        <p>Welcome to the Transportation Fuel Reporting System.</p>
        <p>It looks like you don&apos;t have an account setup yet, or that you are trying to access
          a page that you do not have permissions to see.
        </p>
        <p>You will need to
          <a href="mailto:lcfs@gov.bc.ca?subject=Account%20Setup%20for%20TFRS"> contact us </a>
          for help.
        </p>
        <p>
          <button
            className="button primary"
            onClick={() => {
              props.logout(props.token)
            }}
            type="button"
          >
            <FontAwesomeIcon icon="sign-out-alt" /> <span>Logout</span>
          </button>
        </p>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (token) => dispatch(logout(token))
  }
}

export default connect(null, mapDispatchToProps)(Unverified)
