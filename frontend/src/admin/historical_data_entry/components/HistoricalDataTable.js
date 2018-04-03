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
import { ZERO_DOLLAR_REASON } from '../../../constants/values';

const HistoricalDataTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id'
  }, {
    id: 'effectiveDate',
    Header: 'Effective Date',
    accessor: item => item.tradeEffectiveDate,
    className: 'col-effective-date'
  }, {
    id: 'transactionType',
    Header: 'Transaction Type',
    accessor: item => item.type.theType,
    className: 'col-transfer-type'
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
    accessor: item => numeral(item.numberOfCredits).format(NumberFormat.INT),
    className: 'col-credits'
  }, {
    id: 'totalvalue',
    Header: 'Price',
    accessor: item => numeral(item.totalValue).format(NumberFormat.CURRENCY),
    className: 'col-price'
  }, {
    id: 'zeroReason',
    Header: 'Zero Reason',
    accessor: item => item.zeroReason,
    Cell: (row) => {
      const zeroReason = row.value;
      let value;

      if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.affiliate.id) {
        value = ZERO_DOLLAR_REASON.affiliate.description;
      } else if (zeroReason && zeroReason.id === ZERO_DOLLAR_REASON.other.id) {
        value = ZERO_DOLLAR_REASON.other.description;
      }

      return (
        <div>{value}</div>
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
      defaultPageSize={10}
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
