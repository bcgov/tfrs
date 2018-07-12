/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import CREDIT_TRANSACTIONS from '../../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../../constants/values';

const CreditTradeHistoryTable = (props) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });

  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    show: false
  }, {
    accessor: item => `${item.user.firstName} ${item.user.lastName}`,
    className: 'col-user',
    Header: 'User',
    id: 'user',
    minWidth: 50
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
        Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
      ).description),
    className: 'col-action',
    Header: 'Action Taken',
    id: 'action',
    minWidth: 50
  }, {
    accessor: item => item.creditTrade.id,
    className: 'col-id',
    Header: 'Transaction ID',
    id: 'creditTradeId',
    resizable: false,
    width: 100
  }, {
    accessor: item => item.creditTrade.id,
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="eye" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    width: 30
  }, {
    accessor: item => item.creditTrade.initiator.name,
    className: 'col-initiator',
    Header: 'Initiator',
    id: 'initiator',
    minWidth: 100
  }, {
    accessor: item => item.creditTrade.respondent.name,
    className: 'col-respondent',
    Header: 'Respondent',
    id: 'respondent',
    minWidth: 100
  }, {
    accessor: (item) => {
      if (item.creditTradeUpdateTime) {
        const ts = Date.parse(item.creditTradeUpdateTime);

        return formatter.format(ts);
      }

      return '-';
    },
    className: 'col-timestamp',
    Header: 'Timestamp',
    id: 'updateTimestamp',
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
      defaultSorted={[{
        id: 'updateTimestamp',
        desc: true
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

CreditTradeHistoryTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default CreditTradeHistoryTable;
