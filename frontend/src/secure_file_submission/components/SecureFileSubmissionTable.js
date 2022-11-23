/*
 * Presentational component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import 'react-table/react-table.css'

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload'
import ReactTable from '../../app/components/StateSavingReactTable'
import { withRouter } from '../../utils/withRouter';
import { calculatePages} from '../../utils/functions'

class SecureFileSubmissionTable extends Component {

  constructor (props) {
    super(props);

    this.state = {
      page: 1,
      pageSize: 10,
      filters: []
    }

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.page !== prevState.page || this.state.pageSize !== prevState.pageSize || this.state.filters !== prevState.filters) {
      this.props.getComplianceReports({page: this.state.page, pageSize: this.state.pageSize, filters: this.state.filters})
    }
  }

  handlePageChange (page) {
    this.setState({page: page});
  }

  handlePageSizeChange (pageSize) {
    this.setState({pageSize: pageSize});
  }

  handleFiltersChange (filters) {
    this.setState({filters: filters});
  }


  render () {
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
      className: 'col-credit-transaction-id',
      Header: 'Credit Transaction ID',
      id: 'credit-transaction-id',
      minWidth: 70
    }, {
      accessor: (item) => {
        const historyFound = item.history.find(itemHistory => (itemHistory.status.status === 'Submitted'))

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

    const filterable = true

    return (
      <ReactTable
        stateKey="sfs"
        className="searchable"
        columns={columns}
        data={props.items}
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
        pages={calculatePages(this.props.itemsCount, this.state.pageSize)}
        page={this.state.page - 1}
        pageSize={this.state.pageSize}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        onPageChange={(pageIndex) => {
          this.handlePageChange(pageIndex + 1);
        }}
        onPageSizeChange={(pageSize, pageIndex) => {
          this.handlePageChange(1);
          this.handlePageSizeChange(pageSize);
        }}
        filtered={this.state.filters}
        onFilteredChange={(filtered, column) => {
          this.handlePageChange(1);
          this.handleFiltersChange(filtered);
        }}
      />
    )
  }
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
      id: PropTypes.integer
    })
  })).isRequired,
  itemsCount: PropTypes.number.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  getComplianceReports: PropTypes.func.isRequired
}

export default withRouter(SecureFileSubmissionTable)
