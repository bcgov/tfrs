/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Errors from '../../../app/components/Errors';
import HistoricalDataEntryFormDetails from './HistoricalDataEntryFormDetails';

const HistoricalDataEntryForm = props => (
  <div className="historical-data-entry">
    {Object.keys(props.errors).length > 0 &&
      <Errors errors={props.errors} />
    }
    <form
      onSubmit={(event, status) =>
        props.handleSubmit(event, '')}
    >
      <HistoricalDataEntryFormDetails
        actions={props.actions}
        compliancePeriods={props.compliancePeriods}
        editMode={props.editMode}
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        totalValue={props.totalValue}
      />

    </form>
  </div>
);

HistoricalDataEntryForm.defaultProps = {
  editMode: false
};

HistoricalDataEntryForm.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  editMode: PropTypes.bool,
  errors: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    creditsFrom: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    creditsTo: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    fairMarketValuePerCredit: PropTypes.string,
    note: PropTypes.string.isRequired,
    numberOfCredits: PropTypes.string,
    tradeEffectiveDate: PropTypes.string,
    transferType: PropTypes.string,
    zeroDollarReason: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryForm;
