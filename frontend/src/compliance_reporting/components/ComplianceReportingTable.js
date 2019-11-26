/*
 * Presentational component
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {ReactTableDefaults} from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import 'react-table/react-table.css';

import ReactTable from '../../app/components/StateSavingReactTable';

import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';
import ComplianceReportStatus from './ComplianceReportStatus';

class ComplianceReportingTable extends Component {

  render() {
    const customDefaults = {
      ...ReactTableDefaults.column
    };

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
          return '';
        }
        return (item.compliancePeriod ? item.compliancePeriod.description : '');
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
      accessor: (item) => {
        return (item.displayName);
      },
      className: 'col-displayname',
      Header: 'Display Name',
      id: 'displayname',
      minWidth: 75
    }, {
      accessor: ComplianceReportStatus,
      className: 'col-status',
      Header: 'Status',
      id: 'status',
      minWidth: 75
    }, {
      accessor: (item) => {
        if (item.supplementalReports == null || item.supplementalReports.length === 0) {
          return '-';
        }
        let deepestSupplemental = item.supplementalReports[0];
        while (deepestSupplemental.supplementalReports && deepestSupplemental.supplementalReports.length > 0) {
          deepestSupplemental = deepestSupplemental.supplementalReports[0];
        }

        return ComplianceReportStatus(deepestSupplemental);
      },
      className: 'col-supplemental-status',
      Header: 'Supplemental Status',
      id: 'supplemental-status',
      minWidth: 75
    }, {
      accessor: item => (item.sortDate ? item.sortDate : null),
      className: 'col-date',
      Header: 'Last Updated On',
      id: 'updateTimestamp',
      minWidth: 95,
      filterMethod: (filter, row) => {
        const displayedValue = row.updateTimestamp ?
          moment(row.updateTimestamp).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z') : '-';

        return displayedValue.includes(filter.value);
      },
      Cell: row => (<span>
        {row.original.sortDate ?
          moment(row.original.sortDate).tz('America/Vancouver').format('YYYY-MM-DD h:mm a z') : '-'
        }
      </span>)
    }];

    const filterMethod = (filter, row, column) => {
      const id = filter.pivotId || filter.id;

      return row[id] !== undefined ? String(row[id])
        .toLowerCase()
        .includes(filter.value.toLowerCase()) : true;
    };

    const findExpanded = data => (
      data.map((row, i) => (
        {i: true}
      ))
    );

    const filterable = true;

    return (
      <ReactTable
        stateKey="compliance-reporting"
        className="searchable complianceReportListTable"
        columns={columns}
        data={this.props.items}
        defaultFilterMethod={filterMethod}
        defaultPageSize={10}
        defaultSorted={[{
          id: 'id',
          desc: true
        }]}
        loading={this.props.isFetching}
        filterable={filterable}
        getTrProps={(state, row) => {
          const stripeClass = row && row.nestingPath[0] % 2 ? 'odd' : 'even' || 'even';
          if (row && row.original) {
            return {
              onClick: (e) => {
                let tab = 'intro';

                if (row.original.status &&
                  (['Accepted', 'Rejected'].indexOf(row.original.status.directorStatus) >= 0 ||
                    ['Recommended', 'Not Recommended'].indexOf(row.original.status.analystStatus) >= 0 ||
                    ['Recommended', 'Not Recommended'].indexOf(row.original.status.managerStatus) >= 0)) {
                  tab = 'schedule-assessment';
                }

                let viewUrl = COMPLIANCE_REPORTING.EDIT.replace(':id', row.original.groupId)
                  .replace(':tab', tab);

                if (row.original.type === 'Exclusion Report') {
                  viewUrl = EXCLUSION_REPORTS.EDIT.replace(':id', row.original.groupId)
                    .replace(':tab', tab);
                }

                history.push(viewUrl);
              },
              className: `clickable ${stripeClass}`
            };
          }

          return {};
        }}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      />
    );
  }
}

ComplianceReportingTable
  .defaultProps = {};

ComplianceReportingTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    organization: PropTypes.shape({
      name: PropTypes.string
    }),
    status: PropTypes.object,
    type: PropTypes.string
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default ComplianceReportingTable;
