/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import ComplianceReportingPage from './components/ComplianceReportingPage';
import {complianceReporting} from '../actions/complianceReporting';
import CONFIG from '../config';
import history from "../app/History";
import COMPLIANCE_REPORTING from "../constants/routes/ComplianceReporting";
import toastr from "../utils/toastr";
import {toastr as reduxToastr} from 'react-redux-toastr';

class ComplianceReportingContainer extends Component {
  constructor(props) {
    super(props);
    this.createComplianceReport = this.createComplianceReport.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.complianceReporting.isCreating && !nextProps.complianceReporting.isCreating) {
      if (nextProps.complianceReporting.success) {
        history.push(COMPLIANCE_REPORTING.EDIT
          .replace(':id', nextProps.complianceReporting.item.id)
          .replace(':tab', 'intro')
        );
        toastr.complianceReporting('Created');
      } else {
        reduxToastr.error('Error saving');
      }
    }
  }

  loadData() {
    this.props.getCompliancePeriods();
    this.props.getComplianceReports();
  }

  createComplianceReport(compliancePeriodDescription) {
    const payload = {
      status: {
        'fuelSupplierStatus': 'Draft'
      },
      type: 'Compliance Report',
      compliancePeriod: compliancePeriodDescription
    };

    this.props.createComplianceReport(payload);
  }

  render() {
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
        loggedInUser={this.props.loggedInUser}
        createComplianceReport={this.createComplianceReport}
        title="Compliance Reporting"
      />
    );
  }
}

ComplianceReportingContainer.defaultProps = {};

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
      ])
    }),
  }),
  getCompliancePeriods: PropTypes.func.isRequired,
  createComplianceReport: PropTypes.func.isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  complianceReports: state.rootReducer.complianceReporting,
  complianceReporting: {
    isCreating: state.rootReducer.complianceReporting.isCreating,
    success: state.rootReducer.complianceReporting.success,
    item: state.rootReducer.complianceReporting.item,
    errorMessage: state.rootReducer.complianceReporting.errorMessage
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getCompliancePeriods,
  getComplianceReports: complianceReporting.find,
  createComplianceReport: complianceReporting.create
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
