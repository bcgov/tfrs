/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import UserFormDetails from './UserFormDetails';
import Errors from '../../../app/components/Errors';
import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';

const UserForm = props => (
  <div className="page_admin_user">
    <h1>{props.title}</h1>
    <form>
      <UserFormDetails
        addToFields={props.addToFields}
        fields={props.fields}
        fuelSuppliers={props.fuelSuppliers}
        handleInputChange={props.handleInputChange}
        loggedInUser={props.loggedInUser}
        roles={props.roles}
        toggleCheck={props.toggleCheck}
      />

      {Object.keys(props.errors).length > 0 &&
      <Errors errors={props.errors} />
      }

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
            data-target="#confirmSubmit"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_USER}
          </button>
        </div>
      </div>
    </form>
  </div>
);

UserForm.defaultProps = {
  errors: []
};

UserForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    roles: PropTypes.array
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
  }).isRequired,
  roles: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
  toggleCheck: PropTypes.func.isRequired,
  errors: PropTypes.shape()

};

export default UserForm;
