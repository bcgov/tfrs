/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

import Errors from '../../app/components/Errors';
import CreditTransactionFormDetails from './CreditTransactionFormDetails';
import * as Lang from '../../constants/langEnUs';

const CreditTransactionForm = props => (
  <div className="credit-transaction">
    <h1>{props.title}</h1>
    <form
      onSubmit={(event, status) =>
        props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
    >
      <CreditTransactionFormDetails
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
      />

      {Object.keys(props.errors).length > 0 &&
        <Errors errors={props.errors} />
      }

      <div className="btn-container">
        <button
          className="btn btn-default"
          type="button"
        >
          {Lang.BTN_APP_CANCEL}
        </button>
        <button
          className="btn btn-default"
          type="submit"
        >
          {Lang.BTN_SAVE_DRAFT}
        </button>
        <button
          className="btn btn-primary"
          type="submit"
        >
          {Lang.BTN_RECOMMEND_FOR_DECISION}
        </button>
      </div>
    </form>
  </div>
);

CreditTransactionForm.defaultProps = {
  id: 0,
  title: 'New Credit Transaction'
};

CreditTransactionForm.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({}).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.number,
  title: PropTypes.string
};

export default CreditTransactionForm;
