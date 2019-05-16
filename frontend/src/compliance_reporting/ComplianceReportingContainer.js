/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import ComplianceReportingPage from './components/ComplianceReportingPage';
import CONFIG from '../config';

class ComplianceReportingContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getCompliancePeriods();
  }

  render () {
    const currentYear = new Date().getFullYear();
    const currentEffectiveDate = `${currentYear}-01-01`;

    return (
      <ComplianceReportingPage
        compliancePeriods={this.props.compliancePeriods.filter(compliancePeriod =>
          compliancePeriod.effectiveDate < currentEffectiveDate &&
          compliancePeriod.effectiveDate >= CONFIG.COMPLIANCE_REPORTING.CREATE_EFFECTIVE_DATE)
          .reverse()}
        complianceReports={{
          isFetching: false,
          items: []
        }}
        loggedInUser={this.props.loggedInUser}
        title="Compliance Reporting"
      />
    );
  }
}

ComplianceReportingContainer.defaultProps = {
};

ComplianceReportingContainer.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
