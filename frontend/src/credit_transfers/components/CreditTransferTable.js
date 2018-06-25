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
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values';
import { getCreditTransferType } from '../../actions/creditTransfersActions';
import filterNumber from '../../utils/filters';

const CreditTransferTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 50
  }, {
    accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
    className: 'col-compliance-period',
    Header: 'Compliance Period',
    id: 'compliancePeriod',
    minWidth: 75
  }, {
    accessor: item => getCreditTransferType(item.type.id),
    className: 'col-transfer-type',
    Header: 'Type',
    id: 'transactionType',
    minWidth: 125
  }, {
    accessor: item => ([
      CREDIT_TRANSFER_TYPES.part3Award.id, CREDIT_TRANSFER_TYPES.validation.id
    ].includes(item.type.id) ? '' : item.creditsFrom.name),
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return (
          <div className="greyed-out">N/A</div>
        );
      }

      return row.value;
    },
    Header: 'Credits From',
    id: 'creditsFrom',
    minWidth: 200
  }, {
    accessor: item => ((item.type.id === CREDIT_TRANSFER_TYPES.retirement.id) ? '' : item.creditsTo.name),
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.retirement.id) {
        return (
          <div className="greyed-out">N/A</div>
        );
      }

      return row.value;
    },
    Header: 'Credits To',
    id: 'creditsTo',
    minWidth: 200
  }, {
    accessor: item => item.numberOfCredits,
    className: 'col-credits',
    Cell: row => numeral(row.value).format(NumberFormat.INT),
    filterMethod: (filter, row) => filterNumber(filter.value, row.numberOfCredits, 0),
    Header: 'Quantity of Credits',
    id: 'numberOfCredits',
    minWidth: 100
  }, {
    accessor: (item) => {
      if (item.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.retirement.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return -1; // this is to fix sorting (value can't be negative)
      }

      return parseFloat(item.fairMarketValuePerCredit);
    },
    Cell: row => (
      (row.value === -1) ? '-' : numeral(row.value).format(NumberFormat.CURRENCY)
    ),
    className: 'col-price',
    filterMethod: (filter, row) => filterNumber(filter.value, row.fairMarketValuePerCredit),
    Header: 'Value Per Credit',
    id: 'fairMarketValuePerCredit',
    minWidth: 100
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
        Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
      ).description),
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 100
  }, {
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('LL') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    minWidth: 100
  }, {
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="eye" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    minWidth: 50
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
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
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
