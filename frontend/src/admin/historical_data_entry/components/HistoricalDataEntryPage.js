import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../../constants/langEnUs';

import Loading from '../../../app/components/Loading';
import HistoricalDataEntryForm from './HistoricalDataEntryForm';
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons';
import HistoricalDataTable from './HistoricalDataTable';
import ModalDeleteCreditTransfer from '../../../credit_transfers/components/ModalDeleteCreditTransfer';

const buttonActions = [Lang.BTN_CANCEL, Lang.BTN_COMMIT];
const formActions = [Lang.BTN_ADD_TO_QUEUE];

const HistoricalDataEntryPage = (props) => {
  const { isFetching, items } = props.historicalData;
  const isEmpty = items.length === 0;

  return (
    <div className="page_historical_data_entry">
      <h1>{props.title}</h1>
      <HistoricalDataEntryForm
        actions={formActions}
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
        selectIdForModal={props.selectIdForModal}
      />
      }
      <div className="historical-data-entry-actions">
        <HistoricalDataEntryFormButtons actions={buttonActions} />
      </div>

      <ModalDeleteCreditTransfer
        selectedId={props.selectedId}
      />
    </div>
  );
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
    effectiveDate: PropTypes.string,
    numberOfCredits: PropTypes.string,
    dollarPerCredit: PropTypes.string,
    note: PropTypes.string.isRequired,
    transferType: PropTypes.string,
    zeroDollarReason: PropTypes.string
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  historicalData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  selectedId: PropTypes.number.isRequired,
  selectIdForModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryPage;
