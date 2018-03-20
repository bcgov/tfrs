import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as Lang from '../../../constants/langEnUs';
import * as Routes from '../../../constants/routes';

import Loading from '../../../app/components/Loading';
import HistoricalDataEntryForm from './HistoricalDataEntryForm';
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons';
import HistoricalDataTable from './HistoricalDataTable';

const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_COMMIT];

const HistoricalDataEntryPage = (props) => {
  const { isFetching, items } = props.historicalData;
  const isEmpty = items.length === 0;

  return (
    <div className="page_historical_data_entry">
      <h1>{props.title}</h1>
      <HistoricalDataEntryForm
        errors={props.errors}
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        totalValue={props.totalValue}
      />
      {isFetching && <Loading />}
      {!isFetching &&
      <HistoricalDataTable
        fuelSuppliers={props.fuelSuppliers}
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
      <HistoricalDataEntryFormButtons 
        id={props.id}
        actions={buttonActions}
      />
    </div>
  );
};

HistoricalDataEntryPage.defaultProps = {
  title: 'Credit Transfer',
  id: 0
};

HistoricalDataEntryPage.propTypes = {
  errors: PropTypes.shape({}).isRequired,
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
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  totalValue: PropTypes.number.isRequired,
};

export default HistoricalDataEntryPage;
