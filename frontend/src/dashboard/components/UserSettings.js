import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as Routes from '../../constants/routes'

class UserSettings extends Component {
  constructor () {
    super()

    this.state = {
      unreadCount: 0
    }
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    if (newProps.unreadNotificationsCount != null) {
      let unreadCount = 0

      if (newProps.unreadNotificationsCount > 0 && newProps.unreadNotificationsCount < 1000) {
        unreadCount = newProps.unreadNotificationsCount
      }

      if (unreadCount > 1000) {
        unreadCount = '∞'
      }

      this.setState({
        unreadCount
      })
    }
  }

  render () {
    return (
      <div className="dashboard-fieldset user-settings">
        <h1>User Settings</h1>

        <p className='user-sub-head'>
          {this.props.loggedInUser.displayName}
          {this.props.loggedInUser.title &&
          this.props.loggedInUser.title !== '' &&
          `, ${this.props.loggedInUser.title}`}
        </p>

        <div className='user-settings-content'>
          <div className="content">
            <Link id="navbar-administration" to={Routes.SETTINGS_PROFILE}>
              User Profile
            </Link>
          </div>
          <p><br /></p>
          <div className="value">
            {this.state.unreadCount}
          </div>
          <div className="content">
            <Link id="navbar-administration" to={Routes.NOTIFICATIONS.LIST}>
              Notifications
            </Link>
          </div>
          <p><br /></p>
          <span className="icon">
            <FontAwesomeIcon icon={['far', 'bell']} />
          </span>

          <div className="content">
            <Link id="navbar-administration" to={Routes.SETTINGS}>
              Configure your notifications
            </Link>
          </div>
          <p><br /></p>
          <div className="content">
            <a
              href={`/assets/files/Transportation_Fuels_Reporting_System_-_${this.props.loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'}_Manual.pdf`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Help
            </a>
            <a
              href={`/assets/files/Transportation_Fuels_Reporting_System_-_${this.props.loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'}_Manual.pdf`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={['far', 'file-pdf']} />
            </a>
          </div>
          <p><br /></p>
          </div>
      </div>
    )
  }
}

UserSettings.defaultProps = {
}

UserSettings.propTypes = {
  loggedInUser: PropTypes.shape().isRequired
}

export default UserSettings
