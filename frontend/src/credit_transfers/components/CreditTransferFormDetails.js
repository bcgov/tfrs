/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';

const CreditTransferFormDetails = props => (
  <div className="credit-transfer-details">
    <div className="main-form">
      <span>
        {`${props.fields.initiator && props.fields.initiator.name} proposes to `}
      </span>
      <div className="form-group">
        <select
          className="form-control"
          id="proposal-type"
          name="tradeType"
          value={props.fields.tradeType.id}
          onChange={props.handleInputChange}
        >
          <option value="" />
          <option value="1">Sell</option>
          <option value="2">Buy</option>
        </select>
      </div>
      <div className="form-group">
        <input
          type="number"
          className="form-control"
          id="number-of-credits"
          name="numberOfCredits"
          value={props.fields.numberOfCredits}
          onChange={props.handleInputChange}
          required="required"
        />
      </div>
      <span>
        {props.fields.tradeType.id === 1 ? 'credits to ' : 'credits from '}
      </span>
      <div className="form-group">
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
              props.fields.initiator.id !== organization.id && (
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
            value={props.fields.fairMarketValuePerCredit}
            placeholder="Amount"
            onChange={props.handleInputChange}
            required="required"
          />
        </div>
      </div>
      <span>per credit for a total value of </span>
      <span>{numeral(props.totalValue).format(NumberFormat.CURRENCY)}</span>
      <span> effective on Director&apos;s Approval</span>
      {props.children}
    </div>
  </div>
);

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
    fairMarketValuePerCredit: PropTypes.string
  }).isRequired,
  totalValue: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default CreditTransferFormDetails;
