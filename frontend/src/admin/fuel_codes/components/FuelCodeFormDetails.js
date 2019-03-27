/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import AutocompletedInput from './AutocompletedInput';

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
            <label htmlFor="company">Company (full legal operating name):
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.company"
                value={props.fields.company}
                inputProps={
                  {
                    required: true,
                    name: 'company',
                    id: 'company'
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
            <label htmlFor="carbon-intensity">Carbon Intensity (gCO<sub>2</sub>e/MJ):
              <input
                className="form-control"
                id="carbon-intensity"
                name="carbonIntensity"
                onChange={props.handleInputChange}
                required="required"
                step="0.01"
                type="number"
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
              <select
                className="form-control"
                name="fuel"
                onChange={props.handleInputChange}
                required="required"
                id="fuel"
                value={props.fields.fuel}
              >
                <option key="0" value="" default />
                {props.approvedFuels.map(mode => (
                  <option key={mode.name} value={mode.name}>{mode.name}</option>
                ))}
              </select>
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
                    id: 'feedstock'
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
            <label htmlFor="feedstock-location">Feedstock Location (e.g. US Central, Manitoba, Japan):
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.feedstock_location"
                value={props.fields.feedstockLocation}
                inputProps={
                  {
                    required: true,
                    name: 'feedstockLocation',
                    id: 'feedstockLocation'
                  }
                }
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock-miscellaneous">Feedstock Misc (e.g. methane capture, no peat, etc.):
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.feedstock_misc"
                value={props.fields.feedstockMisc}
                inputProps={
                  {
                    required: false,
                    name: 'feedstockMisc',
                    id: 'feedstockMisc'
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
            <label htmlFor="facility-location">Fuel Production Facility Location (City, Province/State/Country):
              <AutocompletedInput
                handleInputChange={props.handleInputChange}
                autocompleteFieldName="fuel_code.facility_location"
                value={props.fields.facilityLocation}
                inputProps={
                  {
                    required: true,
                    name: 'facilityLocation',
                    id: 'facilityLocation'
                  }
                }
              />
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="facility-nameplate">Fuel Production Facility Nameplate Capacity (litres/GJ per year):
              <input
                className="form-control"
                id="facility-nameplate"
                name="facilityNameplate"
                onChange={props.handleInputChange}
                type="number"
                value={props.fields.facilityNameplate}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="feedstock-transport-mode">Feedstock Transport Mode (use ctrl key to select multiple modes):
              <select
                multiple
                className="form-control"
                name="feedstockTransportMode"
                onChange={props.handleInputChange}
                id="feedstock-transport-mode"
                value={props.fields.feedstockTransportMode}
              >
                {props.transportModes.map(mode => (
                  <option
                    key={mode.name}
                    value={mode.name}
                  >
                    {mode.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-transport-mode">Finished Fuel Transport Mode (use ctrl key to select multiple modes):
              <select
                multiple
                className="form-control"
                name="fuelTransportMode"
                onChange={props.handleInputChange}
                id="fuel-transport-mode"
                value={props.fields.fuelTransportMode}
              >
                {props.transportModes.map(mode => (
                  <option
                    key={mode.name}
                    value={mode.name}
                  >
                    {mode.name}
                  </option>
                ))}
              </select>
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
                  required: false,
                  name: 'formerCompany',
                  id: 'formerCompany'
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
    facilityNameplate: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    feedstock: PropTypes.string,
    feedstockLocation: PropTypes.string,
    feedstockMisc: PropTypes.string,
    feedstockTransportMode: PropTypes.arrayOf(PropTypes.string),
    formerCompany: PropTypes.string,
    fuel: PropTypes.string,
    fuelCode: PropTypes.string,
    fuelTransportMode: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  approvedFuels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  transportModes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default FuelCodeFormDetails;
