/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { complianceReporting } from '../actions/complianceReporting';
import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions';
import { getDocumentUploads } from '../actions/documentUploads';
import { getFuelCodes } from '../actions/fuelCodes';
import { getOrganization, getOrganizations } from '../actions/organizationActions';
import saveTableState from '../actions/stateSavingReactTableActions';
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
    this._setFilter = this._setFilter.bind(this);
  }

  componentDidMount () {
    this._getComplianceReports();
    this._getCreditTransfers();
    this._getFileSubmissions();
    this._getUnreadNotificationCount();

    if (this.props.loggedInUser.isGovernmentUser) {
      this._getFuelCodes();
      this._getOrganizations();
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.unreadNotificationsCount) {
      this._getUnreadNotificationCount(nextProps);
    }
  }

  _getComplianceReports () {
    this.props.getComplianceReports();
  }

  _getCreditTransfers () {
    this.props.getCreditTransfersIfNeeded();
  }

  _getFileSubmissions () {
    this.props.getDocumentUploads();
  }

  _getFuelCodes () {
    this.props.getFuelCodes();
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

  _setFilter (filtered, stateKey) {
    this.props.saveTableState(stateKey, {
      ...this.props.tableState,
      filtered,
      page: 0
    });
  }

  render () {
    return (
      <DashboardPage
        complianceReports={this.props.complianceReports}
        creditTransfers={this.props.creditTransfers}
        documentUploads={this.props.documentUploads}
        fuelCodes={this.props.fuelCodes}
        loggedInUser={this.props.loggedInUser}
        organization={this._selectedOrganization()}
        organizations={this.props.organizations.items}
        selectOrganization={this._selectOrganization}
        setFilter={this._setFilter}
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
  complianceReports: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFinding: PropTypes.bool
  }).isRequired,
  creditTransfers: PropTypes.shape().isRequired,
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  getCreditTransfersIfNeeded: PropTypes.func.isRequired,
  getDocumentUploads: PropTypes.func.isRequired,
  getFuelCodes: PropTypes.func.isRequired,
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
  saveTableState: PropTypes.func.isRequired,
  tableState: PropTypes.shape().isRequired,
  unreadNotificationsCount: PropTypes.number
};

const mapDispatchToProps = ({
  getComplianceReports: complianceReporting.find,
  getCreditTransfersIfNeeded,
  getDocumentUploads,
  getFuelCodes,
  getOrganization,
  getOrganizations,
  saveTableState
});

const mapStateToProps = (state, ownProps) => ({
  complianceReports: state.rootReducer.complianceReporting,
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  documentUploads: {
    isFetching: state.rootReducer.documentUploads.isFetching,
    items: state.rootReducer.documentUploads.items
  },
  fuelCodes: {
    isFetching: state.rootReducer.fuelCodes.isFetching,
    items: state.rootReducer.fuelCodes.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  organization: state.rootReducer.organizationRequest.fuelSupplier,
  organizations: {
    items: state.rootReducer.organizations.items,
    isFetching: state.rootReducer.organizations.isFetching
  },
  tableState: ownProps.stateKey in state.rootReducer.tableState.savedState
    ? state.rootReducer.tableState.savedState[ownProps.stateKey] : {
      page: 0,
      pageSize: ownProps.defaultPageSize,
      sorted: ownProps.defaultSorted,
      filtered: ownProps.defaultFiltered
    },
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((DashboardContainer));
