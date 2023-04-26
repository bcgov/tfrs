/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { complianceReporting } from '../actions/complianceReporting'
import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions'
import { getDocumentUploads } from '../actions/documentUploads'
import { exclusionReports } from '../actions/exclusionReports'
import { getFuelCodes } from '../actions/fuelCodes'
import { getOrganization, getOrganizations } from '../actions/organizationActions'
import saveTableState from '../actions/stateSavingReactTableActions'
import DashboardPage from './components/DashboardPage'
import PERMISSIONS_COMPLIANCE_REPORT from '../constants/permissions/ComplianceReport'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../constants/permissions/CreditTransactions'
import PERMISSIONS_FUEL_CODES from '../constants/permissions/FuelCodes'
import PERMISSIONS_ORGANIZATIONS from '../constants/permissions/Organizations'
import PERMISSIONS_SECURE_DOCUMENT_UPLOAD from '../constants/permissions/SecureDocumentUpload'
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting'
import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports'
import CONFIG from '../config'
import toastr from '../utils/toastr'
import { withRouter } from '../utils/withRouter'

class DashboardContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      filterOrganization: -1,
      unreadNotificationsCount: 0
    }

    this._createComplianceReport = this._createComplianceReport.bind(this)
    this._createExclusionReport = this._createExclusionReport.bind(this)
    this._selectOrganization = this._selectOrganization.bind(this)
    this._selectedOrganization = this._selectedOrganization.bind(this)
    this._setFilter = this._setFilter.bind(this)
  }

  componentDidMount () {
    this._getComplianceReports()
    this._getCreditTransfers()
    this._getFileSubmissions()
    this._getUnreadNotificationCount()
    this._getFuelCodes()
    this._getOrganizations()
  }

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.unreadNotificationsCount) {
      this._getUnreadNotificationCount(nextProps)
    }

    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (nextProps.complianceReporting.success) {
        this.props.navigate(COMPLIANCE_REPORTING.EDIT
          .replace(':id', nextProps.complianceReporting.item.id)
          .replace(':tab', 'intro'))
        toastr.complianceReporting('Created')
      }
    }

    if (this.props.exclusionReports.isCreating && !nextProps.exclusionReports.isCreating) {
      if (nextProps.exclusionReports.success) {
        this.props.navigate(EXCLUSION_REPORTS.EDIT
          .replace(':id', nextProps.exclusionReports.item.id)
          .replace(':tab', 'intro'))
        toastr.exclusionReports('Created')
      }
    }
  }

  _createComplianceReport (compliancePeriodDescription) {
    const currentYear = new Date().getFullYear()

    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: currentYear
    }

    this.props.createComplianceReport(payload)
  }

  _createExclusionReport (compliancePeriodDescription) {
    const currentYear = new Date().getFullYear()

    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Exclusion Report',
      compliancePeriod: currentYear
    }

    this.props.createExclusionReport(payload)
  }

  _getComplianceReports () {
    if (CONFIG.COMPLIANCE_REPORTING.ENABLED &&
    typeof this.props.loggedInUser.hasPermission === 'function' &&
    this.props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW)) {
      this.props.getDashboardRequest()
      this.props.supplementalItems()
    }
  }

  _getCreditTransfers () {
    if (typeof this.props.loggedInUser.hasPermission === 'function' &&
      this.props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.VIEW)) {
      this.props.getCreditTransfersIfNeeded()
    }
  }

  _getFileSubmissions () {
    if (typeof this.props.loggedInUser.hasPermission === 'function' &&
      this.props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW)) {
      this.props.getDocumentUploads()
    }
  }

  _getFuelCodes () {
    if (typeof this.props.loggedInUser.hasPermission === 'function' &&
      this.props.loggedInUser.hasPermission(PERMISSIONS_FUEL_CODES.VIEW)) {
      this.props.getFuelCodes()
    }
  }

  _getOrganizations () {
    if (typeof this.props.loggedInUser.hasPermission === 'function' &&
      this.props.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.VIEW)) {
      this.props.getOrganizations()
    }
  }

  _getUnreadNotificationCount (nextProps = null) {
    let { unreadNotificationsCount } = this.state

    if (this.props.unreadNotificationsCount > 0) {
      ({ unreadNotificationsCount } = this.props)
    }

    if (nextProps && nextProps.unreadNotificationsCount > 0) {
      ({ unreadNotificationsCount } = nextProps)
    }

    this.setState({
      unreadNotificationsCount
    })
  }

  _selectedOrganization () {
    if (this.state.filterOrganization === -1) {
      return false
    }

    return this.props.organization
  }

  _selectOrganization (organizationId) {
    if (organizationId !== -1) {
      this.props.getOrganization(organizationId)
    }

    this.setState({
      filterOrganization: organizationId
    })
  }

  _setFilter (filtered, stateKey) {
    this.props.saveTableState(stateKey, {
      ...this.props.tableState,
      filtered,
      page: 0
    })
  }

  render () {
    return (
      <DashboardPage
        complianceReports={this.props.complianceReports}
        createComplianceReport={this._createComplianceReport}
        createExclusionReport={this._createExclusionReport}
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
    )
  }
}

