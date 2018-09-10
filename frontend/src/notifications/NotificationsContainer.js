/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateNotificationReadStatus } from '../actions/notificationActions';
import NotificationsDetails from './components/NotificationsDetails';

class NotificationsContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
  }

  render () {
    return (
      <NotificationsDetails
        items={this.props.items}
        isFetching={this.props.isFetching}
        changeReadStatus={this.props.updateNotificationReadStatus}
      />
    );
  }
}

NotificationsContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFetching: PropTypes.bool.isRequired,
  updateNotificationReadStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.notifications.isFetching,
  items: state.rootReducer.notifications.items
});

const mapDispatchToProps = dispatch => ({
  updateNotificationReadStatus: bindActionCreators(updateNotificationReadStatus, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
