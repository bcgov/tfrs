import React from 'react'
import moment from 'moment-timezone'
import numeral from 'numeral'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import { getCreditTransferType } from '../../actions/creditTransfersActions'
import * as NumberFormat from '../../constants/numeralFormats'
import filterNumber from '../../utils/filters'
import ReactTable from '../../app/components/StateSavingReactTable'

const LinkedCreditTransferSelection = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 50
  }, {
    accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
    className: 'col-compliance-period',
    Header: 'Compliance Period',
    id: 'compliancePeriod',
    minWidth: 90
  }, {
    accessor: item => getCreditTransferType(item.type.id),
    className: 'col-transfer-type',
    Header: 'Type',
    id: 'transactionType',
    minWidth: 110
  }, {
    accessor: item => ([
      CREDIT_TRANSFER_TYPES.part3Award.id, CREDIT_TRANSFER_TYPES.validation.id
    ].includes(item.type.id)
      ? ''
      : item.creditsFrom.name),
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return (
          <div className="greyed-out">N/A</div>
        )
      }

      return row.value
    },
    Header: 'Credits From',
    id: 'creditsFrom',
    minWidth: 200
  }, {
    accessor: item => ((item.type.id === CREDIT_TRANSFER_TYPES.retirement.id) ? '' : item.creditsTo.name),
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.retirement.id) {
        return (
          <div className="greyed-out">N/A</div>
        )
      }

      return row.value
    },
    Header: 'Credits To',
    id: 'creditsTo',
    minWidth: 200
  }, {
    accessor: item => item.numberOfCredits,
    className: 'col-credits',
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    filterMethod: (filter, row) => filterNumber(filter.value, row.numberOfCredits, 0),
    Header: 'Quantity of Credits',
    id: 'numberOfCredits',
    minWidth: 100
  }, {
    accessor: (item) => {
      if (item.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.retirement.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return -1 // this is to fix sorting (value can't be negative)
      }

      return parseFloat(item.fairMarketValuePerCredit)
    },
    Cell: row => (
      (row.value === -1) ? '-' : numeral(row.value).format(NumberFormat.CURRENCY)
    ),
    className: 'col-price',
    filterMethod: (filter, row) => filterNumber(filter.value, row.fairMarketValuePerCredit),
    Header: 'Value Per Credit',
    id: 'fairMarketValuePerCredit',
    minWidth: 100
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
          Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
        ).description),
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 80
  }, {
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp'
  }, {
    accessor: 'id',
    Cell: row => (
      <button
        className="credit-transfer-link"
        data-dismiss="modal"
        onClick={() => props.establishLink(row.value)}
        type="button"
      >
        <FontAwesomeIcon icon="link" />
      </button>
    ),
    className: 'col-actions',
    filterable: false,
    Header: 'Link',
    id: 'actions',
    minWidth: 50
  }]

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined
      ? String(row[id])
        .toLowerCase()
        .includes(filter.value.toLowerCase())
      : true
  }

  const filterable = true

  return (
    <ReactTable
      stateKey="linked-credit-transfer"
      saveState={false}
      className="searchable"
      columns={columns}
      data={props.creditTransfers}
      defaultFilterMethod={filterMethod}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      id="link-credit-transfer-table"
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  )
}

LinkedCreditTransferSelection.defaultProps = {
  creditTransfers: []
}

LinkedCreditTransferSelection.propTypes = {
  establishLink: PropTypes.func.isRequired,
  creditTransfers: PropTypes.arrayOf(PropTypes.shape)

}

export default LinkedCreditTransferSelection
