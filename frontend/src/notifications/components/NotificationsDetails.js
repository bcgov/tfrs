/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import NotificationsTable from './NotificationsTable';

const NotificationsDetails = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>

    <NotificationsTable
      addToFields={props.addToFields}
      fields={props.fields}
      items={props.items}
      toggleCheck={props.toggleCheck}
    />
  </div>
);

NotificationsDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  changeReadStatus: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    notifications: PropTypes.array
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
  })).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default NotificationsDetails;
