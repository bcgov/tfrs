/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import UserForm from '../../admin/users/components/UserForm';
import SettingsTabs from './SettingsTabs';

const UserProfileDetails = props => (
  <div className="page_user_profile">
    <SettingsTabs active="profile" />

    <UserForm
      addToFields={props.addToFields}
      fields={props.fields}
      handleInputChange={props.handleInputChange}
      loggedInUser={props.loggedInUser}
      title="User Profile"
    />
  </div>
);

UserProfileDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default UserProfileDetails;
