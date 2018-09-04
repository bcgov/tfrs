/*
 * Presentational component
 */
import React from 'react';
import NotificationsTable from './NotificationsTable';
import NOTIFICATIONS from '../../constants/notifications';

const NotificationsDetails = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>

    <NotificationsTable items={NOTIFICATIONS} />
  </div>
);

NotificationsDetails.propTypes = {
};

export default NotificationsDetails;
