/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import CREDIT_CALCULATIONS from '../../../constants/routes/CreditCalculations';

const EnergyEffectivenessRatioDetails = props => (
  <div className="page-compliance-reporting-details">
    <h1>{props.title}</h1>

    <div className="compliance-reporting-details">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Fuel:
              <div className="value">{props.item.name}</div>
            </label>
          </div>
        </div>
      </div>

      {props.item.ratios && props.item.ratios.diesel.ratio && [
        <div className="row" key="diesel-energy-effectiveness-ratio">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Diesel Class Fuel Energy Effectiveness Ratio:
                <div className="value">{props.item.ratios.diesel.ratio ? props.item.ratios.diesel.ratio.toFixed(1) : 'N/A'}</div>
              </label>
            </div>
          </div>
        </div>,
        <div className="row" key="diesel-energy-effectiveness-dates">
          <div className="col-sm-3">
            <div className="form-group">
              <label htmlFor="effective-date">Effective Date:
                <div className="value">{props.item.ratios.diesel.effectiveDate || 'N/A'}</div>
              </label>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="form-group">
              <label htmlFor="expiry-date">Expiration Date:
                <div className="value">{props.item.ratios.diesel.expirationDate || 'N/A'}</div>
              </label>
            </div>
          </div>
        </div>
      ]}

      {props.item.ratios && props.item.ratios.gasoline.ratio && [
        <div className="row" key="gasoline-energy-effectiveness-ratio">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Gasoline Class Fuel Energy Effectiveness Ratio:
                <div className="value">{props.item.ratios.gasoline.ratio ? props.item.ratios.gasoline.ratio.toFixed(1) : 'N/A'}</div>
              </label>
            </div>
          </div>
        </div>,
        <div className="row" key="gasoline-energy-effectiveness-dates">
          <div className="col-sm-3">
            <div className="form-group">
              <label htmlFor="effective-date">Effective Date:
                <div className="value">{props.item.ratios.gasoline.effectiveDate || 'N/A'}</div>
              </label>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="form-group">
              <label htmlFor="expiry-date">Expiration Date:
                <div className="value">{props.item.ratios.gasoline.expirationDate || 'N/A'}</div>
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
        onClick={() => history.push(CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_EDIT.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
    </div>
  </div>
);

EnergyEffectivenessRatioDetails.defaultProps = {};

EnergyEffectivenessRatioDetails.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    ratios: PropTypes.shape({
      diesel: PropTypes.shape(),
      gasoline: PropTypes.shape()
    })
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default EnergyEffectivenessRatioDetails;
