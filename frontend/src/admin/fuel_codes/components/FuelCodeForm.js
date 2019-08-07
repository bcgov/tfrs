/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import FuelCodeFormDetails from './FuelCodeFormDetails';
import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import CallableModal from '../../../app/components/CallableModal';
import Errors from '../../../app/components/Errors';
import TooltipWhenDisabled from '../../../app/components/TooltipWhenDisabled';

class FuelCodeForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showOverlapModal: false
    };

    this.conflictingFuelCode = {};

    this._closeModal = this._closeModal.bind(this);
    this._getEffectiveDatesStatus = this._getEffectiveDatesStatus.bind(this);
    this._openOverlapModal = this._openOverlapModal.bind(this);
    this._validateEffectiveDates = this._validateEffectiveDates.bind(this);
  }

  _closeModal () {
    this.setState({
      showOverlapModal: false
    });
  }

  _getValidationMessagesForDraft () {
    const validationMessage = [];

    if (this.props.fields.fuelCode === '') {
      validationMessage.push('Please enter a fuel code.');
    }

    if (this.props.fields.company === '') {
      validationMessage.push('Please enter a company.');
    }

    if (this.props.fields.carbonIntensity === '') {
      validationMessage.push('Please enter the carbon intensity.');
    }

    if (this.props.fields.applicationDate === '') {
      validationMessage.push('Please enter an application date.');
    }

    if (this.props.fields.fuel === '') {
      validationMessage.push('Please select a fuel.');
    }

    if (this.props.fields.feedstock === '') {
      validationMessage.push('Please enter a feedstock.');
    }

    if (this.props.fields.feedstockLocation === '') {
      validationMessage.push('Please enter a feedstock location.');
    }

    if (this.props.fields.facilityLocation === '') {
      validationMessage.push('Please enter a fuel production facility location.');
    }

    if (this.props.fields.feedstockTransportMode.length === 0) {
      validationMessage.push('Please select a feedstock transport mode.');
    }

    if (this.props.fields.fuelTransportMode.length === 0) {
      validationMessage.push('Please select a finished fuel transport mode.');
    }

    if (this.props.fields.expiryDate < this.props.fields.effectiveDate) {
      validationMessage.push('The expiry date precedes the effective date.');
    }

    if (this.props.fields.partiallyRenewable && this.props.fields.renewablePercentage === '') {
      validationMessage.push('Please enter a renewable percentage if this is partially renewable.');
    }

    return validationMessage;
  }

  _getValidationMessagesForApproval () {
    const validationMessage = this._getValidationMessagesForDraft();

    if (this.props.fields.effectiveDate === '') {
      validationMessage.push('Please enter an effective date.');
    }

    if (this.props.fields.expiryDate === '') {
      validationMessage.push('Please enter an expiry date.');
    }

    if (this.props.fields.facilityNameplate === '') {
      validationMessage.push('Please enter a fuel production facility nameplate capacity.');
    }

    if (this.props.fields.approvalDate === '') {
      validationMessage.push('Please enter a approval date.');
    }

    return validationMessage;
  }

  _getEffectiveDatesStatus () {
    if (this.props.fuelCodes.isFetching || this.props.fuelCodes.items.length === 0) {
      return false;
    }

    this.conflictingFuelCode = this.props.fuelCodes.items.find(fuelCode => (
      this.props.fields.fuelCode !== `${fuelCode.fuelCodeVersion}.${fuelCode.fuelCodeVersionMinor}` && (
        (fuelCode.effectiveDate <= this.props.fields.effectiveDate &&
        fuelCode.expiryDate >= this.props.fields.effectiveDate) ||
        (fuelCode.effectiveDate <= this.props.fields.expiryDate &&
        fuelCode.effectiveDate >= this.props.fields.effectiveDate)
      )
    ));

    if (this.conflictingFuelCode) {
      return true;
    }

    return false;
  }

  _openOverlapModal () {
    this.setState({
      showOverlapModal: true
    });
  }

  _validateEffectiveDates () {
    const fuelCode = this.props.fields.fuelCode.split('.');

    if (fuelCode.length > 0) {
      this.props.filterFuelCodes({
        fuel_code: 'BCLCF',
        fuel_code_version: fuelCode[0]
      }).then((response) => {
        this._openOverlapModal();
      });
    }
  }

  render () {
    return ([
      <div className="page-admin-fuel-code" key="form">
        <h1>{this.props.title}</h1>
        <form
          onSubmit={event => this.props.handleSubmit(event)}
        >
          <FuelCodeFormDetails
            addToFields={this.props.addToFields}
            edit={this.props.edit}
            fields={this.props.fields}
            approvedFuels={
              this.props.approvedFuels.filter(fuel => fuel.creditCalculationOnly === false)
            }
            transportModes={this.props.transportModes}
            handleInputChange={this.props.handleInputChange}
            handleSelect={this.props.handleSelect}
          />

          {Object.keys(this.props.errors).length > 0 &&
          <Errors errors={this.props.errors} />
          }

          <div className="fuel-code-actions">
            <div className="btn-container">
              <button
                className="btn btn-default"
                onClick={() => history.goBack()}
                type="button"
              >
                <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
              </button>
              <TooltipWhenDisabled
                disabled={this._getValidationMessagesForDraft().length > 0}
                title={this._getValidationMessagesForDraft()}
              >
                <button
                  className="btn btn-default"
                  disabled={this._getValidationMessagesForDraft().length > 0}
                  type="submit"
                >
                  <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
                </button>
              </TooltipWhenDisabled>
              <TooltipWhenDisabled
                className={`danger adjust-tooltip ${this.props.fields.facilityNameplate === '' ? 'adjust-for-facility-nameplate' : ''}`}
                disabled={this._getValidationMessagesForApproval().length > 0}
                title={this._getValidationMessagesForApproval()}
              >
                <button
                  className="btn btn-primary"
                  disabled={this._getValidationMessagesForApproval().length > 0}
                  onClick={this._validateEffectiveDates}
                  type="button"
                >
                  <FontAwesomeIcon icon={this.props.edit ? 'save' : 'plus'} />
                  {this.props.edit ? ` ${Lang.BTN_UPDATE}` : ` ${Lang.BTN_ADD}`}
                </button>
              </TooltipWhenDisabled>
            </div>
          </div>
        </form>
      </div>,
      <CallableModal
        close={this._closeModal}
        handleSubmit={(event) => {
          this.props.handleSubmit(event, 'Approved');
        }}
        id="confirmOverlap"
        key="confirmOverlap"
        show={this.state.showOverlapModal}
      >
        {this._getEffectiveDatesStatus() &&
        <div className="alert alert-warning">
          <p>
          The effective dates of this fuel code overlap with
            <br />
            {` ${this.conflictingFuelCode.fuelCode}${this.conflictingFuelCode.fuelCodeVersion}.${this.conflictingFuelCode.fuelCodeVersionMinor}`}
            {` (${this.conflictingFuelCode.effectiveDate} - ${this.conflictingFuelCode.expiryDate})`}
          </p>
        </div>
        }

        Are you sure you want to add this fuel code?
      </CallableModal>
    ]);
  }
}

FuelCodeForm.defaultProps = {
  edit: false,
  errors: [],
  handleSelect: () => {}
};

FuelCodeForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  errors: PropTypes.shape(),
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
  filterFuelCodes: PropTypes.func.isRequired,
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSelect: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  approvedFuels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  transportModes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string.isRequired
};

export default FuelCodeForm;
