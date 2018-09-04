/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import SettingsDetails from './components/SettingsDetails';
import CREDIT_TRANSFER_NOTIFICATIONS from '../constants/settings/notificationsCreditTransfers';
import GOVERNMENT_TRANSFER_NOTIFICATIONS from '../constants/settings/notificationsGovernmentTransfers';
import { getSubscriptions } from '../actions/notificationActions';

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
        value: value.value
      });
    }

    this.setState({
      fields: fieldState
    });
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    const data = [];

    this.state.fields.settings.notifications.forEach((notification) => {
      let notificationCodes;
      if (notification.type === 'credit-transfer') {
        notificationCodes = CREDIT_TRANSFER_NOTIFICATIONS;
      } else {
        notificationCodes = GOVERNMENT_TRANSFER_NOTIFICATIONS;
      }

      const notificationType = notificationCodes.find(notificationCode =>
        (notificationCode.key === notification.id)).code;

      data.push({
        notificationType,
        channel: String(notification.field).toUpperCase(),
        subscribed: notification.value
      });
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
        toggleCheck={this._toggleCheck}
      />
    );
  }
}

SettingsContainer.propTypes = {
  getSubscriptions: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getSubscriptions: bindActionCreators(getSubscriptions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
