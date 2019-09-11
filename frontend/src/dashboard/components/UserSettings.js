import React from 'react';

const UserSettings = props => (
  <div className="dashboard-fieldset">
    <h1>User Settings</h1>

    <div>
      Richard Tan, Government Analyst
    </div>

    <div className="user-settings">
      <div className="content offset-value">
        <a href="">User profile</a>
      </div>
    </div>

    <div className="user-settings">
      <div className="value">
        6
      </div>
      <div className="content">
        <a href="">Notifications</a>
      </div>
    </div>

    <div className="user-settings">
      <div className="content offset-value">
        <a href="">Configure your notifications</a>
      </div>
    </div>

    <div className="user-settings">
      <div className="content offset-value">
        <a href="">Help</a>
      </div>
    </div>
  </div>
);

UserSettings.defaultProps = {
};

UserSettings.propTypes = {
};

export default UserSettings;
