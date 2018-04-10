/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import numeral from 'numeral';

import * as NumberFormat from '../../../constants/numeralFormats';
import * as Routes from '../../../constants/routes';
import { CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../../constants/values';

const HistoricalDataTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id',
    maxWidth: 35,
    resizable: false
  }, {
    id: 'effectiveDate',
    Header: 'Effective Date',
    accessor: item => item.tradeEffectiveDate,
    className: 'col-effective-date'
  }, {
    id: 'transactionType',
    Header: 'Type',
    accessor: item => item.type.id,
    className: 'col-transfer-type',
    Cell: (row) => {
      let content = '';

      switch (row.value) {
        case CREDIT_TRANSFER_TYPES.validation.id:
          content = 'Validation';
          break;
        case CREDIT_TRANSFER_TYPES.retirement.id:
          content = 'Reduction';
          break;
        case CREDIT_TRANSFER_TYPES.part3Award.id:
          content = 'Part 3 Award';
          break;
        default:
          content = 'Credit Transfer';
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'creditsFrom',
    Header: 'Credits From',
    accessor: item => item.creditsFrom.name,
    minWidth: 200,
    Cell: (row) => {
      let content;

      if (row.original.type.id !== CREDIT_TRANSFER_TYPES.part3Award.id &&
        row.original.type.id !== CREDIT_TRANSFER_TYPES.validation.id) {
        content = row.value;
      } else {
        content = 'N/A';
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'creditsTo',
    Header: 'Credits To',
    accessor: item => item.creditsTo.name,
    minWidth: 200,
    Cell: (row) => {
      let content;

      if (row.original.type.id !== CREDIT_TRANSFER_TYPES.retirement.id) {
        content = row.value;
      } else {
        content = 'N/A';
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'numberOfCredits',
    Header: 'Credits',
    accessor: item => numeral(item.numberOfCredits).format(NumberFormat.INT),
    className: 'col-credits'
  }, {
    id: 'totalvalue',
    Header: 'Price',
    accessor: item => numeral(item.totalValue).format(NumberFormat.CURRENCY),
    className: 'col-price',
    Cell: (row) => {
      let content;

      if (row.original.type.id === CREDIT_TRANSFER_TYPES.buy.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.sell.id) {
        content = row.value;
      } else {
        content = 'N/A';
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'zeroReason',
    Header: 'Zero Reason',
    accessor: item => item.zeroReason,
    className: 'col-zero-reason',
    Cell: (row) => {
      const zeroReason = row.value;
      let content;

      if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.affiliate.id) {
        content = ZERO_DOLLAR_REASON.affiliate.description;
      } else if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.other.id) {
        content = ZERO_DOLLAR_REASON.other.description;
      }

      return (
        <div>{content}</div>
      );
    }
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    Cell: (row) => {
      const editUrl = `${Routes.HISTORICAL_DATA_ENTRY}/edit/${row.value}`;

      return (
        <div className="col-actions">
          <Link className="action" to={editUrl}><FontAwesomeIcon icon="edit" /></Link>
          <button className="action" data-toggle="modal" data-target="#confirmDelete" onClick={() => props.selectIdForModal(row.value)}><FontAwesomeIcon icon="trash" /></button>
        </div>
      );
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
      defaultPageSize={5}
      filterable={filterable}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

HistoricalDataTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectIdForModal: PropTypes.func.isRequired
};

export default HistoricalDataTable;
