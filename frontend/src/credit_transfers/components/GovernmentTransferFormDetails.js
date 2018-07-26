/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_TYPES } from '../../constants/values';

const GovernmentTransferFormDetails = props => (
  <div className="credit-transaction-details">
    <div className="main-form">
      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="transfer-type">Transfer Type:
            <div className="btn-group" role="group">
              <button type="button" className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.part3Award.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.part3Award.id} onClick={props.handleInputChange}>Part 3 Award</button>
              <button type="button" className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.validation.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.validation.id} onClick={props.handleInputChange}>Validation</button>
              <button type="button" className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.retirement.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.retirement.id} onClick={props.handleInputChange}>Reduction</button>
            </div>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="respondent">Credits From/To:
            <select
              className="form-control"
              id="respondent"
              name="respondent"
              value={props.fields.respondent.id}
              onChange={props.handleInputChange}
              required="required"
            >
              <option key="0" value="" default />
              {props.fuelSuppliers &&
                props.fuelSuppliers.map(organization => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="number-of-credits">Number of Credits:
            <input
              type="number"
              className="form-control"
              id="number-of-credits"
              name="numberOfCredits"
              value={props.fields.numberOfCredits}
              onChange={props.handleInputChange}
              required="required"
            />
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="compliance-period">Compliance Period:
            <select
              className="form-control"
              id="compliance-period"
              name="compliancePeriod"
              value={props.fields.compliancePeriod.id}
              onChange={props.handleInputChange}
              required="required"
            >
              <option key="0" value="" default />
              {props.compliancePeriods &&
                props.compliancePeriods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.description}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-12">
          <label htmlFor="comment">Note:
            <textarea
              className="form-control"
              rows="5"
              id="comment"
              name="comment"
              value={props.fields.comment}
              onChange={props.handleInputChange}
            />
          </label>
        </div>
      </div>
    </div>
  </div>
);

GovernmentTransferFormDetails.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string,
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    initiator: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    numberOfCredits: PropTypes.string,
    respondent: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    transferType: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default GovernmentTransferFormDetails;
