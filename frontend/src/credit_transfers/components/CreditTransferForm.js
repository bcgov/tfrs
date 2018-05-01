/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

import Errors from '../../app/components/Errors';
import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferFormDetails from './CreditTransferFormDetails';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormNote from './CreditTransferFormNote';
import CreditTransferFormButtons from './CreditTransferFormButtons';

import * as Lang from '../../constants/langEnUs';

const buttonActions = [Lang.BTN_DELETE, Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2];

const CreditTransferForm = props => (
  <div className="credit-transfer">
    <h1>{props.title}</h1>
    <CreditTransferProgress />
    <form
      className="form-inline"
      onSubmit={(event, status) =>
        props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
    >
      <CreditTransferFormDetails
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        totalValue={props.totalValue}
        handleInputChange={props.handleInputChange}
      />
      {Object.keys(props.errors).length > 0 &&
        <Errors errors={props.errors} />
      }
      <CreditTransferVisualRepresentation
        creditsFrom={props.creditsFrom}
        creditsTo={props.creditsTo}
        numberOfCredits={props.fields.numberOfCredits}
        totalValue={props.totalValue}
      />
      <CreditTransferFormNote
        note={props.fields.note}
        handleInputChange={props.handleInputChange}
      />
      <CreditTransferFormButtons
        actions={buttonActions}
        changeStatus={props.changeStatus}
        deleteCreditTransfer={props.deleteCreditTransfer}
        id={props.id}
      />
    </form>
  </div>
);

CreditTransferForm.defaultProps = {
  title: 'Credit Transfer',
  id: 0
};

CreditTransferForm.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
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
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired
};

export default CreditTransferForm;
