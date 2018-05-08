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

const OrganizationsTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 35
  }, {
    accessor: item => item.name,
    className: 'col-name',
    Header: 'Company Name',
    id: 'name',
    minWidth: 200
  }, {
    accessor: item => item.organizationBalance.validatedCredits,
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    className: 'col-credit-balance',
    Header: 'Credit Balance',
    id: 'creditBalance',
    minWidth: 100
  }, {
    accessor: item => item.statusDisplay,
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
    accessor: null,
    Header: 'Pending Actions',
    id: 'pendingActions',
    minWidth: 75
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
      data={props.items}
      defaultPageSize={15}
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
