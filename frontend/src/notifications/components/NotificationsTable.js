/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import moment from 'moment-timezone'

import CheckBox from '../../app/components/CheckBox'
import NOTIFICATION_TYPES from '../../constants/notificationTypes'
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'
import ReactTable from '../../app/components/StateSavingReactTable'
import { useNavigate } from 'react-router'
import { calculatePages } from '../../utils/functions'

const NotificationsTable = (props) => {
  const navigate = useNavigate()
  const columns = [{
    accessor: item => item.id,
    Cell: row => (
      <CheckBox
        addToFields={() => {}}
        fields={props.fields.notifications}
        id={row.value}
        toggleCheck={props.toggleCheck}
      />
    ),
    className: 'col-mark',
    filterable: false,
    sortable: false,
    Header: 'Mark',
    id: 'mark',
    width: 50
  }, {
    accessor: (item) => {
      if (item.relatedCreditTrade) {
        return NOTIFICATION_TYPES[item.message].replace(/PVR/, item.relatedCreditTrade.type.theType)
      }

      if (item.relatedReport) {
        return NOTIFICATION_TYPES[item.message].replace(/Report/, `Report for ${item.relatedReport.compliancePeriod.description}`)
      }

      return NOTIFICATION_TYPES[item.message]
    },
    Cell: (row) => {
      let viewUrl = null

      if (row.original.relatedDocument) {
        viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(/:id/gi, row.original.relatedDocument.id)
      } else if (row.original.relatedCreditTrade) {
        viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(/:id/gi, row.original.relatedCreditTrade.id)
      } else if (row.original.relatedReport && row.original.relatedReport.type.theType === 'Compliance Report') {
        viewUrl = COMPLIANCE_REPORTING.EDIT.replace(/:id/gi, row.original.relatedReport.id)
        viewUrl = viewUrl.replace(/:tab/gi, 'intro')
      } else if (row.original.relatedReport && row.original.relatedReport.type.theType === 'Exclusion Report') {
        viewUrl = EXCLUSION_REPORTS.EDIT.replace(/:id/gi, row.original.relatedReport.id)
        viewUrl = viewUrl.replace(/:tab/gi, 'intro')
      }

      return (
        <button
          type="button"
          onClick={() => {
            props.updateNotification(row.original.id, { isRead: true })

            if (viewUrl) {
              navigate(viewUrl)
            }
          }}
        >
          {row.value}
        </button>
      )
    },
    className: 'col-notification',
    Header: 'Notification',
    headerClassName: 'col-notification',
    id: 'notification'
  }, {
    accessor: item => (item.createTimestamp ? moment(item.createTimestamp).format('YYYY-MM-DD h:mm a') : '-'),
    className: 'col-date',
    Header: 'Date',
    headerClassName: 'col-date',
    id: 'date',
    sortMethod: (a, b, desc) => {
      const value = moment(a).format('YYYY-MM-DD-HH:mm:ss')
      const previous = moment(b).format('YYYY-MM-DD-HH:mm:ss')

      // Return either 1 or -1 to indicate a sort priority
      if (value > previous) {
        return 1
      }
      if (value < previous) {
        return -1
      }
      // returning 0, undefined or any falsey value will use subsequent sorts or
      // the index as a tiebreaker
      return 0
    },
    width: 150
  }, {
    accessor: item => (item.originatingUser ? `${item.originatingUser.firstName} ${item.originatingUser.lastName}` : '-'),
    className: 'col-user',
    Header: 'User',
    headerClassName: 'col-user',
    id: 'user',
    width: 150
  }, {
    accessor: item => (item.relatedCreditTrade ? item.relatedCreditTrade.id : '-'),
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value)

      if (row.value === '-') {
        return '-'
      }

      return (
        <button
          type="button"
          onClick={() => {
            props.updateNotification(row.original.id, { isRead: true })

            navigate(viewUrl)
          }}
        >
          {row.value}
        </button>
      )
    },
    className: 'col-credit-trade',
    Header: 'Transaction ID',
    headerClassName: 'col-credit-trade',
    id: 'creditTrade',
    width: 100
  }, {
    accessor: item => (item.relatedOrganization ? item.relatedOrganization.name : '-'),
    className: 'col-organization',
    Header: 'Organization',
    headerClassName: 'col-organization',
    id: 'organization',
    width: 200
  }, {
    accessor: 'id',
    Cell: row => (
      <div className="col-actions">
        <button
          onClick={() => props.selectIdForModal(row.value)}
          type="button"
        >
          <FontAwesomeIcon
            data-toggle="modal"
            data-target="#confirmArchiveSingle"
            icon="minus-circle"
          />
        </button>
      </div>
    ),
    filterable: false,
    Header: '',
    id: 'actions',
    width: 50,
    sortable: false
  }]

  const filterable = true

  return (
    <ReactTable
      stateKey="notifications"
      className="searchable"
      columns={columns}
      data={props.items}
      loading={props.isFetching}
      filterable={filterable}
      getTrProps={(state, rowInfo) => ({
        className: (rowInfo && rowInfo.original.isRead) ? 'read' : 'unread'
      })}
      manual
      pages={calculatePages(props.notificationsCount, props.pageSize)}
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

NotificationsTable.propTypes = {
  fields: PropTypes.shape({
    notifications: PropTypes.array
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  selectIdForModal: PropTypes.func.isRequired,
  toggleCheck: PropTypes.func.isRequired,
  updateNotification: PropTypes.func.isRequired,
  notificationsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleFiltersChange: PropTypes.func.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  sort: PropTypes.arrayOf(PropTypes.object)
}

export default NotificationsTable
