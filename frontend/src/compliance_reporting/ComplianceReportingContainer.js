/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr as reduxToastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import { complianceReporting } from '../actions/complianceReporting';
import { exclusionReports } from '../actions/exclusionReports';
import history from '../app/History';
import ComplianceReportingPage from './components/ComplianceReportingPage';
import CONFIG from '../config';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports';
import toastr from '../utils/toastr';

class ComplianceReportingContainer extends Component {
  constructor (props) {
    super(props);

    this.createComplianceReport = this.createComplianceReport.bind(this);
    this.createExclusionReport = this.createExclusionReport.bind(this);
  }

  componentDidMount () {
    this.loadData();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (nextProps.complianceReporting.success) {
        history.push(COMPLIANCE_REPORTING.EDIT
          .replace(':id', nextProps.complianceReporting.item.id)
          .replace(':tab', 'intro'));
        toastr.complianceReporting('Created');
      } else {
        reduxToastr.error('Error saving');
      }
    }

    if (this.props.exclusionReports.isCreating && !nextProps.exclusionReports.isCreating) {
      if (nextProps.exclusionReports.success) {
        history.push(EXCLUSION_REPORTS.EDIT
          .replace(':id', nextProps.exclusionReports.item.id)
          .replace(':tab', 'intro'));
        toastr.exclusionReports('Created');
      } else {
        reduxToastr.error('Error saving');
      }
    }
  }

  createComplianceReport (compliancePeriodDescription) {
    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: compliancePeriodDescription
    };

    this.props.createComplianceReport(payload);
  }

  createExclusionReport (compliancePeriodDescription) {
    const payload = {
      status: {
        fuelSupplierStatus: 'Draft'
      },
      type: 'Exclusion Report',
      compliancePeriod: compliancePeriodDescription
    };

    this.props.createExclusionReport(payload);
  }

  loadData () {
    this.props.getCompliancePeriods();
    this.props.getComplianceReports();
  }

  render () {
    const currentYear = new Date().getFullYear();
    const currentEffectiveDate = `${currentYear}-01-01`;

    return (
      <ComplianceReportingPage
        compliancePeriods={this.props.compliancePeriods.filter(compliancePeriod =>
          compliancePeriod.effectiveDate <= currentEffectiveDate &&
          compliancePeriod.effectiveDate >= CONFIG.COMPLIANCE_REPORTING.CREATE_EFFECTIVE_DATE)
          .reverse()}
        complianceReports={{
          isFetching: this.props.complianceReports.isFinding,
          items: this.props.complianceReports.items
        }}
        createComplianceReport={this.createComplianceReport}
        createExclusionReport={this.createExclusionReport}
        loggedInUser={this.props.loggedInUser}
        title="Compliance Reporting"
      />
    );
  }
}

ComplianceReportingContainer.defaultProps = {
  complianceReporting: {},
  exclusionReports: {}
};

ComplianceReportingContainer.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  getCompliancePeriods: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

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
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  createComplianceReport: complianceReporting.create,
  createExclusionReport: exclusionReports.create,
  getCompliancePeriods,
  getComplianceReports: complianceReporting.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
