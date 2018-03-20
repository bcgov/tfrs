/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import numeral from 'numeral';

import * as NumberFormat from '../../../constants/numeralFormats';
import * as Routes from '../../../constants/routes';

const HistoricalDataTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id'
  }, {
    id: 'effectiveDate',
    Header: 'Effective Date',
    accessor: item => item.effectiveDate
  }, {
    id: 'transactionType',
    Header: 'Transaction Type',
    accessor: item => item.transactionType
  }, {
    id: 'creditsFrom',
    Header: 'Credits From',
    accessor: item => item.creditsFrom.name,
    minWidth: 230,
    Cell: row => (
      <div>{row.value}</div>
    )
  }, {
    id: 'creditsTo',
    Header: 'Credits To',
    accessor: item => item.creditsTo.name,
    Cell: row => (
      <div>{row.value}</div>
    )
  }, {
    id: 'numberOfCredits',
    Header: 'Credits',
    accessor: item => numeral(item.numberOfCredits).format(NumberFormat.INT)
  }, {
    id: 'totalvalue',
    Header: 'Price',
    accessor: item => numeral(item.totalValue).format(NumberFormat.CURRENCY)
  }, {
    id: 'zeroReason',
    Header: 'Zero Reason',
    accessor: item => item.zeroReason
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    Cell: (row) => {
      const editUrl = `${Routes.HISTORICAL_DATA_ENTRY}/edit/${row.value}`;
      return <span><Link to={editUrl}><FontAwesomeIcon icon="edit" /></Link>
      <a><FontAwesomeIcon icon="trash" /></a></span>;
    }
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
      defaultPageSize={25}
      filterable={filterable}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

HistoricalDataTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default HistoricalDataTable;