DashboardContainer.defaultProps = {
  complianceReporting: {},
  exclusionReports: {},
  organization: null,
  unreadNotificationsCount: null
}

DashboardContainer.propTypes = {
  complianceReports: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFinding: PropTypes.bool
  }).isRequired,
  complianceReporting: PropTypes.shape({
    isCreating: PropTypes.bool,
    success: PropTypes.bool,
    item: PropTypes.shape({
      compliancePeriod: PropTypes.oneOfType([
        PropTypes.shape({
          description: PropTypes.string
        }),
        PropTypes.string
      ]),
      id: PropTypes.number
    })
  }),
  createComplianceReport: PropTypes.func.isRequired,
  createExclusionReport: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape().isRequired,
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  exclusionReports: PropTypes.shape({
    isCreating: PropTypes.bool,
    success: PropTypes.bool,
    item: PropTypes.shape({
      compliancePeriod: PropTypes.oneOfType([
        PropTypes.shape({
          description: PropTypes.string
        }),
        PropTypes.string
      ]),
      id: PropTypes.number
    })
  }),
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getDashboardRequest: PropTypes.func.isRequired,
  testData:PropTypes.func.isRequired,
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
  unreadNotificationsCount: PropTypes.number,
  navigate: PropTypes.func.isRequired
}

const mapDispatchToProps = ({
  createComplianceReport: complianceReporting.create,
  createExclusionReport: exclusionReports.create,
  getDashboardRequest: complianceReporting.getDashboard,
  supplementalItems:complianceReporting.getSupplemental,
  getCreditTransfersIfNeeded,
  getDocumentUploads,
  getFuelCodes,
  getOrganization,
  getOrganizations,
  saveTableState
})

const mapStateToProps = (state, ownProps) => ({
  complianceReports: state.rootReducer.complianceReporting,
  complianceReporting: {
    errorMessage: state.rootReducer.complianceReporting.errorMessage,
    isCreating: state.rootReducer.complianceReporting.isCreating,
    item: state.rootReducer.complianceReporting.item,
    success: state.rootReducer.complianceReporting.success
  },
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  documentUploads: {
    isFetching: state.rootReducer.documentUploads.isFetching,
    items: state.rootReducer.documentUploads.items
  },
  exclusionReports: {
    errorMessage: state.rootReducer.exclusionReports.errorMessage,
    isCreating: state.rootReducer.exclusionReports.isCreating,
    item: state.rootReducer.exclusionReports.item,
    success: state.rootReducer.exclusionReports.success
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
    ? state.rootReducer.tableState.savedState[ownProps.stateKey]
    : {
        page: 0,
        pageSize: ownProps.defaultPageSize,
        sorted: ownProps.defaultSorted,
        filtered: ownProps.defaultFiltered
      },
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((withRouter(DashboardContainer)))
