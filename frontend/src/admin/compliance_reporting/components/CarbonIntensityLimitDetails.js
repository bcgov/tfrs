/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import CREDIT_CALCULATIONS from '../../../constants/routes/CreditCalculations';

const CarbonIntensityLimitDetails = props => (
  <div className="page-carbon-intensity-limit-details">
    <div className="carbon-intensity-limit-details">
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
            <label htmlFor="fuel-code">Carbon Intensity Limit for Diesel Class Fuel:
              <div className="value">{props.item.limits.diesel.density}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <div className="value">{props.item.limits.diesel.effectiveDate}</div>
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiration Date:
              <div className="value">{props.item.limits.diesel.expirationDate}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Carbon Intensity Limit for Gasoline Class Fuel:
              <div className="value">{props.item.limits.gasoline.density}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <div className="value">{props.item.limits.gasoline.effectiveDate}</div>
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiration Date:
              <div className="value">{props.item.limits.gasoline.expirationDate}</div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.goBack()}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>
      <button
        className="btn btn-default"
        type="button"
        onClick={() => history.push(CREDIT_CALCULATIONS.CARBON_INTENSITIES_EDIT.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
    </div>
  </div>
);

CarbonIntensityLimitDetails.defaultProps = {};

CarbonIntensityLimitDetails.propTypes = {
  item: PropTypes.shape({
    compliancePeriod: PropTypes.shape(),
    id: PropTypes.number,
    limits: PropTypes.shape()
  }).isRequired
};

export default CarbonIntensityLimitDetails;
