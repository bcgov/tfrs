/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import NotificationsPage from './components/NotificationsPage';
import {bindActionCreators} from "redux";
import {updateCreditTransfer} from "../actions/creditTransfersActions";
import getNotifications from "../actions/notificationActions";

class NotificationContainer extends Component {
  render () {
    return (
      <NotificationsPage
        notifications={this.props.notifications}
        isFetching={this.props.isFetching}
      />
    );
  }
}

NotificationContainer.defaultProps = {
};

NotificationContainer.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  notifications: state.rootReducer.notificationsReducer.notifications,
  isFetching: state.rootReducer.notificationsReducer.fetching
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);
