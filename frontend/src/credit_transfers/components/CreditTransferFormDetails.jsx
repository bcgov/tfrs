/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

const CreditTransferFormDetails = props => (
  <div className="credit-transfer-details">
    <div className="main-form">
      <span>
        {`${props.initiator && props.initiator.name} proposes to `}
      </span>
      <div className="form-group">
        <select
          className="form-control"
          id="proposal-type"
          name="tradeType"
          value={props.tradeType.id}
          onChange={props.handleInputChange}
        >
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
          value={props.numberOfCredits}
          onChange={props.handleInputChange}
        />
      </div>
      <span>
        {props.tradeType.id === 1 ? 'credits from ' : 'credits to '}
      </span>
      <div className="form-group">
        <select
          className="form-control"
          id="respondent"
          name="respondent"
          value={props.respondent.id}
          onChange={props.handleInputChange}
        >
          <option key="0" value="0" default />
          {props.fuelSuppliers &&
            props.fuelSuppliers.map(organization => (
              props.initiator.id !== organization.id && (
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
            value={props.fairMarketValuePerCredit}
            placeholder="Amount"
            onChange={props.handleInputChange}
          />
          <div className="input-group-addon">.00</div>
        </div>
      </div>
      <span>per credit for a total value of $</span>
      <span>{ props.totalValue }</span>
      <span> effective on Director&apos;s Approval</span>
    </div>
  </div>
);

CreditTransferFormDetails.defaultProps = {
  initiator: {
    name: 'Initiator'
  },
  respondent: {
    name: 'Respondent'
  },
  tradeType: {
    id: 1
  },
  numberOfCredits: '',
  fairMarketValuePerCredit: ''
};

CreditTransferFormDetails.propTypes = {
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  totalValue: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default CreditTransferFormDetails;
