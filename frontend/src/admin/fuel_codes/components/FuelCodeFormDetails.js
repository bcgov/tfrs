/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import AutocompletedInput from "./AutocompletedInput";

const FuelCodeFormDetails = props => (
  <div className="fuel-code-details">
    <div className="main-form">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Low Carbon Fuel Code:
              <div
                className="input-group"
              >
                <span className="input-group-addon">BCLCF</span>
                <input
                  className="form-control"
                  id="fuel-code"
                  name="fuelCode"
                  onChange={props.handleInputChange}
                  required="required"
                  type="text"
                  value={props.fields.fuelCode}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="company">Company:
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.company"
                value={props.fields.company}
                inputProps={
                  {
                    required: true,
                    name: 'company',
                    id:'company'
                  }
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="carbon-intensity">Carbon Intensity:
              <input
                className="form-control"
                id="carbon-intensity"
                name="carbonIntensity"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.carbonIntensity}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="application-date">Application Date:
              <input
                className="form-control"
                id="application-date"
                max="9999-12-31"
                name="applicationDate"
                onChange={props.handleInputChange}
                required="required"
                type="date"
                value={props.fields.applicationDate}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <input
                className="form-control"
                id="effective-date"
                max="9999-12-31"
                name="effectiveDate"
                onChange={props.handleInputChange}
                required="required"
                type="date"
                value={props.fields.effectiveDate}
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiry Date:
              <input
                className="form-control"
                id="expiry-date"
                max="9999-12-31"
                name="expiryDate"
                onChange={props.handleInputChange}
                required="required"
                type="date"
                value={props.fields.expiryDate}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel">Fuel:
              <input
                className="form-control"
                id="fuel"
                name="fuel"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.fuel}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock">Feedstock:
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.feedstock"
                value={props.fields.feedstock}
                inputProps={
                  {
                    required: true,
                    name: 'feedstock',
                    id:'feedstock'
                  }
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock-location">Feedstock Location:
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.feedstock_location"
                value={props.fields.feedstockLocation}
                inputProps={
                  {
                    required: true,
                    name: 'feedstockLocation',
                    id:'feedstockLocation'
                  }
                }
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock-miscellaneous">Feedstock Miscellaneous:
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.feedstock_misc"
                value={props.fields.feedstockMiscellaneous}
                inputProps={
                  {
                    required: true,
                    name: 'feedstockMiscellaneous',
                    id:'feedstockMiscellaneous'
                  }
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="facility-location">Fuel Production Facility Location:
              <input
                className="form-control"
                id="facility-location"
                name="facilityLocation"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.facilityLocation}
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="facility-nameplate">Fuel Production Facility Nameplate Capacity:
              <input
                className="form-control"
                id="facility-nameplate"
                name="facilityNameplate"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.facilityNameplate}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock-transport-mode">Feedstock Transport Mode:
              <input
                className="form-control"
                id="feedstock-transport-mode"
                name="feedstockTransportMode"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.feedstockTransportMode}
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-transport-mode">Finished Fuel Transport Mode:
              <input
                className="form-control"
                id="fuel-transport-mode"
                name="fuelTransportMode"
                onChange={props.handleInputChange}
                required="required"
                type="text"
                value={props.fields.fuelTransportMode}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <label htmlFor="former-company-name">Former Company Name:
            <AutocompletedInput
              handleInputChange={props.handleInputChange}
              autocompleteFieldName="fuel_code.former_company"
              value={props.fields.formerCompany}
              inputProps={
                {
                  required: true,
                  name: 'formerCompany',
                  id:'formerCompany'
                }
              }
            />
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <label htmlFor="approval-date">Approval Date:
            <input
              className="form-control"
              id="approval-date"
              max="9999-12-31"
              name="approvalDate"
              onChange={props.handleInputChange}
              required="required"
              type="date"
              value={props.fields.approvalDate}
            />
          </label>
        </div>
      </div>
    </div>
  </div>
);

FuelCodeFormDetails.defaultProps = {};

FuelCodeFormDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    applicationDate: PropTypes.string,
    approvalDate: PropTypes.string,
    carbonIntensity: PropTypes.string,
    company: PropTypes.string,
    effectiveDate: PropTypes.string,
    expiryDate: PropTypes.string,
    facilityLocation: PropTypes.string,
    facilityNameplate: PropTypes.string,
    feedstock: PropTypes.string,
    feedstockLocation: PropTypes.string,
    feedstockMiscellaneous: PropTypes.string,
    feedstockTransportMode: PropTypes.string,
    formerCompany: PropTypes.string,
    fuel: PropTypes.string,
    fuelCode: PropTypes.string,
    fuelTransportMode: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default FuelCodeFormDetails;
