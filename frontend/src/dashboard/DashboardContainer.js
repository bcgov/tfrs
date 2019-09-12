/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions';
import { getOrganization, getOrganizations } from '../actions/organizationActions';
import DashboardPage from './components/DashboardPage';

class DashboardContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      filterOrganization: -1,
      unreadNotificationsCount: 0
    };

    this._selectOrganization = this._selectOrganization.bind(this);
    this._selectedOrganization = this._selectedOrganization.bind(this);
  }

  componentDidMount () {
    this._getCreditTransfers();
    this._getOrganizations();
    this._getUnreadNotificationCount();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.unreadNotificationsCount) {
      this._getUnreadNotificationCount(nextProps);
    }
  }

  _getCreditTransfers () {
    this.props.getCreditTransfersIfNeeded();
  }

  _getOrganizations () {
    this.props.getOrganizations();
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

  _selectedOrganization () {
    if (this.state.filterOrganization === -1) {
      return false;
    }

    return this.props.organization;
  }

  _selectOrganization (organizationId) {
    if (organizationId !== -1) {
      this.props.getOrganization(organizationId);
    }

    this.setState({
      filterOrganization: organizationId
    });
  }

  render () {
    return (
      <DashboardPage
        creditTransfers={this.props.creditTransfers}
        loggedInUser={this.props.loggedInUser}
        organization={this._selectedOrganization()}
        organizations={this.props.organizations.items}
        selectOrganization={this._selectOrganization}
        unreadNotificationsCount={this.state.unreadNotificationsCount}
      />
    );
  }
}

DashboardContainer.defaultProps = {
  organization: null,
  unreadNotificationsCount: null
};

DashboardContainer.propTypes = {
  creditTransfers: PropTypes.shape().isRequired,
  getCreditTransfersIfNeeded: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  getOrganizations: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  organization: PropTypes.shape({
    name: PropTypes.string,
    organizationBalance: PropTypes.shape({
      validatedCredits: PropTypes.number
    })
  }),
  organizations: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  unreadNotificationsCount: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  getCreditTransfersIfNeeded: () => {
    dispatch(getCreditTransfersIfNeeded());
  },
  getOrganization: bindActionCreators(getOrganization, dispatch),
  getOrganizations: () => { dispatch(getOrganizations()); }
});

const mapStateToProps = state => ({
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  organization: state.rootReducer.organizationRequest.fuelSupplier,
  organizations: {
    items: state.rootReducer.organizations.items,
    isFetching: state.rootReducer.organizations.isFetching
  },
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((DashboardContainer));
