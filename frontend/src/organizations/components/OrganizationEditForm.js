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
            <label htmlFor="organization-type">Organization Type:
              <select
                className="form-control"
                id="organization-type"
                name="type"
                onChange={props.handleInputChange}
                value={props.fields.type}
              >
                {props.referenceData.organizationTypes.map(
                  t => (<option key={t.id} value={t.id}>{t['type']}</option>))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="organization-actions-type">Organization Actions Type:
              <select
                className="form-control"
                id="organization-actions-type"
                name="actionsType"
                onChange={props.handleInputChange}
                value={props.fields.actionsType}
              >
                {props.referenceData.organizationActionsTypes.map(
                  t => (<option key={t.id} value={t.id}>{t.theType}</option>))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="organization-status">Organization Status:
              <select
                className="form-control"
                id="organization-status"
                name="status"
                onChange={props.handleInputChange}
                value={props.fields.status}
              >
                {props.referenceData.organizationStatuses.map(
                  t => (<option key={t.id}  value={t.id}>{t.status}</option>))}
              </select>
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
                name="addressLine_1"
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
                name="addressLine_2"
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
                name="addressLine_3"
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
                name="postalCode"
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

OrganizationEditForm.defaultProps = {};

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
    actionsType: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string
  }),
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  referenceData: PropTypes.object
};

export default OrganizationEditForm;
