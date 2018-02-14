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

import * as NumberFormat from '../../constants/numeralFormats';
import * as Routes from '../../constants/routes';

const CreditTransferTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    maxWidth: 35
  }, {
    id: 'creditsFrom',
    Header: 'From',
    accessor: item => item.creditsFrom.name,
    minWidth: 230,
    Cell: row => (
      <div>{row.value}</div>
    )
  }, {
    id: 'creditsTo',
    Header: 'To',
    accessor: item => item.creditsTo.name,
    Cell: row => (
      <div>{row.value}</div>
    )
  }, {
    id: 'numberOfCredits',
    Header: 'Credits',
    accessor: item => numeral(item.numberOfCredits).format(NumberFormat.INT)
  }, {
    id: 'fairMarketValuePerCredit',
    Header: 'Value Per Credit',
    accessor: item => numeral(item.fairMarketValuePerCredit).format(NumberFormat.DECIMAL)
  }, {
    id: 'totalvalue',
    Header: 'Total Amount',
    accessor: item => numeral(item.totalValue).format(NumberFormat.CURRENCY)
  }, {
    id: 'status',
    Header: 'Status',
    accessor: item => item.status.status,
    minWidth: 150
  }, {
    id: 'updateTimestamp',
    Header: 'Last Updated On',
    accessor: item => moment(item.updateTimestamp).format('LL'),
    minWidth: 150
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = `${Routes.CREDIT_TRANSACTIONS}/view/${row.value}`;
      return <Link to={viewUrl}><FontAwesomeIcon icon="eye" /></Link>;
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

CreditTransferTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CreditTransferTable;
