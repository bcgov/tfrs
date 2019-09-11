/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardPage from './components/DashboardPage';

class DashboardContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      unreadNotificationsCount: 0
    };
  }

  componentDidMount () {
    this._getUnreadNotificationCount();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.unreadNotificationsCount) {
      this._getUnreadNotificationCount(nextProps);
    }
  }

  _getUnreadNotificationCount (nextProps = null) {
    let { unreadNotificationsCount } = this.state;

    if (this.props.unreadNotificationsCount > 0) {
      ({ unreadNotificationsCount } = this.props);
    }

    if (nextProps && nextProps.unreadNotificationsCount > 0) {
      ({ unreadNotificationsCount } = nextProps);
    }

    this.setState({
      unreadNotificationsCount
    });
  }

  render () {
    return (
      <DashboardPage
        loggedInUser={this.props.loggedInUser}
        unreadNotificationsCount={this.state.unreadNotificationsCount}
      />
    );
  }
}

DashboardContainer.defaultProps = {
  unreadNotificationsCount: null
};

DashboardContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  unreadNotificationsCount: PropTypes.number
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((DashboardContainer));
