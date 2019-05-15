/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import moment from 'moment';

import ReactTable from '../../app/components/StateSavingReactTable';

const ComplianceReportingTable = (props) => {
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
    className: 'col-type',
    Header: 'Type',
    id: 'type',
    minWidth: 75
  }, {
    accessor: item => (item.status.status),
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 75
  }, {
    accessor: (item) => {
      const historyFound = item.history.find(itemHistory => (itemHistory.status.status === 'Submitted'));

      if (historyFound) {
        return moment(historyFound.createTimestamp).format('YYYY-MM-DD');
      }

      return '-';
    },
    className: 'col-date',
    Header: 'Submitted On',
    id: 'updateTimestamp',
    minWidth: 65
  }];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;

  return (
    <ReactTable
      stateKey="compliance-reporting"
      className="searchable"
      columns={columns}
      data={props.items}
      defaultFilterMethod={filterMethod}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

ComplianceReportingTable.defaultProps = {};

ComplianceReportingTable.propTypes = {
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
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default ComplianceReportingTable;
