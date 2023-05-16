/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'
import moment from 'moment-timezone'

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'
import ReactTable from '../../app/components/StateSavingReactTable'
import { useNavigate } from 'react-router'
import { calculatePages } from '../../utils/functions'

const SecureFileSubmissionTable = (props) => {
  const navigate = useNavigate()

  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    accessor: item => (item.createUser.organization ? item.createUser.organization.name : ''),
    className: 'col-organization',
    Header: 'Organization',
    id: 'organization',
    minWidth: 75,
    show: props.loggedInUser.isGovernmentUser
  }, {
    accessor: item => (item.type ? item.type.description : ''),
    className: 'col-attachment-type',
    Header: 'Attachment Type',
    id: 'attachment-type',
    minWidth: 75
  }, {
    accessor: (item) => {
      if (item.status) {
        if (item.status.status === 'Pending Submission') {
          const attachmentsScanned = item.attachments.filter(attachment => (
            ['PASS', 'FAIL'].indexOf(attachment.securityScanStatus) >= 0
          )).length
          // ensure that we always have at least 1 so we don't divide by 0
          const totalAttachments = (item.attachments.length > 0
            ? item.attachments.length
            : 1)

          return `Scan Progress: ${((attachmentsScanned / totalAttachments) * 100).toFixed(0)}%`
        }

        return item.status.status
      }

      return false
    },
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 75
  }, {
    accessor: (item) => {
      if (item.type.theType === 'Evidence') {
        if (item.milestone) {
          return `${item.title}: ${item.milestone}`
        }
      }

      return item.title
    },
    className: 'col-title',
    Header: 'Title',
    id: 'title',
    minWidth: 100
  }, {
    accessor: (item) => {
      if (item.creditTrades.length > 0) {
        return `${item.creditTrades[0].id}`
      } else {
        return '-'
      }
    },
    className: 'col-credit-transaction-id',
    Header: 'Credit Transaction ID',
    id: 'credit-transaction-id',
    minWidth: 70
  }, {
    accessor: (item) => {
      let historyFound = false
      if (item.history) {
        historyFound = item.history.find(itemHistory => (itemHistory.status.status === 'Submitted'))
      }

      if (historyFound) {
        return moment(historyFound.createTimestamp).format('YYYY-MM-DD')
      }

      return '-'
    },
    className: 'col-date',
    Header: 'Submitted On',
    id: 'updateTimestamp',
    minWidth: 65
  }]

  // const filterMethod = (filter, row, column) => {
  //   const id = filter.pivotId || filter.id
  //   return row[id] !== undefined
  //     ? String(row[id])
  //       .toLowerCase()
  //       .includes(filter.value.toLowerCase())
  //     : true
  // }

  const filterable = true

  return (
    <ReactTable
      stateKey="sfs"
      className="searchable"
      columns={columns}
      data={props.items}
      isFetching={props.isFetching}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          const securityScanFailed = row.original.status && row.original.status.status === 'Security Scan Failed'
          return {
            onClick: (e) => {
              const viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', row.original.id)

              navigate(viewUrl)
            },
            className: `clickable ${securityScanFailed && 'scan-failed'}`
          }
        }

        return {}
      }}
      manual
      pages={calculatePages(props.itemsCount, props.pageSize)}
      page={props.page - 1}
      pageSize={props.pageSize}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      onPageChange={(pageIndex) => {
        props.handlePageChange(pageIndex + 1)
      }}
      onPageSizeChange={(pageSize, pageIndex) => {
        props.handlePageChange(1)
        props.handlePageSizeChange(pageSize)
      }}
      filtered={props.filters}
      onFilteredChange={(filtered, column) => {
        props.handlePageChange(1)
        props.handleFiltersChange(filtered)
      }}
      sort={props.sort}
      onSortedChange={(sort, column) => {
        props.handlePageChange(1)
        props.handleSortChange(sort)
      }}
    />
  )
}

SecureFileSubmissionTable.defaultProps = {}

SecureFileSubmissionTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    createUser: PropTypes.shape({
      organization: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    status: PropTypes.shape({
      status: PropTypes.string
    }),
    listTitle: PropTypes.string,
    type: PropTypes.shape({
      id: PropTypes.number
    })
  })).isRequired,
  itemsCount: PropTypes.number.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  sort: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleFiltersChange: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  handleSortChange: PropTypes.func.isRequired
}

export default SecureFileSubmissionTable
