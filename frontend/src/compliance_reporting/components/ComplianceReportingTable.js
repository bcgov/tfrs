/*
 * Presentational component
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import moment from 'moment';

import ReactTable from '../../app/components/StateSavingReactTable';
import {ReactTableDefaults} from 'react-table';

import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';
import ComplianceReportStatus from './ComplianceReportStatus';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const ComplianceReportRow = (props) => {
  return (
    [
      <tr key={props.complianceReport.id}>
        <td>
          <FontAwesomeIcon style={{marginLeft: `${props.tabDepth*2}em`}} icon="arrow-right"/>
          <a onClick={e => {
            let viewUrl = COMPLIANCE_REPORTING.EDIT.replace(':id', props.complianceReport.id)
              .replace(':tab', 'intro');
            history.push(viewUrl);
          }}>{props.complianceReport.displayName}</a>
        </td>
        <td><ComplianceReportStatus status={props.complianceReport.status}/></td>
        <td>
          {props.complianceReport.updateTimestamp ?
            moment(props.complianceReport.updateTimestamp).format('YYYY-MM-DD') : '-'}
        </td>
      </tr>,
      props.complianceReport.supplementalReports.map(sr => (
        <ComplianceReportRow tabDepth={props.tabDepth + 1} key={sr.id} complianceReport={sr}/>
      ))
    ]);
};

ComplianceReportRow.defaultProps = {
  tabDepth: 0
};

class ComplianceReportingTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: this.computeExpanded(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({expanded: this.computeExpanded(nextProps)});
  }

  computeExpanded(props) {
    let newExpanded = {};
    if (props.items) {
      for (let i = 0; i < props.items.length; i++) {
        //just expand everything
        newExpanded[i] = true;
      }
    }
    return newExpanded;
  }

  render() {
    const customDefaults = {
      ...ReactTableDefaults.column,
      Expander: (props) => {
        const rowId = props.original.id;
        const dataRow = this.props.items.find(i => (i.id === rowId));
        if (dataRow.supplementalReports.length === 0) {
          return null;
        }
        return (<FontAwesomeIcon icon="plus"/>);
      }

    };

    const columns = [{
      expander: true,
      show: false
    }, {
      accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
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
      accessor: item => (item.type),
      className: 'col-type',
      Header: 'Type',
      id: 'type',
      minWidth: 75
    }, {
      accessor: item => <ComplianceReportStatus status={item.status}/>,
      className: 'col-status',
      Header: 'Status',
      id: 'status',
      minWidth: 75
    }, {
      accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
      className: 'col-date',
      Header: 'Last Updated On',
      id: 'updateTimestamp',
      minWidth: 95
    }
    ];

    const filterMethod = (filter, row, column) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined ? String(row[id])
        .toLowerCase()
        .includes(filter.value.toLowerCase()) : true;
    };

    const findExpanded = (data) => {
      return data.map((row, i) => (
        {i: true}
      ));
    };

    const filterable = true;

    return (
      <ReactTable
        stateKey="compliance-reporting"
        className="searchable"
        columns={columns}
        data={this.props.items}
        expanded={this.state.expanded}
        onExpandedChange={(expanded, index, event) => {
          console.log('expanded changed');
          this.setState({expanded});
        }}
        defaultFilterMethod={filterMethod}
        defaultPageSize={10}
        defaultSorted={[{
          id: 'id',
          desc: true
        }]}
        loading={this.props.isFetching}
        filterable={filterable}
        column={customDefaults}

        getTrProps={(state, row) => {
          if (row && row.original) {
            return {
              onClick: (e) => {
                let viewUrl = COMPLIANCE_REPORTING.EDIT.replace(':id', row.original.id)
                  .replace(':tab', 'intro');

                if (row.original.type === 'Exclusion Report') {
                  viewUrl = EXCLUSION_REPORTS.EDIT.replace(':id', row.original.id)
                    .replace(':tab', 'intro');
                }

                history.push(viewUrl);
              },
              className: 'clickable'
            };
          }

        return {};
        }}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        SubComponent={row => {
          let ds = this.props.items.find(i => (i.id === row.original.id));
          if (ds.supplementalReports.length === 0) {
            return null;
          } else {
            return (
              <div className="subcomponentWrapper">
                <span className="subcomponentHeader">Supplemental Reports</span>
                <table className="supplementalTable">
                  <thead>
                  <tr>
                    <th>Display Name</th>
                    <th style={{width: '75px'}}>Status</th>
                    <th style={{width: '75px'}}>Last Updated On</th>
                  </tr>
                  </thead>
                  <tbody>
                  {ds.supplementalReports.map(sr => (
                    <ComplianceReportRow key={sr.id} complianceReport={sr}/>
                  ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
        }
      />
    );
  }
};

ComplianceReportingTable
  .defaultProps = {};

ComplianceReportingTable
  .propTypes = {
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
