/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Errors from '../../../app/components/Errors';
import HistoricalDataEntryFormDetails from './HistoricalDataEntryFormDetails';

import * as Lang from '../../../constants/langEnUs';

const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_PROPOSE];

const HistoricalDataEntryForm = props => (
  <div className="historical-data-entry">
    <form
      onSubmit={(event, status) =>
        props.handleSubmit(event, '')}
    >
      <HistoricalDataEntryFormDetails 
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
        totalValue={props.totalValue}
      />
      {Object.keys(props.errors).length > 0 &&
        <Errors errors={props.errors} />
      }
    </form>
  </div>
);

HistoricalDataEntryForm.defaultProps = {
  id: 0
};

HistoricalDataEntryForm.propTypes = {
  id: PropTypes.number,
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
    effectiveDate: PropTypes.instanceOf(Date),
    numberOfCredits: PropTypes.string,
    dollarPerCredit: PropTypes.string,
    note: PropTypes.string.isRequired,
    transferType: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    zeroDollarReason: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryForm;
