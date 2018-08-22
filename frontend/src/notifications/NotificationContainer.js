/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import NotificationsPage from './components/NotificationsPage';

class NotificationContainer extends Component {
  componentWillMount () {
  }

  render () {
    return (
      <NotificationsPage
        lastMessage={this.props.lastMessage}
        messages={this.props.messages}
      />
    );
  }
}

NotificationContainer.defaultProps = {
  lastMessage: null
};

NotificationContainer.propTypes = {
  lastMessage: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = state => ({
  lastMessage: state.rootReducer.notificationsReducer.lastMessage,
  messages: state.rootReducer.notificationsReducer.messages
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);
