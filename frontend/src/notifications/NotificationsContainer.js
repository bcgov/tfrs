/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeNotificationReadStatus } from '../actions/notificationActions';
import NotificationsDetails from './components/NotificationsDetails';

const NotificationsContainer = () => (
  <NotificationsDetails
    items={this.props.notifications}
    isFetching={this.props.isFetching}
    changeReadStatus={this.props.changeReadStatus}
  />
);

NotificationsContainer.propTypes = {
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.notificationsReducer.isFetching,
  notifications: state.rootReducer.notificationsReducer.notifications
});

const mapDispatchToProps = dispatch => ({
  changeReadStatus: bindActionCreators(changeNotificationReadStatus, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
