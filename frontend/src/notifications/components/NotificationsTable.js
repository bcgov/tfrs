/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

import CheckBox from '../../app/components/CheckBox';
import NOTIFICATION_TYPES from '../../constants/notificationTypes';

const NotificationsTable = (props) => {
  const columns = [{
    accessor: item => item.id,
    Cell: row => (
      <CheckBox
        addToFields={props.addToFields}
        fields={props.fields.notifications}
        id={row.value}
        toggleCheck={props.toggleCheck}
      />
    ),
    className: 'col-mark',
    filterable: false,
    Header: 'Mark',
    id: 'mark',
    width: 50
  }, {
    accessor: item => NOTIFICATION_TYPES[item.message],
    className: 'col-notification',
    Header: 'Notification',
    headerClassName: 'col-notification',
    id: 'notification'
  }, {
    accessor: item => (item.createTimestamp ? moment(item.createTimestamp).format('YYYY-MM-DD h:mm a') : '-'),
    className: 'col-date',
    Header: 'Date',
    headerClassName: 'col-date',
    id: 'date',
    width: 150
  }, {
    accessor: item => `${item.user.firstName} ${item.user.lastName}`,
    className: 'col-user',
    Header: 'User',
    headerClassName: 'col-user',
    id: 'user',
    width: 150
  }, {
    accessor: item => item.relatedCreditTrade,
    className: 'col-credit-trade',
    Header: 'Credit Trade',
    headerClassName: 'col-credit-trade',
    id: 'creditTrade',
    width: 100
  }, {
    accessor: item => item.relatedOrganization,
    className: 'col-organization',
    Header: 'Organization',
    headerClassName: 'col-organization',
    id: 'organization',
    width: 150
  }, {
    accessor: 'id',
    Cell: row => (
      <div className="col-actions">
        <FontAwesomeIcon
          data-toggle="modal"
          data-target="#confirmArchiveSingle"
          icon="folder-open"
          onClick={() => props.selectIdForModal(row.value)}
        />
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
      columns={columns}
      data={props.items}
      defaultPageSize={15}
      defaultSorted={[{
        id: 'date',
        desc: true
      }]}
      filterable={filterable}
      getTrProps={(state, rowInfo) => ({
        className: (rowInfo && rowInfo.original.isRead) ? 'read' : 'unread'
      })}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

NotificationsTable.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    notifications: PropTypes.array
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectIdForModal: PropTypes.func.isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default NotificationsTable;
