/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import ExclusionReportPage from './components/ExclusionReportPage';
import CONFIG from '../config';

class ExclusionReportContainer extends Component {
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
      <ExclusionReportPage
        compliancePeriods={this.props.compliancePeriods.filter(compliancePeriod =>
          compliancePeriod.effectiveDate <= currentEffectiveDate &&
          compliancePeriod.effectiveDate >= CONFIG.COMPLIANCE_REPORTING.CREATE_EFFECTIVE_DATE)
          .reverse()}
        exclusionReports={{
          isFetching: false,
          items: []
        }}
        loggedInUser={this.props.loggedInUser}
        title="Exclusion Report"
      />
    );
  }
}

ExclusionReportContainer.defaultProps = {};

ExclusionReportContainer.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  getCompliancePeriods
};

export default connect(mapStateToProps, mapDispatchToProps)(ExclusionReportContainer);
