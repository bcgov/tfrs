/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import InputWithTooltip from '../../../app/components/InputWithTooltip';

const CarbonIntensityLimitFormDetails = props => (
  <div className="carbon-intensity-limit-details">
    <div className="main-form">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Compliance Period:
              <div className="value">{props.item.description}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Current Carbon Intensity Limit for Diesel Class Fuel:
              <div className="value">{props.item.limits.diesel.density}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <div className="value">{props.item.limits.diesel.effectiveDate ? props.item.limits.diesel.effectiveDate : '2017-01-01'}</div>
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiration Date:
              <div className="value">{props.item.limits.diesel.expirationDate ? props.item.limits.diesel.expirationDate : 'N/A'}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="diesel-carbon-intensity">New Carbon Intensity Limit for Diesel Class Fuel:
              <InputWithTooltip
                allowNegative
                dataNumberToFixed={2}
                handleInputChange={props.handleInputChange}
                id="diesel-carbon-intensity"
                min="0"z
                name="dieselCarbonIntensity"
                required
                step="0.01"
                value={props.fields.dieselCarbonIntensity}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="diesel-effective-date">Effective Date:
              <input
                className="form-control"
                id="diesel-effective-date"
                max="9999-12-31"
                name="dieselEffectiveDate"
                onChange={props.handleInputChange}
                type="date"
                value={props.fields.dieselEffectiveDate}
              />
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="diesel-expiration-date">Expiration Date:
              <input
                className="form-control"
                id="diesel-expiration-date"
                max="9999-12-31"
                name="dieselExpirationDate"
                onChange={props.handleInputChange}
                type="date"
                value={props.fields.dieselExpirationDate}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Current Carbon Intensity Limit for Gasoline Class Fuel:
              <div className="value">{props.item.limits.gasoline.density}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <div className="value">{props.item.limits.gasoline.effectiveDate ? props.item.limits.gasoline.effectiveDate : '2017-01-01'}</div>
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiration Date:
              <div className="value">{props.item.limits.gasoline.expirationDate ? props.item.limits.gasoline.expirationDate : 'N/A'}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="gasoline-carbon-intensity">New Carbon Intensity Limit for Gasoline Class Fuel:
              <InputWithTooltip
                allowNegative
                dataNumberToFixed={2}
                handleInputChange={props.handleInputChange}
                id="gasoline-carbon-intensity"
                min="0"
                name="gasolineCarbonIntensity"
                required
                step="0.01"
                value={props.fields.gasolineCarbonIntensity}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="gasoline-effective-date">Effective Date:
              <input
                className="form-control"
                id="gasoline-effective-date"
                max="9999-12-31"
                name="gasolineEffectiveDate"
                onChange={props.handleInputChange}
                type="date"
                value={props.fields.gasolineEffectiveDate}
              />
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="gasoline-expiration-date">Expiration Date:
              <input
                className="form-control"
                id="gasoline-expiration-date"
                max="9999-12-31"
                name="gasolineExpirationDate"
                onChange={props.handleInputChange}
                type="date"
                value={props.fields.gasolineExpirationDate}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

CarbonIntensityLimitFormDetails.defaultProps = {
  edit: false
};

CarbonIntensityLimitFormDetails.propTypes = {
  edit: PropTypes.bool,
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
  handleInputChange: PropTypes.func.isRequired
};

export default CarbonIntensityLimitFormDetails;
