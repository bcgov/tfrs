/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-bootstrap-autosuggest';

import CheckBox from '../../../app/components/CheckBox';
import FuelSupplierAdapter from '../../../app/components/FuelSupplierAdapter';
import ORGANIZATION_STATUSES from '../../../constants/organizationStatuses';

const UserFormDetails = props => (
  <div className="user-details">
    <div className="main-form">
      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="first-name">First Name:
              <input
                className="form-control"
                id="first-name"
                name="firstName"
                onChange={props.handleInputChange}
                required="required"
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="last-name">Last Name:
              <input
                className="form-control"
                id="last-name"
                name="lastName"
                onChange={props.handleInputChange}
                required="required"
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="bceid">BCeID:
              <input
                className="form-control"
                id="bceid"
                name="bceid"
                onChange={props.handleInputChange}
                required="required"
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="work-phone">Work Phone:
              <input
                className="form-control"
                id="work-phone"
                name="workPhone"
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="mobile-phone">Mobile Phone:
              <input
                className="form-control"
                id="mobile-phone"
                name="mobilePhone"
                onChange={props.handleInputChange}
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="email">Email:
              <input
                className="form-control"
                id="email"
                name="email"
                onChange={props.handleInputChange}
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="number-of-credits">Fuel Supplier:
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
                      value: selected.id
                    }
                  });
                }}
                placeholder="Select an Organization..."
                required
                type="text"
                valueIsItem
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="status">Status:
              <select
                className="form-control"
                id="status"
                name="status"
                onChange={props.handleInputChange}
                required="required"
              >
                {Object.values(ORGANIZATION_STATUSES).map(status => (
                  <option key={status.id} value={status.id}>{status.description}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="row">
          <div className="col-xs-6">
            <label htmlFor="status">Role(s):</label>
          </div>
        </div>

        <div className="row roles">
          {props.roles &&
            props.roles.items.map(role => (
              <div className="col-xs-4 checkbox-group" key={role.id}>
                <CheckBox
                  addToFields={props.addToFields}
                  className="checkbox"
                  fields={props.fields.roles}
                  id={role.id}
                  toggleCheck={props.toggleCheck}
                />
                <span className="text">{role.description}</span>
              </div>
            ))
          }
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
    roles: PropTypes.array
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  roles: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default UserFormDetails;
