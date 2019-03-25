/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import FuelCodeFormDetails from './FuelCodeFormDetails';
import history from '../../../app/History';
import * as Lang from '../../../constants/langEnUs';
import Errors from '../../../app/components/Errors';
import TooltipWhenDisabled from '../../../app/components/TooltipWhenDisabled';

class FuelCodeForm extends Component {
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

    if (this.props.fields.feedstockTransportMode === '') {
      validationMessage.push('Please select a feedstock transport mode.');
    }

    if (this.props.fields.fuelTransportMode === '') {
      validationMessage.push('Please select a finished fuel transport mode.');
    }

    return validationMessage;
  }

  _getValidationMessagesForApproval () {
    const validationMessage = this._getValidationMessagesForDraft();

    if (this.props.fields.applicationDate === '') {
      validationMessage.push('Please enter an application date.');
    }

    if (this.props.fields.effectiveDate === '') {
      validationMessage.push('Please enter an effective date.');
    }

    if (this.props.fields.expiryDate === '') {
      validationMessage.push('Please enter an expiry date.');
    }

    if (this.props.fields.approvalDate === '') {
      validationMessage.push('Please enter a approval date.');
    }

    return validationMessage;
  }

  render () {
    return (
      <div className="page-admin-fuel-code">
        <h1>{this.props.title}</h1>
        <form
          onSubmit={event => this.props.handleSubmit(event)}
        >
          <FuelCodeFormDetails
            addToFields={this.props.addToFields}
            fields={this.props.fields}
            approvedFuels={this.props.approvedFuels}
            transportModes={this.props.transportModes}
            handleInputChange={this.props.handleInputChange}
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
                className="adjust-tooltip"
                disabled={this._getValidationMessagesForApproval().length > 0}
                title={this._getValidationMessagesForApproval()}
              >
                <button
                  className="btn btn-primary"
                  data-target="#confirmSubmit"
                  data-toggle="modal"
                  disabled={this._getValidationMessagesForApproval().length > 0}
                  type="button"
                >
                  <FontAwesomeIcon icon={this.props.edit ? 'save' : 'plus'} />
                  {this.props.edit ? ` ${Lang.BTN_UPDATE}` : ` ${Lang.BTN_ADD}`}
                </button>
              </TooltipWhenDisabled>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

FuelCodeForm.defaultProps = {
  edit: false,
  errors: []
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
    fuelTransportMode: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  approvedFuels: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  transportModes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string.isRequired
};

export default FuelCodeForm;
