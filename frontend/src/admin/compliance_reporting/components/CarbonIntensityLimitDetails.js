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
  <div className="page-compliance-reporting-details">
    <h1>{props.title}</h1>

    <div className="compliance-reporting-details">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Compliance Period:
              <div className="value">{props.item.description}</div>
            </label>
          </div>
        </div>
      </div>

      {props.item.limits && [
        <div className="row" key="limits-diesel">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Carbon Intensity Limit for Diesel Class Fuel:
                <div className="value">{props.item.limits.diesel.density}</div>
              </label>
            </div>
          </div>
        </div>,
        <div className="row" key="limits-diesel-effective-date">
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
                <div className="value">{props.item.limits.diesel.expirationDate || 'N/A'}</div>
              </label>
            </div>
          </div>
        </div>,
        <div className="row" key="limits-gasoline">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Carbon Intensity Limit for Gasoline Class Fuel:
                <div className="value">{props.item.limits.gasoline.density}</div>
              </label>
            </div>
          </div>
        </div>,
        <div className="row" key="limits-gasoline-effective-date">
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
                <div className="value">{props.item.limits.gasoline.expirationDate || 'N/A'}</div>
              </label>
            </div>
          </div>
        </div>
      ]}
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
    description: PropTypes.string,
    id: PropTypes.number,
    limits: PropTypes.shape({
      diesel: PropTypes.shape(),
      gasoline: PropTypes.shape()
    })
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CarbonIntensityLimitDetails;
