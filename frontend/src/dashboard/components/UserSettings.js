import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as Routes from '../../constants/routes';

class UserSettings extends Component {
  constructor () {
    super();

    this.state = {
      unreadCount: 0
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.unreadNotificationsCount != null) {
      let unreadCount = 0;

      if (newProps.unreadNotificationsCount > 0 && newProps.unreadNotificationsCount < 1000) {
        unreadCount = newProps.unreadNotificationsCount;
      }

      if (unreadCount > 1000) {
        unreadCount = '∞';
      }

      this.setState({
        unreadCount
      });
    }
  }

  render () {
    return (
      <div className="dashboard-fieldset">
        <h1>User Settings</h1>

        <div>
          {this.props.loggedInUser.displayName},
          {this.props.loggedInUser.organization && ` ${this.props.loggedInUser.organization.name}`}
        </div>

        <div className="user-settings">
          <div className="content offset-value">
            <Link id="navbar-administration" to={Routes.SETTINGS_PROFILE}>
              User Profile
            </Link>
          </div>
        </div>

        <div className="user-settings">
          <div className="value">
            {this.state.unreadCount}
          </div>
          <div className="content">
            <Link id="navbar-administration" to={Routes.SETTINGS}>
              Notifications
            </Link>
          </div>
        </div>

        <div className="user-settings">
          <div className="content offset-value">
            <Link id="navbar-administration" to={Routes.SETTINGS}>
              Configure your notifications
            </Link>
          </div>
        </div>

        <div className="user-settings">
          <div className="content offset-value">
            <a
              href="/assets/files/Transportation_Fuels_Reporting_System_-_IDIR_Manual_v1.0.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Help
            </a>
          </div>
        </div>
      </div>
    );
  }
};

UserSettings.defaultProps = {
};

UserSettings.propTypes = {
  loggedInUser: PropTypes.shape().isRequired
};

export default UserSettings;
