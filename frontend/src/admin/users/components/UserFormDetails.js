/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../../../app/components/CheckBox';

const UserFormDetails = props => (
  <div className="user-details">
    <div className="main-form">
      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="number-of-credits">First Name:
              <input
                className="form-control"
                id="first-name"
                name="firstName"
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
            <label htmlFor="number-of-credits">Last Name:
              <input
                className="form-control"
                id="last-name"
                name="lastName"
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
            <label htmlFor="number-of-credits">BCeID:
              <input
                className="form-control"
                id="bceid"
                name="bceid"
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
            <label htmlFor="number-of-credits">Work Phone:
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
            <label htmlFor="number-of-credits">Mobile Phone:
              <input
                className="form-control"
                id="mobile-phone"
                name="mobilePhone"
                type="text"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-6">
          <div className="form-group">
            <label htmlFor="number-of-credits">Email:
              <input
                className="form-control"
                id="email"
                name="email"
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
              <input
                className="form-control"
                id="organization"
                name="organization"
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
            <label htmlFor="status">Status:
              <select
                className="form-control"
                id="status"
                name="status"
                required="required"
              >
                <option>Active</option>
                <option>Inactive</option>
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
              <div className="col-xs-3 checkbox-group" key={role.id}>
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
  roles: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default UserFormDetails;
