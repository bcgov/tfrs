/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import SettingsDetails from './components/SettingsDetails';
import { getSubscriptions, updateSubscriptions } from '../actions/notificationActions';
import toastr from '../utils/toastr';

class SettingsContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        settings: {
          notifications: []
        }
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._getSubscription = this._getSubscription.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getSubscriptions();
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    const found = fieldState.settings.notifications.find(state => (
      state.id === value.id && state.type === value.type && state.field === value.field));

    if (!found) {
      fieldState.settings.notifications.push({
        id: value.id,
        field: value.field,
        type: value.type,
        value: this._getSubscription(value.field.toUpperCase(), value.id)
      });
    }

    this.setState({
      fields: fieldState
    });
  }

  _getSubscription (channel, code) {
    const subscriptionStatus = this.props.subscriptions.items.find(subscription => (
      subscription.channel === channel && subscription.notificationType === code
    ));

    if (subscriptionStatus) {
      return subscriptionStatus.subscribed;
    }

    return false;
  }

  _handleSubmit (event) {
    event.preventDefault();

    const data = [];

    this.state.fields.settings.notifications.forEach((notification) => {
      data.push({
        notificationType: notification.id,
        channel: String(notification.field).toUpperCase(),
        subscribed: notification.value
      });
    });

    this.props.updateSubscriptions(data).then(() => {
      toastr.subscriptionsSuccess();
    });

    return false;
  }

  _toggleCheck (id, fields) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.settings.notifications.findIndex(state => (
      state.id === id && state.type === fields.type && state.field === fields.field));

    fieldState.settings.notifications[index].value =
        !fieldState.settings.notifications[index].value;

    this.setState({
      fields: fieldState
    });
  }

  render () {
    return (
      <SettingsDetails
        addToFields={this._addToFields}
        fields={this.state.fields}
        handleSubmit={this._handleSubmit}
        loggedInUser={this.props.loggedInUser}
        subscriptions={this.props.subscriptions}
        toggleCheck={this._toggleCheck}
      />
    );
  }
}

SettingsContainer.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({}).isRequired,
  subscriptions: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape()),
    success: PropTypes.bool
  }).isRequired,
  updateSubscriptions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  subscriptions: {
    isFetching: state.rootReducer.subscriptions.isFetching,
    items: state.rootReducer.subscriptions.items,
    success: state.rootReducer.subscriptions.success
  }
});

const mapDispatchToProps = dispatch => ({
  getSubscriptions: bindActionCreators(getSubscriptions, dispatch),
  updateSubscriptions: bindActionCreators(updateSubscriptions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
