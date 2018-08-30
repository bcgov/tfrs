/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/fontawesome-free-regular';

const NotificationsTable = (props) => {
  const columns = [{
    accessor: item => item.id,
    Cell: row => (
      <FontAwesomeIcon icon={faSquare} />
    ),
    className: 'col-mark',
    Header: 'Mark',
    id: 'mark',
    width: 50
  }, {
    accessor: item => item.notification,
    className: 'col-notification',
    Header: 'Notification',
    headerClassName: 'col-notification',
    id: 'notification'
  }, {
    accessor: item => item.date,
    className: 'col-date',
    Header: 'Date',
    headerClassName: 'col-date',
    id: 'date'
  }, {
    accessor: item => item.user,
    className: 'col-user',
    Header: 'User',
    headerClassName: 'col-user',
    id: 'user'
  }, {
    accessor: item => item.creditTrade,
    className: 'col-credit-trade',
    Header: 'Credit Trade',
    headerClassName: 'col-credit-trade',
    id: 'creditTrade'
  }, {
    accessor: item => item.organization,
    className: 'col-organization',
    Header: 'Organization',
    headerClassName: 'col-organization',
    id: 'organization'
  }, {
    accessor: 'id',
    Cell: row => (
      <div className="col-actions">
        <FontAwesomeIcon icon="folder-open" />
      </div>
    ),
    filterable: false,
    Header: '',
    id: 'actions',
    width: 50
  }];

  const filterable = true;

  return (
    <ReactTable
      data={props.items}
      defaultPageSize={5}
      defaultSorted={[{
        id: 'date',
        desc: true
      }]}
      filterable={filterable}
      columns={columns}
    />
  );
};

NotificationsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default NotificationsTable;
