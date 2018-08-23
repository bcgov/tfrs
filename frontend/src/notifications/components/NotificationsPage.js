import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Button from 'react-bootstrap/es/Button';

const NotificationsPage = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>
    <ReactTable
      loading={props.isFetching}
      data={props.notifications}
      filterable
      columns={
        [
          { id: 'message', accessor: 'message', Header: 'Message' },
          { id: 'createTimestamp', accessor: 'createTimestamp', Header: 'Time' },
          { id: 'relatedCreditTrade', accessor: 'relatedCreditTrade', Header: 'Related Credit Trade' },
          { id: 'relatedOrganization', accessor: 'relatedOrganization', Header: 'Related Organization' },
          { id: 'relatedUser', accessor: 'relatedUser', Header: 'Related User' },
          {
            id: 'isRead', accessor: 'isRead', Header: 'Is Read?', Cell: row => (row.value ? 'True' : 'False')
          },
          {
            id: 'markRead',
            accessor: 'markRead',
            Header: 'Mark (Un)Read',
            Cell: cellInfo => (
              <Button type="button" onClick={() => props.changeReadStatus(cellInfo.original.id, !cellInfo.original.isRead)}>Mark {cellInfo.original.isRead ? 'Unread':'Read'}</Button>
            )
          }
        ]
      }
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
