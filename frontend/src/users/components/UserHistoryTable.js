/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { getCreditTransferType } from '../../actions/creditTransfersActions';
import history from '../../app/History';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

const UserHistoryTable = (props) => {
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
    show: false,
    width: 50
  }, {
    accessor: item => (item.isRescinded
      ? CREDIT_TRANSFER_STATUS.rescinded.description
      : (
        Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.statusId)
      ).description),
    className: 'col-action',
    Header: 'Action Taken',
    id: 'action',
    minWidth: 75
  }, {
    accessor: item => getCreditTransferType(item.type.id),
    className: 'col-type',
    Header: 'Transaction Type',
    id: 'creditType',
    width: 150
  }, {
    accessor: item => item.creditTradeId,
    className: 'col-id',
    Header: 'Transaction ID',
    id: 'creditTradeId',
    resizable: false,
    width: 100
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
  }, {
    accessor: item => item.fuelSupplier.name,
    Header: 'Fuel Supplier',
    id: 'fuelSupplier',
    minWidth: 100
  }, {
    accessor: item => item.creditTradeId,
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="box-open" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    width: 30
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
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.original.creditTradeId);
              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  );
};

UserHistoryTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default UserHistoryTable;
