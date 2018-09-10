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
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        notifications: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentWillMount () {
    this.loadData();
  }

  loadData () {
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    if (value) {
      fieldState.notifications.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.notifications.findIndex(notification => notification.id === key);
    fieldState.notifications[index].value = !fieldState.notifications[index].value;

    this.setState({
      fields: fieldState
    });
  }

  render () {
    return (
      <NotificationsDetails
        addToFields={this._addToFields}
        changeReadStatus={this.props.updateNotificationReadStatus}
        fields={this.state.fields}
        items={this.props.items}
        isFetching={this.props.isFetching}
        toggleCheck={this._toggleCheck}
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
