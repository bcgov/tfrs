/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Autosuggest from 'react-bootstrap-autosuggest';

import CheckBox from '../../../app/components/CheckBox';
import FuelSupplierAdapter from '../../../app/components/FuelSupplierAdapter';

const UserFormDetails = props => (
  <div className="user-details">
    <div className="main-form">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="first-name">First Name:
              <input
                className="form-control"
                id="first-name"
                name="firstName"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.firstName}
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="last-name">Last Name:
              <input
                className="form-control"
                id="last-name"
                name="lastName"
                required="required"
                onChange={props.handleInputChange}
                type="text"
                value={props.fields.lastName}
              />
            </label>
          </div>
        </div>
      </div>

      {props.fields.userCreationRequest &&
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="keycloak-email">
              {document.location.pathname.indexOf('/admin/users/') < 0 &&
                'BCeID Email Address:'}
              {document.location.pathname.indexOf('/admin/users/') >= 0 &&
                'IDIR Email Address:'}
              {props.isAdding &&
                <input
                  className="form-control"
                  id="keycloak-email"
                  name="keycloakEmail"
                  onChange={props.handleInputChange}
                  required="required"
                  type="email"
                  value={props.fields.userCreationRequest.keycloakEmail}
                />
              }
              {!props.isAdding &&
                <div
                  className="form-control read-only"
                >
                  {props.fields.userCreationRequest.keycloakEmail === ''
                    ? <em>None</em>
                    : props.fields.userCreationRequest.keycloakEmail
                  }
                </div>
              }
            </label>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="external-username">
              {document.location.pathname.indexOf('/admin/users/') < 0 &&
                'BCeID:'}
              {document.location.pathname.indexOf('/admin/users/') >= 0 &&
                'IDIR Username:'}
              {props.isAdding &&
                <input
                  className="form-control"
                  id="external-username"
                  maxLength="150"
                  name="externalUsername"
                  onChange={props.handleInputChange}
                  required="required"
                  type="text"
                  value={props.fields.userCreationRequest.externalUsername}
                />
              }
              {!props.isAdding &&
                <div
                  className="form-control read-only"
                >
                  {props.fields.userCreationRequest.externalUsername === ''
                    ? <em>None</em>
                    : props.fields.userCreationRequest.externalUsername
                  }
                </div>
              }
            </label>
          </div>
        </div>
      </div>
      }

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="title">Title:
              <input
                className="form-control"
                id="title"
                name="title"
                onChange={props.handleInputChange}
                type="text"
                value={props.fields.title}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="work-phone">Work Phone:
              <input
                className="form-control"
                id="work-phone"
                name="workPhone"
                onChange={props.handleInputChange}
                type="tel"
                value={props.fields.workPhone}
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="mobile-phone">Mobile Phone:
              <input
                className="form-control"
                id="mobile-phone"
                name="mobilePhone"
                onChange={props.handleInputChange}
                type="tel"
                value={props.fields.mobilePhone}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="email">Email:
              <input
                className="form-control"
                id="email"
                name="email"
                onChange={props.handleInputChange}
                type="email"
                value={props.fields.email}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        {props.fuelSuppliers &&
        document.location.pathname.indexOf('/admin/users/') < 0 &&
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="organization" id="organization">Fuel Supplier:
              {props.loggedInUser.isGovernmentUser &&
              document.location.pathname.indexOf('/users/add') === 0 &&
                <Autosuggest
                  datalist={props.fuelSuppliers}
                  datalistOnly
                  itemAdapter={new FuelSupplierAdapter()}
                  itemValuePropName="name"
                  name="organization"
                  onChange={(selected) => {
                    props.handleInputChange({
                      target: {
                        name: 'organization',
                        value: selected
                      }
                    });
                  }}
                  placeholder="Select an Organization..."
                  type="text"
                  value={props.fields.organization}
                  valueIsItem
                />
              }
              {props.fields.organization &&
              props.loggedInUser.isGovernmentUser &&
              (document.location.pathname.indexOf('/users/edit') === 0 ||
              document.location.pathname.indexOf('/organizations/view/') === 0) &&
                <div
                  className="form-control read-only"
                >
                  {props.fields.organization.name}
                </div>
              }
              {!props.loggedInUser.isGovernmentUser &&
                <div
                  className="form-control read-only"
                >
                  {props.loggedInUser.organization.name}
                </div>
              }
            </label>
          </div>
        </div>
        }
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="status">Status:
              {props.editPrimaryFields &&
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  onChange={props.handleInputChange}
                  required="required"
                  value={props.fields.status}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              }
              {!props.editPrimaryFields &&
                <div className="form-control read-only capitalized">
                  {props.fields.status}
                </div>
              }
            </label>
          </div>
        </div>
      </div>

      {props.editPrimaryFields &&
      props.roles &&
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="status">Role(s):</label>
            </div>
          </div>

          <div className="row roles" id="user-roles">
            {props.roles.items.filter((role) => {
              if (document.location.pathname.indexOf('/admin/users/') >= 0) {
                return role.isGovernmentRole;
              }

              return !role.isGovernmentRole;
            }).map(role => (
              <div className="col-sm-4 checkbox-group" key={role.id}>
                <CheckBox
                  addToFields={props.addToFields}
                  className="checkbox"
                  fields={props.fields.roles}
                  id={role.id}
                  toggleCheck={props.toggleCheck}
                />
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id={`tooltip-${role.id}`} placement="top">
                      <ul>
                        <div className="heading">This role will have the ability to:</div>
                        {role.permissions &&
                          role.permissions.map(permission => (
                            <li className="permission" key={permission.id}>{permission.name}</li>
                          ))
                        }
                      </ul>
                    </Tooltip>
                  )}
                >
                  <span className="text">{role.description}</span>
                </OverlayTrigger>
              </div>
            ))
            }
          </div>

          <div className="row">
            <div className="col-sm-12">
            * Hover over the roles to view the permissions available to that role.
            </div>
          </div>
        </div>
      }
    </div>
  </div>
);

UserFormDetails.defaultProps = {
  fuelSuppliers: null,
  roles: null,
  toggleCheck: null
};

UserFormDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  editPrimaryFields: PropTypes.bool.isRequired,
  fields: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    mobilePhone: PropTypes.string,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    roles: PropTypes.array,
    status: PropTypes.string,
    title: PropTypes.string,
    userCreationRequest: PropTypes.shape({
      externalUsername: PropTypes.string,
      keycloakEmail: PropTypes.string
    }),
    workPhone: PropTypes.string
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()),
  handleInputChange: PropTypes.func.isRequired,
  isAdding: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  }).isRequired,
  roles: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFinding: PropTypes.bool.isRequired
  }),
  toggleCheck: PropTypes.func
};

export default UserFormDetails;
