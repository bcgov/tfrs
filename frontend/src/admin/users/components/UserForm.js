/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import UserFormDetails from './UserFormDetails'
import Errors from '../../../app/components/Errors'
import * as Lang from '../../../constants/langEnUs'
import { useNavigate } from 'react-router'

const UserForm = props => {
  const navigate = useNavigate()
  return (
    <div className="page_admin_user">
      <h1>{props.title}</h1>
      <form>
        <UserFormDetails
          addToFields={props.addToFields}
          editPrimaryFields={props.editPrimaryFields}
          fields={props.fields}
          fuelSuppliers={props.fuelSuppliers}
          handleInputChange={props.handleInputChange}
          handleOrganizationSelect={props.handleOrganizationSelect}
          isAdding={props.isAdding}
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
              onClick={() => navigate(-1)}
              type="button"
            >
              <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
            </button>
            <button
              className="btn btn-primary"
              data-target="#confirmSubmit"
              data-toggle="modal"
              type="button"
              id="save-user"
            >
              <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_USER}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

UserForm.defaultProps = {
  editPrimaryFields: false,
  errors: {},
  fuelSuppliers: null,
  isAdding: false,
  roles: null,
  toggleCheck: null
}

UserForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  editPrimaryFields: PropTypes.bool,
  errors: PropTypes.shape(),
  fields: PropTypes.shape({
    roles: PropTypes.array
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()),
  handleInputChange: PropTypes.func.isRequired,
  handleOrganizationSelect: PropTypes.func,
  isAdding: PropTypes.bool,
  loggedInUser: PropTypes.shape({
  }).isRequired,
  roles: PropTypes.shape(),
  title: PropTypes.string.isRequired,
  toggleCheck: PropTypes.func
}

export default UserForm
