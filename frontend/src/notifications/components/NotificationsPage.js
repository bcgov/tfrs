import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Button from 'react-bootstrap/es/Button';
import LocalTimestamp from '../../app/components/LocalTimestamp';

const ReadStyledCell = props => (
  <span className={`${props.read ? 'read' : 'unread'}`}>{props.children}</span>
);

const NotificationsPage = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>
    <ReactTable
      className="notification-table"
      loading={props.isFetching}
      data={props.notifications}
      filterable
      columns={
        [
          {
            id: 'markRead',
            accessor: 'markRead',
            Header: 'Mark',
            Cell: cellInfo => (
              <Button type="button" onClick={() => props.changeReadStatus(cellInfo.original.id, !cellInfo.original.isRead)}>Mark {cellInfo.original.isRead ? 'Unread' : 'Read'}</Button>
            ),
            maxWidth: 140
          },
          {
            id: 'message',
            accessor: 'message',
            Header: 'Message',
            minWidth: 200,
            Cell: cell => <ReadStyledCell read={cell.original.isRead} >{cell.value}</ReadStyledCell>
          },
          {
            id: 'createTimestamp',
            accessor: 'createTimestamp',
            Header: 'Time',
            Cell: cell => (<LocalTimestamp iso8601Date={cell.value} />)
          }
        ]
      }
      showPageJump={false}
    />
  </div>
);

NotificationsPage.defaultProps = {
};

NotificationsPage.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.string,
    isRead: PropTypes.bool,
    createTimestamp: PropTypes.string,
    isWarning: PropTypes.bool,
    isError: PropTypes.bool,
    relatedCreditTrade: PropTypes.number,
    relatedOrganization: PropTypes.number
  })).isRequired,
  isFetching: PropTypes.bool.isRequired,
  changeReadStatus: PropTypes.func.isRequired
};

export default NotificationsPage;
