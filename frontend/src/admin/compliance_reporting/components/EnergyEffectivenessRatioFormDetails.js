/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import InputWithTooltip from '../../../app/components/InputWithTooltip';

const EnergyEffectivenessRatioFormDetails = props => (
  <div className="energy-effectiveness-ratio-details">
    <div className="main-form">
      <div className="row border-box">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group fuel">
                <label htmlFor="fuel">Fuel:
                  <div className="value">{props.item.name}</div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {props.item.ratios && props.item.ratios.diesel.ratio &&
      <div className="row border-box">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="fuel-code">Current Diesel Class Fuel Energy Effectiveness Ratio:
                  <div className="value">{props.item.ratios.diesel.ratio ? props.item.ratios.diesel.ratio.toFixed(1) : 'N/A'}</div>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="effective-date">Effective Date:
                  <div className="value">{props.item.ratios.diesel.effectiveDate || 'N/A'}</div>
                </label>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="expiry-date">Expiration Date:
                  <div className="value">{props.item.ratios.diesel.expirationDate || 'N/A'}</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="diesel-ratio">New Diesel Class Fuel Energy Effectiveness Ratio:
                  <InputWithTooltip
                    allowNegative
                    dataNumberToFixed={2}
                    handleInputChange={props.handleInputChange}
                    id="diesel-ratio"
                    min="0"
                    name="dieselRatio"
                    required
                    step="0.1"
                    value={props.fields.dieselRatio}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
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
          </div>
        </div>
      </div>
      }

      {props.item.ratios && props.item.ratios.gasoline.ratio &&
      <div className="row border-box">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="fuel-code">Current Gasoline Class Fuel Energy Effectiveness Ratio:
                  <div className="value">{props.item.ratios.gasoline.ratio ? props.item.ratios.gasoline.ratio.toFixed(1) : 'N/A'}</div>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="effective-date">Effective Date:
                  <div className="value">{props.item.ratios.gasoline.effectiveDate ? props.item.ratios.gasoline.effectiveDate : '2017-01-01'}</div>
                </label>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="expiry-date">Expiration Date:
                  <div className="value">{props.item.ratios.gasoline.expirationDate ? props.item.ratios.gasoline.expirationDate : 'N/A'}</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="gasoline-ratio">New Gasoline Class Fuel Energy Effectiveness Ratio:
                  <InputWithTooltip
                    allowNegative
                    dataNumberToFixed={2}
                    handleInputChange={props.handleInputChange}
                    id="gasoline-ratio"
                    min="0"
                    name="gasolineRatio"
                    required
                    step="0.1"
                    value={props.fields.gasolineRatio}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
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
          </div>
        </div>
      </div>
      }
    </div>
  </div>
);

EnergyEffectivenessRatioFormDetails.defaultProps = {
  edit: false
};

EnergyEffectivenessRatioFormDetails.propTypes = {
  edit: PropTypes.bool,
  fields: PropTypes.shape({
    dieselRatio: PropTypes.string,
    dieselEffectiveDate: PropTypes.string,
    dieselExpirationDate: PropTypes.string,
    gasolineRatio: PropTypes.string,
    gasolineEffectiveDate: PropTypes.string,
    gasolineExpirationDate: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    ratios: PropTypes.shape({
      diesel: PropTypes.shape(),
      gasoline: PropTypes.shape()
    })
  }).isRequired
};

export default EnergyEffectivenessRatioFormDetails;
