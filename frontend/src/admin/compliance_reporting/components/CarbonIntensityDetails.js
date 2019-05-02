/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';

const CarbonIntensityDetails = props => (
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
            <label htmlFor="fuel-code">Carbon Intensity (gCO<sub>2</sub>e/MJ):
              <div className="value">{props.item.density.density}</div>
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
        onClick={() => history.push(props.editUrl.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
    </div>
  </div>
);

CarbonIntensityDetails.defaultProps = {};

CarbonIntensityDetails.propTypes = {
  editUrl: PropTypes.string.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    density: PropTypes.shape({
      density: PropTypes.number,
      effectiveDate: PropTypes.string,
      expirationDate: PropTypes.string
    })
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CarbonIntensityDetails;
