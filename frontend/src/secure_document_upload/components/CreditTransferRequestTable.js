/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const CreditTransferRequestTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    className: 'col-organization',
    Header: 'Organization',
    id: 'organization',
    minWidth: 100
  }, {
    className: 'col-attachment-type',
    Header: 'Attachment Type',
    id: 'attachment-type',
    minWidth: 100
  }, {
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 50
  }, {
    className: 'col-category',
    Header: 'Category',
    id: 'category',
    minWidth: 100
  }, {
    className: 'col-credit-transaction-id',
    Header: 'Credit Transaction ID',
    id: 'credit-transaction-id',
    minWidth: 75
  }, {
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    minWidth: 75
  }, {
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    minWidth: 25
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
      className="searchable"
      data={props.items}
      defaultPageSize={10}
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

CreditTransferRequestTable.defaultProps = {
};

CreditTransferRequestTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CreditTransferRequestTable;
