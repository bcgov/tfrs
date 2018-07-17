/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

import Errors from '../../app/components/Errors';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferFormDetails from './CreditTransferFormDetails';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormButtons from './CreditTransferFormButtons';
import CreditTransferTerms from './CreditTransferTerms';

const CreditTransferForm = props => (
  <div className="credit-transfer">
    <h1>{props.title}</h1>
    <CreditTransferProgress status={CREDIT_TRANSFER_STATUS.draft} type={props.fields.tradeType} />
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
        tradeType={props.fields.tradeType}
      />

      <span>You will have the opportunity to create comments after saving a draft</span>

      {(props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)) &&
        <CreditTransferTerms
          addToFields={props.addToFields}
          fields={props.fields}
          toggleCheck={props.toggleCheck}
        />
      }

      <CreditTransferFormButtons
        actions={props.buttonActions}
        changeStatus={props.changeStatus}
        disabled={
          {
            BTN_SIGN_1_2: props.fields.terms.findIndex(term => term.value === false) >= 0 ||
            props.fields.terms.length === 0
          }
        }
        permissions={
          {
            BTN_SIGN_1_2:
            props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN),
            BTN_SIGN_2_2:
            props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)
          }
        }
        id={props.id}
      />
    </form>
  </div>
);

CreditTransferForm.defaultProps = {
  id: 0,
  title: 'Credit Transfer'
};

CreditTransferForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  buttonActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeStatus: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({
    initiator: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    respondent: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    terms: PropTypes.array,
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
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.number,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    role: PropTypes.shape({
      id: PropTypes.number,
      isGovernmentRole: PropTypes.bool
    })
  }).isRequired,
  title: PropTypes.string,
  toggleCheck: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default CreditTransferForm;
