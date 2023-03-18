/*
 * Presentational component
 */
import React from "react";
import PropTypes from "prop-types";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import * as Lang from "../../constants/langEnUs";
import PERMISSIONS_ORGANIZATIONS from "../../constants/permissions/Organizations";
import { useNavigate } from "react-router";

const OrganizationEditForm = (props) => {
  const navigate = useNavigate();
  const orgStatuses = props.referenceData.organizationStatuses;
  return (
    <div className="organization-edit-details">
      <h1>{props.mode === "add" ? "Create " : "Edit "} Organization</h1>
      <div className="main-form">
        <div className="row">
          <div className="col-sm-6">
            {props.loggedInUser.hasPermission(
              PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS
            ) && (
              <div className="form-group">{
                console.log('ENTERED')
              }
                <label htmlFor="org_status" className="col-sm-4">
                  <div className="col-sm-4"> Supplier Status: </div>
                  <div className="col-sm-6">
                    <div key={orgStatuses[0].id}>
                      <label htmlFor='org-status-active'>
                      <input
                        type="radio"
                        id='org-status-active'
                        name="org_status"
                        value={orgStatuses[0].id}
                        onChange={props.handleInputChange}
                        checked={orgStatuses[0].id == props.fields.org_status}
                      />
                        <span> {orgStatuses[0].description} </span></label>{" "}
                    </div>
                    <div key={orgStatuses[1].id}>
                      
                      <label htmlFor='org-status-inactive'>
                        <input
                        type="radio"
                        id='org-status-inactive'
                        name="org_status"
                        value={orgStatuses[1].id}
                        onChange={props.handleInputChange}
                        checked={orgStatuses[1].id == props.fields.org_status}
                      /> 
                      <span> {orgStatuses[1].description}</span></label>{" "}
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
          <div className="col-sm-6">
            {props.mode === "add" && (
              <div className="form-group">
                <label htmlFor="org-type">
                  <div className="col-sm-4"> Supplier Type : </div>
                  {props.referenceData.organizationTypes
                    .filter((t) => t.id !== 1)
                    .map((t) => (
                      <div className="col-sm-8" key={t.id}>
                        {" "}
                        <input
                          type="radio"
                          id='org-type'
                          name="org_type"
                          value={t.id}
                          defaultChecked
                          onChange={props.handleInputChange}
                        />
                        <span> {t.description}</span>
                      </div>
                    ))}
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5">
            <h3>Head Office:</h3>
            <div className="form-group">
              <label htmlFor="organization-name">
                Organization Name:
                {props.loggedInUser.hasPermission(
                  PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS
                ) && (
                  <input
                    className="form-control"
                    id="organization-name"
                    name="org_name"
                    placeholder="Fuel Supplier Name"
                    onChange={props.handleInputChange}
                    value={props.fields.org_name}
                  />
                )}
                {!props.loggedInUser.hasPermission(
                  PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS
                ) && (
                  <div className="form-control read-only">
                    {props.fields.org_name}
                  </div>
                )}
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-address-line-1">
                Address Line 1:
                <input
                  className="form-control"
                  id="organization-address-line-1"
                  name="org_addressLine1"
                  onChange={props.handleInputChange}
                  value={props.fields.org_addressLine1 || ""}
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-address-line-2">
                Address Line 2:
                <input
                  className="form-control"
                  id="organization-address-line-2"
                  name="org_addressLine2"
                  onChange={props.handleInputChange}
                  value={props.fields.org_addressLine2 || ""}
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-city">
                City:
                <input
                  className="form-control"
                  id="organization-city"
                  name="org_city"
                  onChange={props.handleInputChange}
                  value={props.fields.org_city || ""}
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-state">
                Province / State:
                <input
                  className="form-control"
                  id="organization-state"
                  name="org_state"
                  onChange={props.handleInputChange}
                  value={props.fields.org_state || ""}
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-country">
                Country:
                <input
                  className="form-control"
                  id="organization-country"
                  name="org_country"
                  onChange={props.handleInputChange}
                  value={props.fields.org_country || ""}
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="organization-postal-code">
                Postal Code / ZIP:
                <input
                  className="form-control"
                  id="organization-postal-code"
                  name="org_postalCode"
                  onChange={props.handleInputChange}
                  value={props.fields.org_postalCode || ""}
                />
              </label>
            </div>
          </div>

          <div className="col-sm-5">
            <h3>Corporation or Attorney in B.C.</h3>
            <div className="form-group">
              <label htmlFor="att-representativeName">
                Name of Representative <span>(optional)</span> :{" "}
              <input
                className="form-control"
                id="att-representativeName"
                type="text"
                name="att_representativeName"
                placeholder="BC Attorney Firm Inc."
                onChange={props.handleInputChange}
                value={props.fields.att_representativeName}
                />
                </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-streetAddress">Street Address / PO Box
              <input
                className="form-control"
                id="att-streetAddress"
                type="text"
                name="att_streetAddress"
                placeholder="4567 Linden Way"
                onChange={props.handleInputChange}
                value={props.fields.att_streetAddress}
              />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-otherAddress">
                Address Other <span>(optional) :</span>
             
              <input
                className="form-control"
                type="text"
                name="att_otherAddress"
                id="att-otherAddress"
                onChange={props.handleInputChange}
                value={props.fields.att_otherAddress}
              />
               </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-city">City
              <input
                className="form-control"
                type="text"
                id="att-city"
                name="att_city"
                placeholder="Vancover"
                onChange={props.handleInputChange}
                value={props.fields.att_city}
              />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-province">Province
              <input
                className="form-control"
                id="att-province"
                type="text"
                name="att_province"
                placeholder="BC"
                onChange={props.handleInputChange}
                value={props.fields.att_province}
              />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-country">Country:
              <input
                className="form-control"
                id="att-country"
                type="text"
                name="att_country"
                placeholder="CA"
                onChange={props.handleInputChange}
                value={props.fields.att_country}
              />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="att-postalCode">Postal Code :
              <input
                className="form-control"
                id="att-postalCode"
                type="text"
                name="att_postalCode"
                placeholder="V8V 1V1"
                onChange={props.handleInputChange}
                value={props.fields.att_postalCode}
              />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="organization-actions">
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
            id="save-organization"
            onClick={(e) => props.handleSubmit(e)}
            type="submit"
          >
            <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE}
          </button>
        </div>
      </div>
    </div>
  );
};

OrganizationEditForm.defaultProps = {
  fields: {},
  loggedInUser: null,
  referenceData: {},
  mode: "add",
};

OrganizationEditForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    // addressLine3: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    // county: PropTypes.string,
    actionsType: PropTypes.number,
    status: PropTypes.number,
    type: PropTypes.number,
  }),
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
  }),
  referenceData: PropTypes.shape({
    organizationActionsTypes: PropTypes.arrayOf(PropTypes.shape()),
    organizationStatuses: PropTypes.arrayOf(PropTypes.shape()),
    organizationTypes: PropTypes.arrayOf(PropTypes.shape()),
  }),
  mode: PropTypes.oneOf(["add", "edit", "admin_edit"]),
};

export default OrganizationEditForm;
