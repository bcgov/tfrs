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

const CreditTransferTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id',
    className: 'col-id',
    resizable: false,
    width: 50
  }, {
    id: 'compliancePeriod',
    Header: 'Compliance Period',
    accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
    className: 'col-compliance-period',
    minWidth: 75
  }, {
    id: 'transactionType',
    Header: 'Type',
    accessor: item => getCreditTransferType(item.type.id),
    className: 'col-transfer-type',
    minWidth: 125
  }, {
    id: 'creditsFrom',
    Header: 'Credits From',
    accessor: item => item.creditsFrom.name,
    minWidth: 200,
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        row.original.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return (
          <div className="greyed-out">N/A</div>
        );
      }

      return row.value;
    }
  }, {
    id: 'creditsTo',
    Header: 'Credits To',
    accessor: item => item.creditsTo.name,
    minWidth: 200,
    Cell: (row) => {
      if (row.original.type.id === CREDIT_TRANSFER_TYPES.retirement.id) {
        return (
          <div className="greyed-out">N/A</div>
        );
      }

      return row.value;
    }
  }, {
    id: 'numberOfCredits',
    Header: 'Quantity of Credits',
    className: 'col-credits',
    accessor: item => item.numberOfCredits,
    minWidth: 100,
    Cell: row => numeral(row.value).format(NumberFormat.INT)
  }, {
    id: 'fairMarketValuePerCredit',
    Header: 'Value Per Credit',
    className: 'col-price',
    accessor: (item) => {
      if (item.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.retirement.id ||
        item.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
        return -1; // this is to fix sorting (value can't be negative)
      }

      return parseFloat(item.fairMarketValuePerCredit);
    },
    minWidth: 100,
    Cell: row => (
      (row.value === -1) ? '-' : numeral(row.value).format(NumberFormat.CURRENCY)
    )
  }, {
    id: 'status',
    Header: 'Status',
    accessor: item => ((item.status.id === CREDIT_TRANSFER_STATUS.completed.id)
      ? CREDIT_TRANSFER_STATUS.approved.description : item.status.status),
    className: 'col-status',
    minWidth: 100
  }, {
    id: 'updateTimestamp',
    Header: 'Last Updated On',
    className: 'col-date',
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('LL') : '-'),
    minWidth: 100
  }, {
    id: 'actions',
    Header: '',
    accessor: 'id',
    filterable: false,
    className: 'col-actions',
    minWidth: 50,
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

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
      defaultPageSize={15}
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
