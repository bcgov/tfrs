/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ReactTableDefaults } from 'react-table';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import 'react-table/react-table.css';

import ReactTable from '../../app/components/StateSavingReactTable';

import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';
import ComplianceReportStatus from './ComplianceReportStatus';

class ComplianceReportingTable extends Component {
  constructor (props) {
    super(props);

    this.state = {
      expanded: this.computeExpanded(props)
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ expanded: this.computeExpanded(nextProps) });
  }

  // eslint-disable-next-line class-methods-use-this
  computeExpanded (props) {
    const newExpanded = {};
    if (props.items) {
      for (let i = 0; i < props.items.length; i += 1) {
        // just expand everything
        newExpanded[i] = true;
      }
    }
    return newExpanded;
  }

  render () {
    const customDefaults = {
      ...ReactTableDefaults.column
    };

    const columns = [{
      expander: true,
      show: false
    },
      {
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
        if (item.supplements !== null) {
          return ([
            <FontAwesomeIcon
              className="fa-rotate-90"
              style={{
                marginLeft: '16px',
                marginRight: '8px'
              }}
              icon="level-up-alt"
            />,
            item.displayName
          ]);
        }
        return (item.displayName);
      },
      className: 'col-displayname',
      Header: 'Display Name',
      id: 'displayname',
      minWidth: 75
    }, {
      accessor: item => (item.type),
      className: 'col-type',
      Header: 'Type',
      id: 'type',
      minWidth: 75
    }, {
      accessor: ComplianceReportStatus,
      className: 'col-status',
      Header: 'Status',
      id: 'status',
      minWidth: 75
    },
      {
        accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
        className: 'col-date',
        Header: 'Last Updated On',
        id: 'updateTimestamp',
        minWidth: 95
      },
      {
        accessor: item => (item.supplements ? '' : moment(item.sortDate).format('YYYY-MM-DD')),
        className: 'col-sdate',
        Header: 'Last Activity',
        id: 'sortDate',
        minWidth: 95,
        show: false //in discussion
      }
    ];

    const filterMethod = (filter, row, column) => {
      const id = filter.pivotId || filter.id;

      return row[id] !== undefined ? String(row[id])
        .toLowerCase()
        .includes(filter.value.toLowerCase()) : true;
    };

    const findExpanded = data => (
      data.map((row, i) => (
        { i: true }
      ))
    );

    const filterable = true;

    return (
      <ReactTable
        stateKey="compliance-reporting"
        className="searchable complianceReportListTable"
        columns={columns}
        data={this.props.items}
        expanded={this.state.expanded}
        onExpandedChange={(expanded, index, event) => {
          this.setState({ expanded });
        }}
        defaultFilterMethod={filterMethod}
        defaultPageSize={10}
        defaultSorted={[{
          id: 'id',
          desc: true
        }]}
        loading={this.props.isFetching}
        filterable={filterable}
        subRowsKey="supplementalReports"
        getTrProps={(state, row) => {
          const stripeClass = row && row.nestingPath[0] % 2 ? 'odd' : 'even' || 'even';
          if (row && row.original) {
            return {
              onClick: (e) => {
                let viewUrl = COMPLIANCE_REPORTING.EDIT.replace(':id', row.original.groupId)
                  .replace(':tab', 'intro');

                if (row.original.type === 'Exclusion Report') {
                  viewUrl = EXCLUSION_REPORTS.EDIT.replace(':id', row.original.id)
                    .replace(':tab', 'intro');
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
