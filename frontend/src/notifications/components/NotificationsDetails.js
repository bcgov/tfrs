/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import NotificationsTable from './NotificationsTable';

const NotificationsDetails = props => (
  <div className="page_notifications">
    <div className="actions-container">
      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={() => props.changeReadStatus('read')}
          type="button"
        >
          <FontAwesomeIcon icon={['far', 'check-square']} /> Mark as Read
        </button>
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="caret" />
          <span className="sr-only">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <button type="button">
              <FontAwesomeIcon icon={['far', 'square']} /> Mark as Unread
            </button>
          </li>
          <li>
            <button type="button">
              <FontAwesomeIcon icon="folder-open" /> Archive
            </button>
          </li>
        </ul>
      </div>
    </div>

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
