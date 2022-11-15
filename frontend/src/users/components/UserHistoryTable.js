/*
 * Presentational component
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'

import { getCreditTransferType } from '../../actions/creditTransfersActions'
import ComplianceReportStatus from '../../compliance_reporting/components/ComplianceReportStatus'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports'
import * as Routes from '../../constants/routes'
import { useNavigate } from 'react-router'

const UserHistoryTable = props => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [pages, setPages] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = (state, instance) => {
    setLoading(true)

    const offset = state.page * state.pageSize
    const limit = state.pageSize
    const id = props.userId

    const sortBy = state.sorted[0].id
    const sortDirection = state.sorted[0].desc ? '-' : ''

    new Promise((resolve, reject) =>
      axios.get(`${Routes.BASE_URL}${Routes.USERS}/${id}/history`, {
        params: {
          limit,
          offset,
          sort_by: sortBy,
          sort_direction: sortDirection
        }
      }).then(response =>
        resolve({
          rows: response.data,
          pages: Math.ceil(parseInt(response.headers['x-total-count'], 10) / state.pageSize)
        }))).then((data) => {
      setData(data.rows)
      setPages(data.pages)
      setLoading(false)
    })
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  })

  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    show: false,
    width: 50
  }, {
    accessor: item => (item.historyType === 'Credit Trade'
      ? item.status && item.status.status
      : ComplianceReportStatus(item)
    ),
    className: 'col-action',
    Header: 'Action Taken',
    id: 'status',
    minWidth: 75,
    sortable: false
  }, {
    accessor: (item) => {
      if (item.historyType === 'Credit Trade') {
        return getCreditTransferType(item.type.id)
      }

      return item.type && item.type.theType
    },
    className: 'col-type',
    Header: 'Transaction Type',
    id: 'type',
    sortable: false,
    width: 150
  }, {
    accessor: item => item.objectId,
    className: 'col-id',
    Header: 'Transaction ID',
    id: 'id',
    resizable: false,
    width: 100
  }, {
    accessor: (item) => {
      if (item.createTimestamp) {
        const ts = Date.parse(item.createTimestamp)

        return formatter.format(ts)
      }

      return '-'
    },
    className: 'col-timestamp',
    Header: 'Timestamp',
    id: 'createTimestamp',
    minWidth: 75
  }, {
    accessor: item => item.fuelSupplier.name,
    Header: 'Organization',
    id: 'fuelSupplier',
    minWidth: 100,
    sortable: false
  }]

  return (
    <ReactTable
      defaultPageSize={10}
      defaultSorted={[{
        id: 'createTimestamp',
        desc: true
      }]}
      filterable={false}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              let viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(/:id/gi, row.original.objectId)

              if (row.original.type.theType === 'Compliance Report') {
                viewUrl = COMPLIANCE_REPORTING.EDIT.replace(/:id/gi, row.original.objectId)
                viewUrl = viewUrl.replace(/:tab/gi, 'intro')
              } else if (row.original.type.theType === 'Exclusion Report') {
                viewUrl = EXCLUSION_REPORTS.EDIT.replace(/:id/gi, row.original.objectId)
                viewUrl = viewUrl.replace(/:tab/gi, 'intro')
              }

              navigate(viewUrl)
            },
            className: 'clickable'
          }
        }

        return {}
      }}
      manual
      data={data}
      pages={pages}
      loading={loading}
      onFetchData={fetch}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      sortable
      multisort={false}
      columns={columns}
    />
  )
}

UserHistoryTable.propTypes = {
  userId: PropTypes.number.isRequired
}

export default UserHistoryTable
