import React from 'react'
import PropTypes from 'prop-types'

import * as Lang from '../../../constants/langEnUs'

import Errors from '../../../app/components/Errors'
import Loading from '../../../app/components/Loading'
import HistoricalDataEntryForm from './HistoricalDataEntryForm'
import HistoricalDataEntryFormButtons from './HistoricalDataEntryFormButtons'
import HistoricalDataTable from './HistoricalDataTable'
import Modal from '../../../app/components/Modal'
import SuccessAlert from '../../../app/components/SuccessAlert'

const buttonActions = [Lang.BTN_CANCEL, Lang.BTN_COMMIT]
const formActions = [Lang.BTN_ADD_TO_QUEUE]

const HistoricalDataEntryPage = (props) => {
  const { isFetching, items } = props.historicalData
  const isEmpty = items.length === 0

  return (
    <div className="page_historical_data_entry">
      <h1>{props.title}</h1>

      <HistoricalDataEntryForm
        actions={formActions}
        compliancePeriods={props.compliancePeriods}
        errors={props.addErrors}
        fuelSuppliers={props.fuelSuppliers}
        fields={props.fields}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        totalValue={props.totalValue}
        validationErrors={props.validationErrors}
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

      <Modal
        handleSubmit={() => props.deleteCreditTransfer(props.selectedId)}
        id="confirmDelete"
        title="Confirm Delete"
      >
        Do you want to delete this credit transaction?
      </Modal>

      <Modal
        handleSubmit={props.processApprovedCreditTransfers}
        id="confirmProcess"
        title="Confirm Process"
      >
        Are you sure you want to commit the approved credit transactions?
      </Modal>
    </div>
  )
}

HistoricalDataEntryPage.defaultProps = {
  validationErrors: {}
}

HistoricalDataEntryPage.propTypes = {
  addErrors: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]).isRequired,
  commitErrors: PropTypes.shape({}).isRequired,
  commitMessage: PropTypes.string.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    comment: PropTypes.string.isRequired,
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
    numberOfCredits: PropTypes.string,
    fairMarketValuePerCredit: PropTypes.string,
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
  totalValue: PropTypes.number.isRequired,
  validationErrors: PropTypes.shape({})
}

export default HistoricalDataEntryPage
