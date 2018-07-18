/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../../constants/numeralFormats';

import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../../constants/values';
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons';

const HistoricalDataEntryFormDetails = props => (
  <div className="historical-data-entry-form-details">
    <div className="main-form">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <input
                type="date"
                className="form-control"
                id="effective-date"
                max="9999-12-31"
                name="tradeEffectiveDate"
                value={props.fields.tradeEffectiveDate}
                placeholder="Effective Date"
                onChange={props.handleInputChange}
                required="required"
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="transfer-type">Transfer Type:
              <div className="btn-group" role="group">
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.sell.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.sell.id} onClick={props.handleInputChange}>Credit Transfer</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.part3Award.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.part3Award.id} onClick={props.handleInputChange}>Part 3 Award</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.validation.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.validation.id} onClick={props.handleInputChange}>Validation</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.retirement.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.retirement.id} onClick={props.handleInputChange}>Reduction</button>
              </div>
            </label>
          </div>

          <div className="form-group">
            {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString()]
              .includes(props.fields.transferType) &&
              <label htmlFor="credits-from">Credits From:
                <select
                  className="form-control"
                  disabled={props.editMode}
                  id="credits-from"
                  name="creditsFrom"
                  value={props.fields.creditsFrom.id}
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
            }
            {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString()]
              .includes(props.fields.transferType) &&
              <label htmlFor="credits-from">Credits From:
                <div id="credits-from" className="form-control">N/A</div>
              </label>
            }
          </div>

          <div className="form-group">
            {props.fields.transferType !== CREDIT_TRANSFER_TYPES.retirement.id.toString() &&
            <label htmlFor="credits-to">Credits To:
              <select
                className="form-control"
                disabled={props.editMode}
                id="credits-to"
                name="creditsTo"
                value={props.fields.creditsTo.id}
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
            }
            {props.fields.transferType === CREDIT_TRANSFER_TYPES.retirement.id.toString() &&
            <label htmlFor="credits-to">Credits To:
              <div id="credits-to" className="form-control">N/A</div>
            </label>
            }
          </div>

          <div className="form-group">
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
        <div className="col-md-6">
          <div className="form-group">
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

          <div className="form-group">
            {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString(),
              CREDIT_TRANSFER_TYPES.retirement.id.toString()].includes(props.fields.transferType) &&
              <label htmlFor="dollar-per-credit">Dollar per Credit:
                <input
                  type="number"
                  data-number-to-fixed="2"
                  className="form-control"
                  id="dollar-per-credit"
                  name="fairMarketValuePerCredit"
                  value={props.fields.fairMarketValuePerCredit}
                  placeholder="Amount"
                  onChange={props.handleInputChange}
                  required="required"
                />
              </label>
            }
            {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString(),
              CREDIT_TRANSFER_TYPES.retirement.id.toString()].includes(props.fields.transferType) &&
              <label htmlFor="dollar-per-credit">Dollar per Credit:
                <div className="form-control dollar-per-credit">None</div>
              </label>
            }
          </div>

          <div className="form-group">
            {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString(),
              CREDIT_TRANSFER_TYPES.retirement.id.toString()].includes(props.fields.transferType) &&
              <label htmlFor="dollar-per-credit">...for a total of:
                <div
                  id="dollar-per-credit"
                  className="form-control dollar-per-credit"
                >
                  {numeral(props.totalValue).format(NumberFormat.CURRENCY)} *
                </div>
              </label>
            }
            {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
              CREDIT_TRANSFER_TYPES.validation.id.toString(),
              CREDIT_TRANSFER_TYPES.retirement.id.toString()].includes(props.fields.transferType) &&
              <label htmlFor="dollar-per-credit">...for a total of:
                <div className="form-control dollar-per-credit">N/A</div>
              </label>
            }
          </div>

          <div className="form-group">
            <label htmlFor="transfer-type">Zero Dollar Reason: **
              <div className="btn-group zero-reason" role="group">
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === ZERO_DOLLAR_REASON.affiliate.id.toString()) ? 'active' : ''}`} disabled={props.fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() || parseFloat(props.fields.fairMarketValuePerCredit) > 0} name="zeroDollarReason" value={ZERO_DOLLAR_REASON.affiliate.id} onClick={props.handleInputChange}>Affiliate</button>
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === ZERO_DOLLAR_REASON.other.id.toString()) ? 'active' : ''}`} disabled={props.fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() || parseFloat(props.fields.fairMarketValuePerCredit) > 0} name="zeroDollarReason" value={ZERO_DOLLAR_REASON.other.id} onClick={props.handleInputChange}>Other</button>
              </div>
            </label>
          </div>
        </div>
      </div>


      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <HistoricalDataEntryFormButtons
              actions={props.actions}
              handleSubmit={props.handleSubmit}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <div>* Does not include GST</div>
            <div>** Optional if not a Zero Dollar transaction</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

HistoricalDataEntryFormDetails.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  editMode: PropTypes.bool.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    creditsFrom: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    creditsTo: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    fairMarketValuePerCredit: PropTypes.string,
    numberOfCredits: PropTypes.string,
    tradeEffectiveDate: PropTypes.string,
    transferType: PropTypes.string,
    zeroDollarReason: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryFormDetails;
