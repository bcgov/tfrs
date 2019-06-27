/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ComplianceReportIntro from './components/ComplianceReportIntro';

const ComplianceReportIntroContainer = props => (
  <ComplianceReportIntro
    activeTab="intro"
    period={props.period}
    edit={props.edit}
    loggedInUser={props.loggedInUser}
    title="Compliance Reporting"
    saving={props.saving}
  />
);

ComplianceReportIntroContainer.defaultProps = {
};

ComplianceReportIntroContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

export default connect(mapStateToProps, null)(ComplianceReportIntroContainer);
