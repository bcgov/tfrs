/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'
import moment from 'moment-timezone'
import numeral from 'numeral'

import * as NumberFormat from '../../constants/numeralFormats'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import { getCreditTransferType } from '../../actions/creditTransfersActions'
import filterNumber from '../../utils/filters'
import ReactTable from '../../app/components/StateSavingReactTable'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import { useNavigate } from 'react-router'

const CreditTransferTable = (props) => {
  const navigate = useNavigate()
  const columns = [{
    accessor: 'complianceReport',
    className: 'col-compliance-report',
    Header: 'Compliance Report',
    show: false
  }, {
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
    className: 'col-compliance-period',
    Header: 'Compliance Period',
    id: 'compliancePeriod',
    minWidth: 45
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
    minWidth: 190
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
    minWidth: 190
  }, {
    accessor: item => item.numberOfCredits,
    className: 'col-credits',
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    filterMethod: (filter, row) => filterNumber(filter.value, row.numberOfCredits, 0),
    Header: 'Quantity of Credits',
    id: 'numberOfCredits',
    minWidth: 75
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
    minWidth: 65
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
          Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
        ).description),
    className: 'col-status',
    filterMethod: (filter, row) => {
      const values = filter.value.toLowerCase().split(',')
      let found = false

      values.forEach((value) => {
        const filterValue = value.trim()
        if (filterValue !== '' && row.status.toLowerCase().includes(filterValue)) {
          found = true
        }
      })

      return found
    },
    Header: 'Status',
    id: 'status',
    minWidth: 80
  }, {
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    minWidth: 95
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
      stateKey="credit-transfers"
      className="searchable"
      data={props.items}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              let viewUrl
              if (row.original.complianceReport) {
                viewUrl = COMPLIANCE_REPORTING.EDIT
                  .replace(':id', row.original.complianceReport)
                  .replace(':tab', 'schedule-assessment')
              } else {
                viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.original.id)
              }
              navigate(viewUrl)
            },
            className: `clickable ${(row && row.original.id.toString() === props.highlight) && 'highlight'}`
          }
        }

        return {}
      }}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  )
}

CreditTransferTable.defaultProps = {
  highlight: null
}

CreditTransferTable.propTypes = {
  highlight: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default CreditTransferTable
