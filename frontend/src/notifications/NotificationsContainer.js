/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  getNotifications,
  mountNotificationsTable,
  unmountNotificationsTable,
  updateNotifications
} from '../actions/notificationActions';
import NotificationsDetails from './components/NotificationsDetails';
import Modal from '../app/components/Modal';

class NotificationsContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        notifications: []
      },
      page: 1,
      pageSize: 10,
      filters: [],
      refreshCounter: 0
    };

    this._selectIdForModal = this._selectIdForModal.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
    this._updateNotification = this._updateNotification.bind(this);
    this._updateNotifications = this._updateNotifications.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidMount () {
    this.props.getNotifications(this.state.page, this.state.pageSize, this.state.filters);
    this.props.autoloadNotificationsEnable();
  }

  componentWillUnmount () {
    this.props.autoloadNotificationsDisable();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.page !== prevState.page || this.state.pageSize !== prevState.pageSize || this.state.filters !== prevState.filters || this.state.refreshCounter !== prevState.refreshCounter) {
      this.props.getNotifications(this.state.page, this.state.pageSize, this.state.filters);
    }
  }

  _selectIdForModal (id) {
    this.setState({
      selectedId: id
    });
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.notifications.findIndex(notification => notification.id === key);

    if (index < 0) {
      fieldState.notifications.push({
        id: key,
        value: true
      });
    } else {
      fieldState.notifications[index].value = !fieldState.notifications[index].value;
    }

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
    return this.props.updateNotifications(data).then((response) => {
      this.setState((prevState) => {
        let numberOfDeletedNotifications = 0;
        let newPage = prevState.page;
        if (data.isArchived && response.data) {
          numberOfDeletedNotifications = response.data.length;
          const newCount = this.props.totalCount - numberOfDeletedNotifications;
          const lastPage = newCount <= 0 ? 1 : Math.ceil(newCount / prevState.pageSize);
          if (prevState.page > lastPage) {
            newPage = 1;
          }
        }
        return {
          fields: {
            notifications: []
          },
          page: newPage,
          refreshCounter: prevState.refreshCounter + 1
        }
      });
    });
  }

  handlePageChange (page) {
    this.setState({page: page});
  }

  handlePageSizeChange (pageSize) {
    this.setState({pageSize: pageSize});
  }

  handleFiltersChange (filters) {
    this.setState({filters: filters});
  }

  render () {
    return ([
      <NotificationsDetails
        fields={this.state.fields}
        isFetching={this.props.isFetching}
        items={this.props.items}
        key="notification-details"
        selectIdForModal={this._selectIdForModal}
        toggleCheck={this._toggleCheck}
        updateNotification={this._updateNotification}
        updateNotifications={this._updateNotifications}
        notificationsCount={this.props.totalCount}
        page={this.state.page}
        pageSize={this.state.pageSize}
        filters={this.state.filters}
        handlePageChange={this.handlePageChange}
        handlePageSizeChange={this.handlePageSizeChange}
        handleFiltersChange={this.handleFiltersChange}
      />,
      <Modal
        handleSubmit={() => this._updateNotifications({ isArchived: true })}
        id="confirmArchive"
        key="modal"
        title="Confirm Delete"
      >
        Are you sure you want to delete the selected notifications?
      </Modal>,
      <Modal
        handleSubmit={() => this._updateNotification(this.state.selectedId, { isArchived: true })}
        id="confirmArchiveSingle"
        key="modal-single"
        title="Confirm Delete"
      >
        Are you sure you want to delete this notification?
      </Modal>,
      <Modal
        handleSubmit={() => this._updateNotifications({ ids: 'all', isRead: true })}
        id="confirmReadAll"
        key="modal-read-all"
        title="Confirm Mark all as Read"
      >
        Are you sure you want to mark all as read?
      </Modal>
    ]);
  }
}

NotificationsContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFetching: PropTypes.bool.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  getNotifications: PropTypes.func.isRequired,
  autoloadNotificationsEnable: PropTypes.func.isRequired,
  autoloadNotificationsDisable: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.notifications.isFetching,
  items: state.rootReducer.notifications.items,
  totalCount: state.rootReducer.notifications.totalCount
});

const mapDispatchToProps = dispatch => ({
  updateNotifications: bindActionCreators(updateNotifications, dispatch),
  getNotifications: bindActionCreators(getNotifications, dispatch),
  autoloadNotificationsEnable: bindActionCreators(mountNotificationsTable, dispatch),
  autoloadNotificationsDisable: bindActionCreators(unmountNotificationsTable, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
