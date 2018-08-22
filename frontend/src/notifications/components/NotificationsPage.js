import React from 'react';
import PropTypes from 'prop-types';

const NotificationsPage = props => (
  <div className="page_notifications">
    <h1>Notifications</h1>
    <span>last message: <strong>{props.lastMessage}</strong></span>
    <ul>
      {props.messages.map( (message, i) => {
        return (<li key={i}>{message}</li>);
      })}
    </ul>
  </div>
);

NotificationsPage.defaultProps = {
  lastMessage: ''
};

NotificationsPage.propTypes = {
  lastMessage: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default NotificationsPage;
