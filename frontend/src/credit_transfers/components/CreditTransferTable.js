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
import { CREDIT_TRANSFER_TYPES } from '../../constants/values';

const CreditTransferTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id',
    resizable: false,
    width: 35
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
    id: 'transactionType',
    Header: 'Transaction Type',
    accessor: item => item.type.id,
    className: 'col-transfer-type',
    Cell: (row) => {
      let value = '';

      switch (row.value) {
        case CREDIT_TRANSFER_TYPES.validation.id:
          value = 'Validation';
          break;
        case CREDIT_TRANSFER_TYPES.retirement.id:
          value = 'Reduction';
          break;
        case CREDIT_TRANSFER_TYPES.part3Award.id:
          value = 'Part 3 Award';
          break;
        default:
          value = 'Credit Transfer';
      }

      return (
        <div>{value}</div>
      );
    }
  }, {
    id: 'numberOfCredits',
    Header: 'Quantity of Credits',
    className: 'col-credits',
    accessor: item => numeral(item.numberOfCredits).format(NumberFormat.INT)
  }, {
    id: 'fairMarketValuePerCredit',
    Header: 'Value Per Credit',
    className: 'col-price',
    accessor: item => numeral(item.fairMarketValuePerCredit).format(NumberFormat.CURRENCY),
    Cell: (row) => {
      const creditTrade = row.row;
      let content = '';

      if (creditTrade.transactionType === CREDIT_TRANSFER_TYPES.buy.id ||
         creditTrade.transactionType === CREDIT_TRANSFER_TYPES.sell.id) {
        content = row.value;
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'status',
    Header: 'Status',
    accessor: item => item.status.status,
    minWidth: 150
  }, {
    id: 'updateTimestamp',
    Header: 'Last Updated On',
    className: 'col-date',
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
