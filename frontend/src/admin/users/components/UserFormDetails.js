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
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.lastName}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="bceid">BCeID Email Address:
              <input
                className="form-control"
                id="bceid"
                name="bceid"
                onChange={props.handleInputChange}
                required="required"
                type="email"
                value={props.fields.bceid}
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
        {document.location.pathname.indexOf('/users/') === 0 &&
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="organization" id="organization">Fuel Supplier:
              {props.loggedInUser.isGovernmentUser &&
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
              {!props.loggedInUser.isGovernmentUser &&
                <div
                  className="form-control read-only"
                  name="organization"
                  type="text"
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
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="status">Role(s):</label>
          </div>
        </div>

        <div className="row roles" id="user-roles">
          {props.roles &&
            props.roles.items.map(role => (
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
      </div>

      <div className="row">
        <div className="col-sm-12">
        * Hover over the roles to view the permissions available to that role.
        </div>
      </div>
    </div>
  </div>
);

UserFormDetails.defaultProps = {
};

UserFormDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    bceid: PropTypes.string,
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
    workPhone: PropTypes.string
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  }).isRequired,
  roles: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default UserFormDetails;
