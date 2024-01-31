/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as Lang from '../../constants/langEnUs'
import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations'
import { useNavigate } from 'react-router'
import NotFound from '../../app/components/NotFound'

const OrganizationEditForm = (props) => {
  const navigate = useNavigate()

  const orgStatuses = props.referenceData.organizationStatuses

  const getStatusDisplay = (description) => {
    if (description === 'Active') {
      return 'Yes'
    } else if (description === 'Inactive') {
      return 'No'
    }
    return description // fallback
  }

  if (!props.loggedInUser.isGovernmentUser && props.mode === 'edit') {
    return <NotFound />
  } else {
    return (
      <div className="organization-edit-details">
        <h1>{props.mode === 'add' ? 'Create ' : 'Edit '} Organization</h1>
        <div className="main-form">
          <div className="row">
            <div className="col-sm-5">
              {props.loggedInUser.hasPermission(
                PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS
              ) && (
                <div className="form-group">
                  <label htmlFor="org_status" className="col-sm-4">
                    <div className="col-sm-4 text-right">
                      {' '}
                      Registered for transfers:{' '}
                    </div>
                    <div className="col-sm-8">
                      <div key={orgStatuses[0].id}>
                        <label htmlFor="org-status-active">
                          <input
                            type="radio"
                            id="org-status-active"
                            name="org_status"
                            value={orgStatuses[0].id}
                            onChange={props.handleInputChange}
                            checked={
                              orgStatuses[0].id === props.fields.org_status
                            }
                          />
                          <span>
                            {' '}
                            {getStatusDisplay(orgStatuses[0].description)}
                          </span>
                        </label>{' '}
                      </div>
                      <div key={orgStatuses[1].id}>
                        <label htmlFor="org-status-inactive">
                          <input
                            type="radio"
                            id="org-status-inactive"
                            name="org_status"
                            value={orgStatuses[1].id}
                            onChange={props.handleInputChange}
                            checked={
                              orgStatuses[1].id === props.fields.org_status
                            }
                          />
                          <span>
                            {' '}
                            {getStatusDisplay(orgStatuses[1].description)}
                          </span>
                        </label>{' '}
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label htmlFor="org-type">
                  <div className="col-sm-4 text-right">
                    {' '}
                    Organization Type:{' '}
                  </div>
                  {props.referenceData.organizationTypes
                    .filter((t) => t.id !== 1)
                    .map((t) => (
                      <div className="col-sm-8" key={t.id}>
                        {' '}
                        <input
                          type="radio"
                          id="org-type"
                          name="org_type"
                          value={t.id}
                          defaultChecked
                          onChange={props.handleInputChange}
                        />
                        <span>
                          {' '}
                          {t.description === 'Part 3 Fuel Supplier'
                            ? 'Fuel Supplier'
                            : t.description}
                        </span>
                      </div>
                    ))}
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-5">
              <label>
                <h4>Company Profile, EDRMS Record # (optional):</h4>
                <input
                  className={`form-control ${
                    props.edrmsRecordError ? 'is-invalid' : ''
                  }`}
                  id="edrms-record"
                  name="edrms_record"
                  value={props.fields.edrms_record}
                  onChange={props.handleInputChange}
                />
                {props.edrmsRecordError && (
                  <div className="error-message">{props.edrmsRecordError}</div> // Display the error message
                )}
              </label>
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
                  Street Address / PO Box:
                  <input
                    className="form-control"
                    id="organization-address-line-1"
                    name="org_addressLine1"
                    onChange={props.handleInputChange}
                    value={props.fields.org_addressLine1 || ''}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="organization-address-line-2">
                  Address Other (optional):
                  <input
                    className="form-control"
                    id="organization-address-line-2"
                    name="org_addressLine2"
                    onChange={props.handleInputChange}
                    value={props.fields.org_addressLine2 || ''}
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
                    value={props.fields.org_city || ''}
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
                    value={props.fields.org_state || ''}
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
                    value={props.fields.org_country || ''}
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
                    value={props.fields.org_postalCode || ''}
                  />
                </label>
              </div>
            </div>

            <div className="col-sm-5">
              <h3>Corporation or Attorney in B.C. (optional)</h3>
              <div className="form-group">
                <label htmlFor="att-representativeName">
                  Name of Representative:{' '}
                  <input
                    className="form-control"
                    id="att-representativeName"
                    type="text"
                    name="att_representativeName"
                    onChange={props.handleInputChange}
                    value={props.fields.att_representativeName}
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="att-streetAddress">
                  Street Address / PO Box:
                  <input
                    className="form-control"
                    id="att-streetAddress"
                    type="text"
                    name="att_streetAddress"
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
                <label htmlFor="att-city">
                  City:
                  <input
                    className="form-control"
                    type="text"
                    id="att-city"
                    name="att_city"
                    onChange={props.handleInputChange}
                    value={props.fields.att_city}
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="att-province">
                  Province:
                  <input
                    disabled
                    className="form-control"
                    id="att-province"
                    type="text"
                    name="att_province"
                    value={props.fields.att_province}
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="att-country">
                  Country:
                  <input
                    disabled
                    className="form-control"
                    id="att-country"
                    type="text"
                    name="att_country"
                    value={props.fields.att_country}
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="att-postalCode">
                  Postal Code :
                  <input
                    className="form-control"
                    id="att-postalCode"
                    type="text"
                    name="att_postalCode"
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
              disabled={!props.formIsValid}
              className="btn btn-primary"
              id="save-organization"
              onClick={(e) => props.handleSubmit(e)}
              type="submit"
              data-target="#confirmSubmit"
            >
              <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

OrganizationEditForm.defaultProps = {
  fields: {},
  loggedInUser: null,
  referenceData: {},
  mode: 'add'
}

OrganizationEditForm.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    actionsType: PropTypes.number,
    status: PropTypes.number,
    type: PropTypes.number,
    org_status: PropTypes.number,
    org_name: PropTypes.string,
    org_addressLine1: PropTypes.string,
    org_addressLine2: PropTypes.string,
    org_city: PropTypes.string,
    org_country: PropTypes.string,
    org_postalCode: PropTypes.string,
    org_state: PropTypes.string,
    att_representativeName: PropTypes.string,
    att_city: PropTypes.string,
    att_country: PropTypes.string,
    att_otherAddress: PropTypes.string,
    att_streetAddress: PropTypes.string,
    att_province: PropTypes.string,
    att_postalCode: PropTypes.string,
    edrms_record: PropTypes.string
  }),
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool
  }),
  referenceData: PropTypes.shape({
    organizationActionsTypes: PropTypes.arrayOf(PropTypes.shape()),
    organizationStatuses: PropTypes.arrayOf(PropTypes.shape()),
    organizationTypes: PropTypes.arrayOf(PropTypes.shape())
  }),
  mode: PropTypes.oneOf(['add', 'edit', 'admin_edit']),
  formIsValid: PropTypes.bool.isRequired,
  edrmsRecordError: PropTypes.shape()
}

export default OrganizationEditForm
