/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import AutocompletedInput from '../../../app/components/AutocompletedInput';
import InputWithTooltip from '../../../app/components/InputWithTooltip';

class FuelCodeFormDetails extends Component {
  constructor (props) {
    super(props);

    this._getPartiallyRenewableIcons = this._getPartiallyRenewableIcons.bind(this);
    this._showPartiallyRenewableCheckbox = this._showPartiallyRenewableCheckbox.bind(this);
    this._togglePartiallyRenewable = this._togglePartiallyRenewable.bind(this);
  }

  _getPartiallyRenewableIcons () {
    if (this.props.fields.partiallyRenewable) {
      return ['far', 'check-square'];
    }

    return ['far', 'square'];
  }

  _showPartiallyRenewableCheckbox () {
    return this.props.approvedFuels.find(fuel => (fuel.name === this.props.fields.fuel &&
      fuel.isPartiallyRenewable));
  }

  _togglePartiallyRenewable () {
    const partiallyRenewable = !this.props.fields.partiallyRenewable;

    this.props.handleInputChange({
      target: {
        name: 'partiallyRenewable',
        value: partiallyRenewable
      }
    });
  }

  render () {
    return (
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
                    <AutocompletedInput
                      autocompleteFieldName="fuel_code.fuel_code_version"
                      cache={false}
                      handleInputChange={this.props.handleInputChange}
                      inputProps={
                        {
                          id: 'fuelCode',
                          maxLength: 11,
                          name: 'fuelCode',
                          onPaste: (event) => {
                            const clipboard = event.clipboardData.getData('Text');
                            if (clipboard.match(/\D/g)) {
                              event.preventDefault();
                            }
                          },
                          readOnly: this.props.edit,
                          required: true
                        }
                      }
                      integersOnly
                      onSelectEvent={this.props.handleSelect}
                      value={this.props.fields.fuelCode}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="company">Company (full legal operating name):
                  <AutocompletedInput
                    handleInputChange={this.props.handleInputChange}
                    autocompleteFieldName="fuel_code.company"
                    value={this.props.fields.company}
                    inputProps={
                      {
                        id: 'company',
                        maxLength: 100,
                        name: 'company',
                        required: true
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
                  <InputWithTooltip
                    allowNegative
                    dataNumberToFixed={2}
                    handleInputChange={this.props.handleInputChange}
                    id="carbon-intensity"
                    max="999.99"
                    maxLength="7"
                    min="0"
                    name="carbonIntensity"
                    required
                    step="0.01"
                    value={this.props.fields.carbonIntensity}
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
                    onChange={this.props.handleInputChange}
                    type="date"
                    value={this.props.fields.applicationDate}
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
                    onChange={this.props.handleInputChange}
                    type="date"
                    value={this.props.fields.effectiveDate}
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
                    onChange={this.props.handleInputChange}
                    type="date"
                    value={this.props.fields.expiryDate}
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
                    onChange={this.props.handleInputChange}
                    required="required"
                    id="fuel"
                    value={this.props.fields.fuel}
                  >
                    <option key="0" value="" default />
                    {this.props.approvedFuels.map(mode => (
                      <option key={mode.name} value={mode.name}>{mode.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {this._showPartiallyRenewableCheckbox() &&
            <div className="col-sm-6 col-lg-2">
              <div className="form-group">
                <label htmlFor="fuel">Is Partially Renewable?
                  <div className="value partially-renewable">
                    <FontAwesomeIcon
                      icon={this._getPartiallyRenewableIcons()}
                      onClick={this._togglePartiallyRenewable}
                      size="2x"
                    /> <span className="value">Yes</span>
                  </div>
                </label>
              </div>
            </div>
            }

            {this._showPartiallyRenewableCheckbox() && this.props.fields.partiallyRenewable &&
            <div className="col-sm-6 col-lg-4">
              <div className="form-group">
                <label htmlFor="renewable-percentage">Percentage of Part 2 fuel that is renewable (%):
                  <InputWithTooltip
                    dataNumberToFixed={2}
                    handleInputChange={this.props.handleInputChange}
                    id="renewable-percentage"
                    max="100.00"
                    min="0.00"
                    name="renewablePercentage"
                    required
                    step="0.01"
                    value={this.props.fields.renewablePercentage}
                  />
                </label>
              </div>
            </div>
            }
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="feedstock">Feedstock:
                  <AutocompletedInput
                    handleInputChange={this.props.handleInputChange}
                    autocompleteFieldName="fuel_code.feedstock"
                    value={this.props.fields.feedstock}
                    inputProps={
                      {
                        id: 'feedstock',
                        maxLength: 100,
                        name: 'feedstock',
                        required: true
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
                    handleInputChange={this.props.handleInputChange}
                    autocompleteFieldName="fuel_code.feedstock_location"
                    value={this.props.fields.feedstockLocation}
                    inputProps={
                      {
                        maxLength: 100,
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
                    handleInputChange={this.props.handleInputChange}
                    autocompleteFieldName="fuel_code.feedstock_misc"
                    value={this.props.fields.feedstockMisc}
                    inputProps={
                      {
                        id: 'feedstockMisc',
                        maxLength: 100,
                        name: 'feedstockMisc',
                        required: false
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
                    handleInputChange={this.props.handleInputChange}
                    autocompleteFieldName="fuel_code.facility_location"
                    value={this.props.fields.facilityLocation}
                    inputProps={
                      {
                        id: 'facilityLocation',
                        maxLength: 100,
                        name: 'facilityLocation',
                        required: true
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
                    maxLength="13"
                    name="facilityNameplate"
                    onChange={this.props.handleInputChange}
                    type="text"
                    value={this.props.fields.facilityNameplate}
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
                    onChange={this.props.handleInputChange}
                    id="feedstock-transport-mode"
                    value={this.props.fields.feedstockTransportMode}
                  >
                    {this.props.transportModes.map(mode => (
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
                    onChange={this.props.handleInputChange}
                    id="fuel-transport-mode"
                    value={this.props.fields.fuelTransportMode}
                  >
                    {this.props.transportModes.map(mode => (
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
                  handleInputChange={this.props.handleInputChange}
                  autocompleteFieldName="fuel_code.former_company"
                  value={this.props.fields.formerCompany}
                  inputProps={
                    {
                      id: 'formerCompany',
                      maxLength: 100,
                      name: 'formerCompany',
                      required: false
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
                  onChange={this.props.handleInputChange}
                  type="date"
                  value={this.props.fields.approvalDate}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FuelCodeFormDetails.defaultProps = {
  edit: false
};

FuelCodeFormDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
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
    fuelTransportMode: PropTypes.arrayOf(PropTypes.string),
    partiallyRenewable: PropTypes.bool,
    renewablePercentage: PropTypes.string
  }).isRequired,
  approvedFuels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  transportModes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired
};

export default FuelCodeFormDetails;
