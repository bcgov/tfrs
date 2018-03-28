/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../../constants/numeralFormats';

import HistoricalDataEntryFormNote from './HistoricalDataEntryFormNote';
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
                <button type="button" className={`btn btn-default ${(props.fields.transferType === '1') ? 'active' : ''}`} name="transferType" value="1" onClick={props.handleInputChange}>Credit Transfer</button>
                <button type="button" className={`btn btn-default ${(props.fields.transferType === '5') ? 'active' : ''}`} name="transferType" value="5" onClick={props.handleInputChange}>Part 3 Award</button>
                <button type="button" className={`btn btn-default ${(props.fields.transferType === '3') ? 'active' : ''}`} name="transferType" value="3" onClick={props.handleInputChange}>Validation</button>
                <button type="button" className={`btn btn-default ${(props.fields.transferType === '4') ? 'active' : ''}`} name="transferType" value="4" onClick={props.handleInputChange}>Reduction</button>
              </div>
            </label>
          </div>

          <div className="form-group">
            {props.fields.creditsFrom.id !== 1 &&
            <label htmlFor="credits-from">Credits From:
              <select
                className="form-control"
                id="credits-from"
                name="creditsFrom"
                value={props.fields.creditsFrom.id}
                onChange={props.handleInputChange}
                required="required"
                disabled={props.fields.transferType === '5'}
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
            {props.fields.creditsFrom.id === 1 &&
            <label htmlFor="credits-from">Credits From:
              <div id="credits-from" className="form-control">{props.fields.creditsFrom.name}</div>
            </label>
            }
          </div>

          <div className="form-group">
            {props.fields.creditsTo.id !== 1 &&
            <label htmlFor="credits-to">Credits To:
              <select
                className="form-control"
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
            {props.fields.creditsTo.id === 1 &&
            <label htmlFor="credits-to">Credits To:
              <div id="credits-to" className="form-control">{props.fields.creditsTo.name}</div>
            </label>
            }
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
            {props.fields.transferType !== '5' &&
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
            {props.fields.transferType === '5' &&
            <label htmlFor="dollar-per-credit">Dollar per Credit:
              <div className="form-control dollar-per-credit">None</div>
            </label>
            }
          </div>

          <div className="form-group">
            {props.fields.transferType !== '5' &&
            <label htmlFor="dollar-per-credit">...for a total of:
              <div id="dollar-per-credit" className="form-control dollar-per-credit">{numeral(props.totalValue).format(NumberFormat.CURRENCY)} *</div>
            </label>
            }
            {props.fields.transferType === '5' &&
            <label htmlFor="dollar-per-credit">...for a total of:
              <div className="form-control dollar-per-credit">N/A</div>
            </label>
            }
          </div>

          <div className="form-group">
            <label htmlFor="transfer-type">Zero Dollar Reason: **
              <div className="btn-group" role="group">
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === '1') ? 'active' : ''}`} disabled={props.fields.transferType === '5'} name="zeroDollarReason" value="1" onClick={props.handleInputChange}>Affiliate</button>
                <button type="button" className={`btn btn-default ${(props.fields.zeroDollarReason === '2') ? 'active' : ''}`} disabled={props.fields.transferType === '5'} name="zeroDollarReason" value="2" onClick={props.handleInputChange}>Other</button>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <HistoricalDataEntryFormNote
            note={props.fields.note}
            handleInputChange={props.handleInputChange}
          />
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
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
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
    note: PropTypes.string.isRequired,
    tradeEffectiveDate: PropTypes.string,
    transferType: PropTypes.string,
    zeroDollarReason: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryFormDetails;
