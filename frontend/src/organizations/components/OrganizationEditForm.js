/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import * as Lang from "../../constants/langEnUs";

const OrganizationEditForm = props => (
  <div className="organization-edit-details">
      <h1>
        Editing {props.fields.name}
      </h1>
        <div className="main-form">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-name">Organization Name:
                  <input
                    className="form-control"
                    id="organization-name"
                    name="name"
                    onChange={props.handleInputChange}
                    value={props.fields.name}
                  />
                </label>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-address-line-1">Address Line 1:
                  <input
                    className="form-control"
                    id="organization-address-line-1"
                    name="address-line-1"
                    onChange={props.handleInputChange}
                    value={props.fields.addressLine_1}
                  />
                </label>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-address-line-2">Address Line 2:
                  <input
                    className="form-control"
                    id="organization-address-line-2"
                    name="address-line-2"
                    onChange={props.handleInputChange}
                    value={props.fields.addressLine_2}
                  />
                </label>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-address-line-3">Address Line 3:
                  <input
                    className="form-control"
                    id="organization-address-line-3"
                    name="address-line-3"
                    onChange={props.handleInputChange}
                    value={props.fields.addressLine_3}
                  />
                </label>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-city">City:
                  <input
                    className="form-control"
                    id="organization-city"
                    name="city"
                    onChange={props.handleInputChange}
                    value={props.fields.city}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-postal-code">Postal Code:
                  <input
                    className="form-control"
                    id="organization-postal-code"
                    name="postal-code"
                    onChange={props.handleInputChange}
                    value={props.fields.postalCode}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-county">County:
                  <input
                    className="form-control"
                    id="organization-county"
                    name="county"
                    onChange={props.handleInputChange}
                    value={props.fields.county}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-state">State:
                  <input
                    className="form-control"
                    id="organization-state"
                    name="state"
                    onChange={props.handleInputChange}
                    value={props.fields.state}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="organization-country">Country:
                  <input
                    className="form-control"
                    id="organization-country"
                    name="country"
                    onChange={props.handleInputChange}
                    value={props.fields.country}
                  />
                </label>
              </div>
            </div>
          </div>
      </div>
    <button
      type="submit"
      className="btn btn-primary"
      onClick={(e) => props.handleSubmit(e)}
    >
      {Lang.BTN_SAVE}
    </button>
  </div>
);

OrganizationEditForm.defaultProps = {
};

OrganizationEditForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
    addressLine_1: PropTypes.string,
    addressLine_2: PropTypes.string,
    addressLine_3: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    county: PropTypes.string,
    status: PropTypes.number,
  actionsType: PropTypes.number}),
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default OrganizationEditForm;
