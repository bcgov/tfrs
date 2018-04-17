import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../../constants/langEnUs';

import Errors from '../../../app/components/Errors';
import Loading from '../../../app/components/Loading';
import HistoricalDataEntryForm from './HistoricalDataEntryForm';
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons';
import HistoricalDataTable from './HistoricalDataTable';
import ModalDeleteCreditTransfer from '../../../credit_transfers/components/ModalDeleteCreditTransfer';
import ModalProcessApprovedCreditTransfer from '../../../credit_transfers/components/ModalProcessApprovedCreditTransfer';
import SuccessAlert from '../../../app/components/SuccessAlert';

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
        errors={props.addErrors}
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        totalValue={props.totalValue}
      />

      {isFetching && <Loading />}
      {!isFetching &&
      Object.keys(props.commitErrors).length > 0 &&
        <Errors errors={props.commitErrors} />
      }
      {!isFetching && props.commitMessage &&
        <SuccessAlert message={props.commitMessage} />
      }
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
        deleteCreditTransfer={props.deleteCreditTransfer}
        selectedId={props.selectedId}
      />

      <ModalProcessApprovedCreditTransfer
        processApprovedCreditTransfers={props.processApprovedCreditTransfers}
      />
    </div>
  );
};

HistoricalDataEntryPage.propTypes = {
  addErrors: PropTypes.shape({}).isRequired,
  commitErrors: PropTypes.shape({}).isRequired,
  commitMessage: PropTypes.string.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    creditsFrom: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    creditsTo: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    numberOfCredits: PropTypes.string,
    fairMarketValuePerCredit: PropTypes.string,
    note: PropTypes.string.isRequired,
    tradeEffectiveDate: PropTypes.string,
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
  processApprovedCreditTransfers: PropTypes.func.isRequired,
  selectedId: PropTypes.number.isRequired,
  selectIdForModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default HistoricalDataEntryPage;
