/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import UserFormDetails from './UserFormDetails';
import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';

const UserForm = props => (
  <div className="page_admin_user">
    <h1>New User</h1>
    <form>
      <UserFormDetails
        addToFields={props.addToFields}
        fields={props.fields}
        roles={props.roles}
        toggleCheck={props.toggleCheck}
      />

      <div className="user-actions">
        <div className="btn-container">
          <button
            className="btn btn-default"
            onClick={() => history.goBack()}
            type="button"
          >
            <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
          </button>
          <button
            className="btn btn-primary"
            type="submit"
          >
            <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_USER}
          </button>
        </div>
      </div>
    </form>
  </div>
);

UserForm.defaultProps = {
};

UserForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    roles: PropTypes.array
  }).isRequired,
  roles: PropTypes.shape().isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default UserForm;
