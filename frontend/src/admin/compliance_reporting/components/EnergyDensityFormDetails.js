/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import InputWithTooltip from '../../../app/components/InputWithTooltip';

const EnergyDensityFormDetails = props => (
  <div className="energy-density-details">
    <div className="main-form">
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
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="fuel-code">Energy Density:
                  <div className="value">{props.item.density.density} MJ/{props.item.unitOfMeasure}</div>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="effective-date">Effective Date:
                  <div className="value">{props.item.density.effectiveDate ? props.item.density.effectiveDate : 'N/A'}</div>
                </label>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="expiry-date">Expiration Date:
                  <div className="value">{props.item.density.expirationDate ? props.item.density.expirationDate : 'N/A'}</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="density">New Energy Density (MJ/{props.item.unitOfMeasure}):
                  <InputWithTooltip
                    allowNegative
                    dataNumberToFixed={2}
                    handleInputChange={props.handleInputChange}
                    id="density"
                    min="0"
                    name="density"
                    required
                    step="0.01"
                    value={props.fields.density}
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
          </div>
        </div>
      </div>
    </div>
  </div>
);

EnergyDensityFormDetails.defaultProps = {
  edit: false
};

EnergyDensityFormDetails.propTypes = {
  edit: PropTypes.bool,
  fields: PropTypes.shape({
    density: PropTypes.string,
    effectiveDate: PropTypes.string,
    expirationDate: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    density: PropTypes.oneOfType([
      PropTypes.shape({
        density: PropTypes.number,
        effectiveDate: PropTypes.string,
        expirationDate: PropTypes.string
      }),
      PropTypes.number
    ]),
    name: PropTypes.string,
    unitOfMeasure: PropTypes.string
  }).isRequired
};

export default EnergyDensityFormDetails;
