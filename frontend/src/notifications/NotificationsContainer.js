/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateNotifications } from '../actions/notificationActions';
import NotificationsDetails from './components/NotificationsDetails';
import Modal from '../app/components/Modal';

class NotificationsContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        notifications: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._selectIdForModal = this._selectIdForModal.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
    this._updateNotifications = this._updateNotifications.bind(this);
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    if (value &&
      fieldState.notifications.findIndex(notification => (notification.id === value.id)) < 0) {
      fieldState.notifications.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  _selectIdForModal (id) {
    this.setState({
      selectedId: id
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

  _updateNotification (id, value) {
    const data = {
      ids: [id],
      ...value
    };

    return this._updateNotificationsStatuses(data);
  }

  _updateNotifications (value) {
    const data = {
      ids: this.state.fields.notifications
        .filter(notification => (notification.value))
        .map(notification => notification.id),
      ...value
    };

    if (data.ids.length === 0) {
      return false;
    }

    return this._updateNotificationsStatuses(data);
  }

  _updateNotificationsStatuses (data) {
    return this.props.updateNotifications(data).then(() => {
      const fieldState = { // reset checkboxes to unchecked
        ...this.state.fields,
        notifications: this.state.fields.notifications.map(notification => ({
          ...notification,
          value: false
        }))
      };

      this.setState({
        fields: fieldState
      });
    });
  }

  render () {
    return ([
      <NotificationsDetails
        addToFields={this._addToFields}
        fields={this.state.fields}
        isFetching={this.props.isFetching}
        items={this.props.items}
        key="notification-details"
        selectIdForModal={this._selectIdForModal}
        toggleCheck={this._toggleCheck}
        updateNotifications={this._updateNotifications}
      />,
      <Modal
        handleSubmit={() => this._updateNotifications({ isArchived: true })}
        id="confirmArchive"
        key="modal"
        title="Confirm Archive"
      >
        Are you sure you want to archive the selected notifications?
      </Modal>,
      <Modal
        handleSubmit={() => this._updateNotification(this.state.selectedId, { isArchived: true })}
        id="confirmArchiveSingle"
        key="modal-single"
        title="Confirm Archive"
      >
        Are you sure you want to archive this notification?
      </Modal>
    ]);
  }
}

NotificationsContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFetching: PropTypes.bool.isRequired,
  updateNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.notifications.isFetching,
  items: state.rootReducer.notifications.items
});

const mapDispatchToProps = dispatch => ({
  updateNotifications: bindActionCreators(updateNotifications, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
