/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toastr as reduxToastr } from 'react-redux-toastr'
import PropTypes from 'prop-types'

import getCompliancePeriods from '../actions/compliancePeriodsActions'
import { complianceReporting } from '../actions/complianceReporting'
import { exclusionReports } from '../actions/exclusionReports'
import CallableModal from '../app/components/CallableModal'
import ComplianceReportingPage from './components/ComplianceReportingPage'
import CONFIG from '../config'
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting'
import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports'
import toastr from '../utils/toastr'
import { withRouter } from '../utils/withRouter'
import { getOrganizations } from '../actions/organizationActions'

class ComplianceReportingContainer extends Component {
  constructor (props) {
    super(props)

    this.currentYear = new Date().getFullYear()

    this.state = {
      reportType: 'compliance',
      selectedComplianceYear: this.currentYear,
      showModal: false
    }

    this._selectComplianceReport = this._selectComplianceReport.bind(this)
    this._showModal = this._showModal.bind(this)
    this.createComplianceReport = this.createComplianceReport.bind(this)
    this.createExclusionReport = this.createExclusionReport.bind(this)
  }

  componentDidMount () {
    this.loadData()
  }

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (nextProps.complianceReporting.success) {
        this.props.navigate(COMPLIANCE_REPORTING.EDIT
          .replace(':id', nextProps.complianceReporting.item.id)
          .replace(':tab', 'intro'))
        toastr.complianceReporting('Created')
      } else {
        const errorMessage = nextProps.complianceReporting.errorMessage.length > 0
          ? nextProps.complianceReporting.errorMessage
          : 'Error saving'
        reduxToastr.error(errorMessage)
      }
    }

    if (this.props.exclusionReports.isCreating && !nextProps.exclusionReports.isCreating) {
      if (nextProps.exclusionReports.success) {
        this.props.navigate(EXCLUSION_REPORTS.EDIT
          .replace(':id', nextProps.exclusionReports.item.id)
          .replace(':tab', 'intro'))
        toastr.exclusionReports('Created')
      } else {
        const errorMessage = nextProps.exclusionReports.errorMessage.length > 0
          ? nextProps.exclusionReports.errorMessage
          : 'Error saving'
        reduxToastr.error(errorMessage)
      }
    }
  }

  _selectComplianceReport (reportType, complianceYear) {
    this.setState({
      reportType,
      selectedComplianceYear: complianceYear
    })
  }

  _showModal (bool) {
    this.setState({
      showModal: bool
    })
  }

  createComplianceReport (compliancePeriodDescription) {
    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: compliancePeriodDescription
    }

    this.props.createComplianceReport(payload)
  }

  createExclusionReport (compliancePeriodDescription) {
    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Exclusion Report',
      compliancePeriod: compliancePeriodDescription
    }

    this.props.createExclusionReport(payload)
  }

  loadData () {
    let filters = []
    if ('compliance-reporting' in this.props.savedState) {
      const { filtered } = this.props.savedState['compliance-reporting']
      filters = filtered
    }
    this.props.getOrganizations()
    this.props.getCompliancePeriods()
    this.props.getComplianceReports({ page: 1, pageSize: 10, filters, sorts: [] })
  }

  render () {
    const currentEffectiveDate = `${this.currentYear + 1}-01-01`

    return ([
      <ComplianceReportingPage
        compliancePeriods={this.props.compliancePeriods.filter(compliancePeriod =>
          compliancePeriod.effectiveDate <= currentEffectiveDate &&
          compliancePeriod.effectiveDate >= CONFIG.COMPLIANCE_REPORTING.CREATE_EFFECTIVE_DATE)
          .reverse()}
        complianceReports={{
          isFetching: this.props.complianceReports.isFindingPaginated,
          items: this.props.complianceReports.paginatedItems,
          itemsCount: this.props.complianceReports.totalCount
        }}
        getComplianceReports={this.props.getComplianceReports}
        createComplianceReport={this.createComplianceReport}
        createExclusionReport={this.createExclusionReport}
        key="compliance-reporting-list"
        loggedInUser={this.props.loggedInUser}
        selectComplianceReport={this._selectComplianceReport}
        showModal={this._showModal}
        title="Compliance Reporting"
        savedState={this.props.savedState}
        organizations={this.props.organizations}
      />,
      <CallableModal
        close={() => {
          this._showModal(false)
        }}
        handleSubmit={() => {
          if (this.state.reportType === 'exclusion') {
            this.createExclusionReport(this.state.selectedComplianceYear)
          } else {
            this.createComplianceReport(this.state.selectedComplianceYear)
          }
        }}
        id="confirmCreate"
        key="confirmCreate"
        show={this.state.showModal}
      >
        <p>
          Your organization has already submitted {this.state.reportType === 'exclusion' ? 'an ' : 'a ' }
          {this.state.reportType} report for the {this.state.selectedComplianceYear} compliance period.
          Are you trying to provide new or updated information to the
          Government of British Columbia?
        </p>
        <p>
          If yes, please create a supplemental report using the
          &quot;Create Supplemental Report&quot; button located within the existing report.
        </p>
        <p>
          If not, you can create another report for internal use but you will not be permitted
          to submit it to government. Do you want to create a new report?
        </p>
      </CallableModal>
    ])
  }
}

ComplianceReportingContainer.defaultProps = {
  complianceReporting: {},
  exclusionReports: {}
}

ComplianceReportingContainer.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  complianceReports: PropTypes.shape({
    paginatedItems: PropTypes.arrayOf(PropTypes.shape()),
    isFindingPaginated: PropTypes.bool,
    totalCount: PropTypes.number
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
    }),
    errorMessage: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
      PropTypes.shape()
    ])
  }),
  createComplianceReport: PropTypes.func.isRequired,
  createExclusionReport: PropTypes.func.isRequired,
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
    }),
    errorMessage: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
      PropTypes.shape()
    ])
  }),
  getCompliancePeriods: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  savedState: PropTypes.shape().isRequired,
  navigate: PropTypes.func.isRequired,
  organizations: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape({
      compliancePeriod: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired
}

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  complianceReports: state.rootReducer.complianceReporting,
  complianceReporting: {
    errorMessage: state.rootReducer.complianceReporting.errorMessage,
    isCreating: state.rootReducer.complianceReporting.isCreating,
    item: state.rootReducer.complianceReporting.item,
    success: state.rootReducer.complianceReporting.success
  },
  exclusionReports: {
    errorMessage: state.rootReducer.exclusionReports.errorMessage,
    isCreating: state.rootReducer.exclusionReports.isCreating,
    item: state.rootReducer.exclusionReports.item,
    success: state.rootReducer.exclusionReports.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  savedState: state.rootReducer.tableState.savedState,
  organizations: {
    items: state.rootReducer.organizations.items,
    isFetching: state.rootReducer.organizations.isFetching
  }
})

const mapDispatchToProps ={
  createComplianceReport: complianceReporting.create,
  createExclusionReport: exclusionReports.create,
  getCompliancePeriods,
  getComplianceReports: complianceReporting.findPaginated,
  getOrganizations
  }


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ComplianceReportingContainer))
