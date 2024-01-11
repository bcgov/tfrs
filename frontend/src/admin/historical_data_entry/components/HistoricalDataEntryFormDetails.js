/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

import * as NumberFormat from '../../../constants/numeralFormats'

import InputWithTooltip from '../../../app/components/InputWithTooltip'
import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../../constants/values'
import HistoricalDataEntryFormNote from './HistoricalDataEntryFormNote'
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons'

const date = new Date()
const today = date.toISOString().split('T')[0]

const HistoricalDataEntryFormDetails = props => (
  <div className="historical-data-entry-form-details">
    <div className="main-form">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="effective-date">Effective Date:
              <input
                className="form-control"
                id="effective-date"
                max={today}
                name="tradeEffectiveDate"
                onChange={props.handleInputChange}
                placeholder="Effective Date (YYYY-MM-DD)"
                required="required"
                type="date"
                value={props.fields.tradeEffectiveDate}
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="transfer-type">Transaction Type:
              <div className="btn-group" role="group" id="transaction-type">
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.sell.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.sell.id} onClick={props.handleInputChange}>Transfer</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.part3Award.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.part3Award.id} onClick={props.handleInputChange}>Initiative Agreement</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.validation.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.validation.id} onClick={props.handleInputChange}>Validation</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.retirement.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.retirement.id} onClick={props.handleInputChange}>Reduction</button>
                <button type="button" disabled={props.editMode} className={`btn btn-default ${(props.fields.transferType === CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString()) ? 'active' : ''}`} name="transferType" value={CREDIT_TRANSFER_TYPES.adminAdjustment.id} onClick={props.handleInputChange}>Admin Adjustment</button>
              </div>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="credits-from">Compliance Units From:
              {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString()]
                .includes(props.fields.transferType) &&
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
              }
              {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString()]
                .includes(props.fields.transferType) &&
                <div id="credits-from" className="form-control">N/A</div>
              }
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="credits-to">Credits To:
              {props.fields.transferType !== CREDIT_TRANSFER_TYPES.retirement.id.toString() &&
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
              }
              {props.fields.transferType === CREDIT_TRANSFER_TYPES.retirement.id.toString() &&
              <div id="credits-to" className="form-control">N/A</div>
              }
            </label>
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
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="number-of-credits">Number of Credits:
              <InputWithTooltip
                handleInputChange={props.handleInputChange}
                id="number-of-credits"
                name="numberOfCredits"
                required
                step="1"
                value={props.fields.numberOfCredits}
                allowNegative={props.fields.transferType === CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString()}
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="value-per-credit">Dollar per Credit:
              {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString(),
                CREDIT_TRANSFER_TYPES.retirement.id.toString()
              ].includes(props.fields.transferType) &&
                <InputWithTooltip
                  dataNumberToFixed={2}
                  handleInputChange={props.handleInputChange}
                  id="value-per-credit"
                  min="0"
                  name="fairMarketValuePerCredit"
                  placeholder="Amount"
                  required
                  showDollarSymbol
                  step="0.01"
                  value={props.fields.fairMarketValuePerCredit}
                />
              }
              {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString(),
                CREDIT_TRANSFER_TYPES.retirement.id.toString()
              ].includes(props.fields.transferType) &&
                <div className="form-control dollar-per-credit">None</div>
              }
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="dollar-per-credit">For a total of:
              {![CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString(),
                CREDIT_TRANSFER_TYPES.retirement.id.toString()
              ].includes(props.fields.transferType) &&
                <div
                  id="dollar-per-credit"
                  className="form-control dollar-per-credit"
                >
                  {numeral(props.totalValue).format(NumberFormat.CURRENCY)}
                </div>
              }
              {[CREDIT_TRANSFER_TYPES.part3Award.id.toString(),
                CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString(),
                CREDIT_TRANSFER_TYPES.validation.id.toString(),
                CREDIT_TRANSFER_TYPES.retirement.id.toString()
              ].includes(props.fields.transferType) &&
                <div className="form-control dollar-per-credit">N/A</div>
              }
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="transfer-type">Zero Dollar Reason: *
              <div className="btn-group zero-reason" role="group" id="zero-dollar-reason">
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === ZERO_DOLLAR_REASON.affiliate.id.toString()) ? 'active' : ''}`} disabled={props.fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() || parseFloat(props.fields.fairMarketValuePerCredit) > 0} name="zeroDollarReason" value={ZERO_DOLLAR_REASON.affiliate.id} onClick={props.handleInputChange}>Affiliate</button>
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === ZERO_DOLLAR_REASON.other.id.toString()) ? 'active' : ''}`} disabled={props.fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() || parseFloat(props.fields.fairMarketValuePerCredit) > 0} name="zeroDollarReason" value={ZERO_DOLLAR_REASON.other.id} onClick={props.handleInputChange}>Other</button>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <HistoricalDataEntryFormNote
            comment={props.fields.comment}
            handleInputChange={props.handleInputChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <HistoricalDataEntryFormButtons
              actions={props.actions}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <div>* Optional if not a Zero Dollar transaction</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

HistoricalDataEntryFormDetails.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  editMode: PropTypes.bool.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string.isRequired,
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
  totalValue: PropTypes.number.isRequired
}

export default HistoricalDataEntryFormDetails
