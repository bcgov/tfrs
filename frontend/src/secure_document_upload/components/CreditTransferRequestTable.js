/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';

const CreditTransferRequestTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    accessor: item => (item.createUser.organization ? item.createUser.organization.name : ''),
    className: 'col-organization',
    Header: 'Organization',
    id: 'organization',
    minWidth: 100
  }, {
    accessor: item => (item.type ? item.type.theType : ''),
    className: 'col-attachment-type',
    Header: 'Attachment Type',
    id: 'attachment-type',
    minWidth: 100
  }, {
    accessor: item => (item.status ? item.status.status : ''),
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
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    minWidth: 75
  }, {
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="box-open" /></Link>;
    },
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

CreditTransferRequestTable.defaultProps = {
};

CreditTransferRequestTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    createUser: PropTypes.shape({
      organization: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    status: PropTypes.shape({
      status: PropTypes.string
    }),
    type: PropTypes.shape({
      id: PropTypes.integer
    })
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CreditTransferRequestTable;
