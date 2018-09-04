/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import NotificationsTable from './NotificationsTable';

const NotificationsDetails = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>

    <NotificationsTable items={props.items} />
  </div>
);

NotificationsDetails.propTypes = {
  changeReadStatus: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired
};

export default NotificationsDetails;
