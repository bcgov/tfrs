/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../constants/values';

class CreditTransferFormDetails extends Component {
  enableZeroReason () {
    return (
      (this.props.fields.tradeType.id === CREDIT_TRANSFER_TYPES.sell.id ||
      this.props.fields.tradeType.id === CREDIT_TRANSFER_TYPES.buy.id) &&
      this.props.fields.fairMarketValuePerCredit !== null &&
      parseFloat(this.props.fields.fairMarketValuePerCredit) === 0
    );
  }

  render () {
    return (
      <div className="credit-transfer-details">
        <div className="main-form">
          <span>
            {`${this.props.fields.initiator && this.props.fields.initiator.name} proposes to `}
          </span>
          <div className="form-group">
            <select
              className="form-control"
              id="proposal-type"
              name="tradeType"
              value={this.props.fields.tradeType.id}
              onChange={this.props.handleInputChange}
            >
              <option value="" />
              <option value="1">Sell</option>
              <option value="2">Buy</option>
            </select>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              id="number-of-credits"
              min="0"
              name="numberOfCredits"
              onChange={this.props.handleInputChange}
              required="required"
              step="1"
              type="number"
              value={this.props.fields.numberOfCredits}
            />
          </div>
          <span>
            {this.props.fields.tradeType.id === 1 ? 'credits to ' : 'credits from '}
          </span>
          <div className="form-group">
            <select
              className="form-control"
              id="respondent"
              name="respondent"
              value={this.props.fields.respondent.id}
              onChange={this.props.handleInputChange}
              required="required"
            >
              <option key="0" value="" default />
              {this.props.fuelSuppliers &&
              this.props.fuelSuppliers.map(organization => (
                this.props.fields.initiator.id !== organization.id && (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                )
              ))}
            </select>
          </div>
          <span>for </span>
          <div className="form-group">
            <div className="input-group">
              <span className="input-group-addon">$</span>
              <input
                type="number"
                data-number-to-fixed="2"
                className="form-control"
                id="value-per-credit"
                name="fairMarketValuePerCredit"
                value={this.props.fields.fairMarketValuePerCredit}
                placeholder="Amount"
                onChange={this.props.handleInputChange}
                required="required"
              />
            </div>
          </div>
          <span>per credit for a total value of </span>
          <span>{numeral(this.props.totalValue).format(NumberFormat.CURRENCY)}</span>
          <span> effective on Director&apos;s approval</span>
          {this.enableZeroReason() &&
          <div className="zero-reason-form">
            <span>
              This credit transfer has a fair market value of zero dollars per credit because:
            </span>
            <br />
            <div className="form-group">
              <div className="btn-group zero-reason" role="group" id="zero-dollar-reason">
                {Object.values(ZERO_DOLLAR_REASON).map(zd => (
                  <button
                    key={zd.description}
                    type="button"
                    className={`btn btn-default ${(this.props.fields.zeroDollarReason &&
                      this.props.fields.zeroDollarReason.id === zd.id) ? 'active' : ''}`}
                    value={zd.id}
                    name="zeroDollarReason"
                    onClick={this.props.handleInputChange}
                  >
                    {zd.formButtonDescription}
                  </button>
                ))}
              </div>
            </div>
          </div>
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}

CreditTransferFormDetails.defaultProps = {
  children: null
};

CreditTransferFormDetails.propTypes = {
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    initiator: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    respondent: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    tradeType: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    numberOfCredits: PropTypes.string,
    fairMarketValuePerCredit: PropTypes.string,
    zeroDollarReason: PropTypes.shape({
      reason: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  totalValue: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default CreditTransferFormDetails;
