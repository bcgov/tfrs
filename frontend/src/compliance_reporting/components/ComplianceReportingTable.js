/*
 * Presentational component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import 'react-table/react-table.css'

import ReactTable from '../../app/components/StateSavingReactTable'

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports'
import ComplianceReportStatus from './ComplianceReportStatus'
import { withRouter } from '../../utils/withRouter'
import { calculatePages } from '../../utils/functions'

class ComplianceReportingTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 1,
      pageSize: 10,
      filters: props.filters,
      sorts: []
    }

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this)
    this.handleFiltersChange = this.handleFiltersChange.bind(this)
    this.handleSortsChange = this.handleSortsChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.page !== prevState.page || this.state.pageSize !== prevState.pageSize || this.state.filters !== prevState.filters || this.state.sorts !== prevState.sorts) {
      this.props.getComplianceReports({ page: this.state.page, pageSize: this.state.pageSize, filters: this.state.filters, sorts: this.state.sorts })
    }
    if (JSON.stringify(this.props.filters) !== JSON.stringify(prevState.filters)) {
      this.setState({ filters: this.props.filters })
    }
  }

  handlePageChange (page) {
    this.setState({ page ,sorts: [{
      id: 'updateTimestamp',
      desc: true
    }]})
  }

  handlePageSizeChange (pageSize) {
    this.setState({ pageSize })
  }

  handleFiltersChange (filters) {
    this.setState({ filters })
  }

  sortFunc (val1, val2, desc) {
    if (desc) {
      if (val1 > val2) {
        return 1
      }
      if (val1 < val2) {
        return -1
      }
      return 0
    } else {
      if (val2 > val1) {
        return 1
      }
      if (val2 < val1) {
        return -1
      }
      return 0
    }
  }

  handleSortsChange (sorts) {
    this.setState({ sorts })
  }

  render () {
    this.props.items.reverse()
    const cols = [{
      accessor: item => (item.groupId),
      className: 'col-groupId',
      Header: 'Group ID',
      id: 'groupId',
      minWidth: 25,
      show: false
    }, {
      accessor: (item) => {
        // if (item.supplements !== null) {
        //   return ''
        // }
        return (item.compliancePeriod ? item.compliancePeriod.description : '')
      },
      className: 'col-compliance-year',
      Header: 'Compliance Period',
      id: 'compliance-period',
      minWidth: 50
    },
    {
      accessor: item => item.organization.name,
      className: 'col-Supplier',
      Header: 'Supplier',
      id: 'Supplier',
      minWidth: 50,
      show: this.props.loggedInUser.isGovernmentUser
    },
    {
      accessor: item => item.type,
      className: 'col-type',
      Header: 'Type',
      id: 'compliance-period-type',
      minWidth: 50
    }, {
      accessor: (item) => {
        // Temporarily left commented out for posterity and client feedback
        let report = item
        const { supplementalReports } = item
        if (supplementalReports.length > 0) {
          [report] = supplementalReports
        }
        while (report.supplementalReports && report.supplementalReports.length > 0) {
          [report] = report.supplementalReports
        }
        return ComplianceReportStatus(report)

        // return ComplianceReportStatus(item)
      },
      className: 'col-status',
      Header: 'Current Status',
      id: 'current-status',
      minWidth: 75
    }, {
      accessor: item => (item.updateTimestamp ? item.updateTimestamp : null),
      className: 'col-date',
      Header: 'Last Status Update',
      id: 'updateTimestamp',
      minWidth: 95,
      Cell: row => (
        <span>
          {row.original.updateTimestamp
            ? moment(row.original.updateTimestamp).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z')
            : '-'
          }
        </span>
      )
    }]
    const columns = [{
      accessor: item => (item.groupId),
      className: 'col-groupId',
      Header: 'Group ID',
      id: 'groupId',
      minWidth: 25,
      show: false
    }, {
      accessor: (item) => {
        if (item.supplements !== null) {
          return ''
        }
        return (item.compliancePeriod ? item.compliancePeriod.description : '')
      },
      className: 'col-compliance-year',
      Header: 'Compliance Period',
      id: 'compliance-period',
      minWidth: 50
    }, {
      accessor: item => (item.organization ? item.organization.name : ''),
      className: 'col-organization',
      Header: 'Organization',
      id: 'organization',
      minWidth: 75,
      show: this.props.loggedInUser.isGovernmentUser
    }, {
      accessor: item => (item.displayName),
      className: 'col-displayname',
      Header: 'Display Name',
      id: 'displayname',
      minWidth: 75
    }, {
      accessor: (item) => {
        return ComplianceReportStatus(item)
      },
      className: 'col-status',
      Header: 'Original Status',
      id: 'status',
      minWidth: 75
    }, {
      accessor: (item) => {
        if (item.supplementalReports == null || item.supplementalReports.length === 0) {
          return '-'
        }
        let deepestSupplemental = item.supplementalReports[0]
        while (deepestSupplemental.supplementalReports && deepestSupplemental.supplementalReports.length > 0) {
          deepestSupplemental = deepestSupplemental.supplementalReports[0]
        }

        return ComplianceReportStatus(deepestSupplemental)
      },
      className: 'col-supplemental-status',
      Header: 'Supplemental Status',
      id: 'supplemental-status',
      minWidth: 75
    }, {
      accessor: (item) => {
        let report = item
        const { supplementalReports } = item
        if (supplementalReports.length > 0) {
          [report] = supplementalReports
        }
        while (report.supplementalReports && report.supplementalReports.length > 0) {
          [report] = report.supplementalReports
        }
        return ComplianceReportStatus(report)
      },
      className: 'col-status',
      Header: 'Current Status',
      id: 'current-status',
      minWidth: 75
    }, {
      accessor: item => (item.sortDate ? item.sortDate : null),
      className: 'col-date',
      Header: 'Last Updated On',
      id: 'updateTimestamp',
      minWidth: 95,
      Cell: row => (
        <span>
          {row.original.sortDate
            ? moment(row.original.sortDate).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z')
            : '-'
          }
        </span>
      )
    },
    {
      accessor: item => item.updateTimestamp,
      className: 'col-date',
      Header: 'Submission Date',
      id: 'submissionDate',
      minWidth: 95,
      Cell: row => (
        <span>
          {
            row.original.updateTimestamp && moment(row.original.updateTimestamp).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z')
          }
        </span>
      )
    }
    ]
    const tableHeader = this.state.filters?.find(val => val.tableId)
    const filterable = true
    return (
      <ReactTable
        stateKey="compliance-reporting"
        className="searchable complianceReportListTable"
        columns={cols}
        data={this.props?.items}
        loading={this.props.isFetching}
        // filterable={filterable}
        getTrProps={(state, row) => {
          const stripeClass = row && row.nestingPath[0] % 2 ? 'odd' : 'even' || 'even'
          if (row && row.original) {
            return {
              onClick: (e) => {
                let tab = 'intro'
                let { status } = row.original
                const { groupId, supplementalReports, type } = row.original
                if (supplementalReports.length > 0) {
                  let [deepestSupplementalReport] = supplementalReports

                  while (deepestSupplementalReport.supplementalReports &&
                    deepestSupplementalReport.supplementalReports.length > 0) {
                    [deepestSupplementalReport] = deepestSupplementalReport.supplementalReports
                  }
                  ({ status } = deepestSupplementalReport)
                }

                if (status &&
                  (status.directorStatus !== 'Rejected' &&
                    (['Accepted'].indexOf(status.directorStatus) >= 0 ||
                    ['Recommended', 'Not Recommended'].indexOf(status.analystStatus) >= 0 ||
                    ['Recommended', 'Not Recommended'].indexOf(status.managerStatus) >= 0))) {
                  tab = 'schedule-assessment'
                }

                let viewUrl = COMPLIANCE_REPORTING.EDIT.replace(':id', groupId)
                  .replace(':tab', tab)

                if (type === 'Exclusion Report') {
                  viewUrl = EXCLUSION_REPORTS.EDIT.replace(':id', groupId)
                    .replace(':tab', tab)
                }

                this.props.navigate(viewUrl)
              },
              className: `clickable ${stripeClass}`
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
          this.handlePageChange(pageIndex + 1)
        }}
        onPageSizeChange={(pageSize, pageIndex) => {
          this.handlePageChange(1)
          this.handlePageSizeChange(pageSize)
        }}
        filtered={tableHeader?.tableId || this.state.filters}
        onFilteredChange={(filtered, column) => {
          this.handlePageChange(1)
          this.handleFiltersChange(filtered)
        }}
        sorts={this.state.sorts}
        onSortedChange={(sorts, column) => {
          if(column.Header == 'Last Status Update'){
            this.handlePageChange(1)
            this.handleSortsChange(sorts)
          }
        }}
      />
    )
  }
}

ComplianceReportingTable
  .defaultProps = {}

ComplianceReportingTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    organization: PropTypes.shape({
      name: PropTypes.string
    }),
    status: PropTypes.object,
    type: PropTypes.string
  })).isRequired,
  itemsCount: PropTypes.number.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  filters: PropTypes.any,
  navigate: PropTypes.func.isRequired
}

export default withRouter(ComplianceReportingTable)
