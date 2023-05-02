/*
 * Presentational component
 */
import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import axios from 'axios'

import CREDIT_TRANSACTIONS from '../../../constants/routes/CreditTransactions'
import { CREDIT_TRANSFER_STATUS } from '../../../constants/values'
import * as Routes from '../../../constants/routes'
import { CREDIT_TRANSACTIONS_HISTORY } from '../../../constants/routes/Admin'
import { useNavigate } from 'react-router'
import { calculatePages } from '../../../utils/functions'

const CreditTradeHistoryTable = props => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [itemsCount, setItemsCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sorts, setSorts] = useState([{ id: 'createTimestamp', desc: true }])

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const url = `${Routes.BASE_URL}${CREDIT_TRANSACTIONS_HISTORY.API_PAGINATED}?page=${page}&size=${pageSize}`
    const data = { sorts }
    axios.post(url, data).then((response) => {
      setItems(response.data.results)
      setItemsCount(response.data.count)
      setLoading(false)
    })
  }, [page, pageSize, sorts])

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  })

  const columns = [{
    accessor: item => `${item.user.firstName} ${item.user.lastName}`,
    className: 'col-user',
    Header: 'User',
    id: 'user',
    minWidth: 50,
    sortable: false
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
          Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
        ).description),
    className: 'col-action',
    Header: 'Action Taken',
    id: 'action',
    minWidth: 50,
    sortable: false
  }, {
    accessor: item => item.creditTrade.id,
    className: 'col-id',
    Header: 'Transaction ID',
    id: 'creditTradeId',
    resizable: false,
    width: 100
  }, {
    accessor: item => item.creditTrade.initiator.name,
    className: 'col-initiator',
    Header: 'Initiator',
    id: 'initiator',
    minWidth: 100
  }, {
    accessor: item => item.creditTrade.respondent.name,
    className: 'col-respondent',
    Header: 'Respondent',
    id: 'respondent',
    minWidth: 100
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
  }]

  return (
    <ReactTable
      manual
      filterable={false}
      multisort={false}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      columns={columns}
      data={items}
      loading={loading}
      page={page - 1}
      pages={calculatePages(itemsCount, pageSize)}
      pageSize={pageSize}
      sorted={sorts}
      onPageChange={(pageIndex) => {
        setPage(pageIndex + 1)
      }}
      onPageSizeChange={(pageSize) => {
        setPage(1)
        setPageSize(pageSize)
      }}
      onSortedChange={(newSorted) => {
        setPage(1)
        setSorts(newSorted)
      }}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.original.creditTrade.id)
              navigate(viewUrl)
            },
            className: 'clickable'
          }
        }

        return {}
      }}
    />
  )
}

export default CreditTradeHistoryTable
