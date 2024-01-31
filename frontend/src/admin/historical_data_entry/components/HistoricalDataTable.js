/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import 'react-table/react-table.css'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import numeral from 'numeral'

import * as NumberFormat from '../../../constants/numeralFormats'
import { HISTORICAL_DATA_ENTRY } from '../../../constants/routes/Admin'
import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../../constants/values'
import { getCreditTransferType } from '../../../actions/creditTransfersActions'
import filterNumber from '../../../utils/filters'
import ReactTable from '../../../app/components/StateSavingReactTable'

const HistoricalDataTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id',
    maxWidth: 50,
    resizable: false
  }, {
    id: 'compliancePeriod',
    Header: 'Compliance Period',
    className: 'col-compliance-period',
    accessor: item => ((item.compliancePeriod) ? item.compliancePeriod.description : null)
  }, {
    id: 'effectiveDate',
    Header: 'Effective Date',
    accessor: item => item.tradeEffectiveDate,
    className: 'col-effective-date'
  }, {
    id: 'transactionType',
    Header: 'Type',
    accessor: item => getCreditTransferType(item.type.id),
    className: 'col-transfer-type'
  }, {
    id: 'creditsFrom',
    Header: 'Compliance Units From',
    accessor: item => item.creditsFrom.name,
    minWidth: 200,
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.adminAdjustment.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return (
          <div className="greyed-out">N/A</div>
        )
      }

      return row.value
    }
  }, {
    id: 'creditsTo',
    Header: 'Credits To',
    accessor: item => item.creditsTo.name,
    minWidth: 200,
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.retirement.id) {
        return (
          <div className="greyed-out">N/A</div>
        )
      }

      return row.value
    }
  }, {
    id: 'numberOfCredits',
    Header: 'Credits',
    accessor: item => item.numberOfCredits,
    className: 'col-credits',
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    filterMethod: (filter, row) => filterNumber(filter.value, row.numberOfCredits, 0)
  }, {
    id: 'fairMarketValuePerCredit',
    Header: 'Value Per Credit',
    className: 'col-price',
    accessor: (item) => {
      if (item.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.adminAdjustment.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.retirement.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return -1 // this is to fix sorting (value can't be negative)
      }

      return parseFloat(item.fairMarketValuePerCredit)
    },
    minWidth: 100,
    Cell: row => (
      (row.value === -1) ? '-' : numeral(row.value).format(NumberFormat.CURRENCY)
    ),
    filterMethod: (filter, row) => filterNumber(filter.value, row.fairMarketValuePerCredit)
  }, {
    id: 'zeroReason',
    Header: 'Zero Reason',
    accessor: item => item.zeroReason,
    className: 'col-zero-reason',
    Cell: (row) => {
      const zeroReason = row.value
      let content

      if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.affiliate.id) {
        content = ZERO_DOLLAR_REASON.affiliate.description
      } else if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.other.id) {
        content = ZERO_DOLLAR_REASON.other.description
      }

      return content || ''
    }
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    filterable: false,
    Cell: (row) => {
      const editUrl = HISTORICAL_DATA_ENTRY.EDIT.replace(':id', row.value)

      return (
        <div className="col-actions">
          <Link className="action" to={editUrl}><FontAwesomeIcon icon="edit" /></Link>
          <button
            className="action"
            data-toggle="modal"
            data-target="#confirmDelete"
            onClick={() => props.selectIdForModal(row.value)}
          >
            <FontAwesomeIcon
              icon="minus-circle"
              style={{ pointerEvents: 'none' }}
            />
          </button>
        </div>
      )
    },
    maxWidth: 75
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
      stateKey="historical-data-entry"
      className="searchable"
      data={props.items}
      defaultPageSize={5}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  )
}

HistoricalDataTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectIdForModal: PropTypes.func.isRequired
}

export default HistoricalDataTable
