/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
// import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from "../../constants/values";
import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferFormDetails from './CreditTransferFormDetails';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormNote from './CreditTransferFormNote';
import CreditTransferFormButtons from './CreditTransferFormButtons';

const CreditTransferForm = props => (
  <div className="credit-transfer">
    <h1>{props.title}</h1>
    <CreditTransferProgress />
    <form className="form-inline">
      <CreditTransferFormDetails
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        totalValue={props.totalValue}
        handleInputChange={props.handleInputChange}
      />
      {props.errors.length > 0 &&
        <div className="alert alert-danger">
          <div>{props.errors}</div>
        </div>
      }
      <CreditTransferVisualRepresentation
        initiator={props.fields.initiator}
        respondent={props.fields.respondent}
        numberOfCredits={props.fields.numberOfCredits}
        totalValue={props.totalValue}
      />
      <CreditTransferFormNote
        note={props.fields.note}
        handleInputChange={props.handleInputChange}
      />
      <CreditTransferFormButtons
        history={props.history}
        handleSubmit={props.handleSubmit}
      />
    </form>
  </div>
);

CreditTransferForm.defaultProps = {
  title: 'Credit Transfer'
};

CreditTransferForm.propTypes = {
  title: PropTypes.string,
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
    note: PropTypes.string.isRequired
  }).isRequired,
  totalValue: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  errors: PropTypes.string.isRequired
};

export default CreditTransferForm;
