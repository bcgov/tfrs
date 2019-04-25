/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import CREDIT_CALCULATIONS from '../../../constants/routes/CreditCalculations';

const EnergyDensityDetails = props => (
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

      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="fuel-code">Energy Density:
              <div className="value">{props.item.density.density} MJ/{props.item.unitOfMeasure}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <div className="value">{props.item.density.effectiveDate}</div>
            </label>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label htmlFor="expiry-date">Expiration Date:
              <div className="value">{props.item.density.expirationDate || 'N/A'}</div>
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
        onClick={() => history.push(CREDIT_CALCULATIONS.ENERGY_DENSITIES_EDIT.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
    </div>
  </div>
);

EnergyDensityDetails.defaultProps = {};

EnergyDensityDetails.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    density: PropTypes.shape({
      density: PropTypes.number,
      effectiveDate: PropTypes.string,
      expirationDate: PropTypes.string
    }),
    unitOfMeasure: PropTypes.string
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default EnergyDensityDetails;
