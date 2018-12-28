/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import ORGANIZATION_STATUSES from '../../constants/organizationStatuses';

const OrganizationsTable = (props) => {
  const columns = [{
    accessor: item => item.name,
    className: 'col-name',
    Header: 'Company Name',
    id: 'name',
    minWidth: 200,
    Cell: (row) => {
      const viewUrl = ORGANIZATIONS.DETAILS.replace(':id', row.original.id);

      return <Link to={viewUrl}>{row.value}</Link>;
    }
  }, {
    accessor: item => item.organizationBalance.validatedCredits,
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    className: 'col-credit-balance',
    Header: 'Credit Balance',
    id: 'creditBalance',
    minWidth: 100
  }, {
    accessor: item => Object.values(ORGANIZATION_STATUSES)
      .find(element => element.id === item.status).description,
    className: 'col-status-display',
    Header: 'Status',
    id: 'status',
    minWidth: 50
  }, {
    accessor: item => item.actionsTypeDisplay,
    className: 'col-actions-type-display',
    Header: 'Actions',
    id: 'actions',
    minWidth: 75
  }, {
    accessor: item => item.organizationBalance.creditTradeId,
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}>{row.value}</Link>;
    },
    className: 'col-last-transaction',
    Header: 'Last Transaction',
    id: 'lastTransaction',
    minWidth: 75
  }, {
    className: 'col-actions',
    filterable: false,
    id: 'actions',
    width: 50
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
      className="searchable"
      data={props.items}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'name',
        desc: false
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

OrganizationsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default OrganizationsTable;
