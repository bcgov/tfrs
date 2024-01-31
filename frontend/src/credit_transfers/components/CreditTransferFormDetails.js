/*
 * Presentational component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'

import * as NumberFormat from '../../constants/numeralFormats'
import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../constants/values'
import InputWithTooltip from '../../app/components/InputWithTooltip'

class CreditTransferFormDetails extends Component {
  enableZeroReason () {
    console.log(this.props, "1414")
    return (
      (this.props.fields.tradeType.id === CREDIT_TRANSFER_TYPES.sell.id ||
      this.props.fields.tradeType.id === CREDIT_TRANSFER_TYPES.buy.id) &&
      this.props.fields.fairMarketValuePerCredit !== null &&
      parseFloat(this.props.fields.fairMarketValuePerCredit) === 0
    )
  }
  
  render () {
    return (
      <div className="credit-transfer-details">
        <p className="action-context-menu-available">Credit Transfer Details (required)</p>
        <div className="main-form">
          <span>
            {`${this.props.fields.initiator && this.props.fields.initiator.name} proposes to sell `}
          </span>
          <div className="form-group number-of-credits">
            <InputWithTooltip
              handleInputChange={this.props.handleInputChange}
              id="number-of-credits"
              min="0"
              name="numberOfCredits"
              placeholder="Quantity of Credits"
              required
              step="1"
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
              <option key="0" value="" default>Select a Fuel Supplier</option>
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
          <div className="form-group fair-market-value">
            <InputWithTooltip
              dataNumberToFixed={2}
              handleInputChange={this.props.handleInputChange}
              id="value-per-credit"
              min="0"
              name="fairMarketValuePerCredit"
              placeholder="The fair market value of any consideration, in CAD"
              required
              showDollarSymbol
              step="0.01"
              value={this.props.fields.fairMarketValuePerCredit}
            />
          </div>
          <span>per credit for a total value of </span>
          <span>{numeral(this.props.totalValue).format(NumberFormat.CURRENCY)} CAD.</span>
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
                      this.props.fields.zeroDollarReason.id === zd.id)
? 'active'
: ''}`}
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
    )
  }
}

CreditTransferFormDetails.defaultProps = {
  children: null
}

CreditTransferFormDetails.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
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
  handleInputChange: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      actionsTypeDisplay: PropTypes.string
    })
  }).isRequired,
  totalValue: PropTypes.number.isRequired
}

export default CreditTransferFormDetails
