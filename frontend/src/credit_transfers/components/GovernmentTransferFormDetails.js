/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'

import InputWithTooltip from '../../app/components/InputWithTooltip'

const GovernmentTransferFormDetails = props => (
  <div className="credit-transaction-details">
    <div className="main-form">
      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="transfer-type">Transaction Type:
            <div className="form-control">
              Initiative Agreement
            </div>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="respondent">Compliance units to:
            <select
              className="form-control"
              id="respondent"
              name="respondent"
              value={props.fields.respondent.id}
              onChange={props.handleInputChange}
              required="required"
            >
              <option key="0" value="" default>Select an organization</option>
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
          <label htmlFor="number-of-credits">Number of compliance units
            <InputWithTooltip
              handleInputChange={props.handleInputChange}
              id="number-of-credits"
              min="0"
              name="numberOfCredits"
              required
              step="1"
              value={props.fields.numberOfCredits}
            />
          </label>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-md-6">
          <label htmlFor="compliance-period">Compliance period:
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
          {props.children}
        </div>
      </div>
    </div>
  </div>
)

GovernmentTransferFormDetails.defaultProps = {
  children: null
}

GovernmentTransferFormDetails.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
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
    tradeType: PropTypes.shape({
      id: PropTypes.number
    })
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
}

export default GovernmentTransferFormDetails
