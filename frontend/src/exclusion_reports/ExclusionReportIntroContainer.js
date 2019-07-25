/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ExclusionReportIntro from './components/ExclusionReportIntro';

const ExclusionReportIntroContainer = props => (
  <ExclusionReportIntro
    activeTab="intro"
    period={props.period}
    loggedInUser={props.loggedInUser}
    title="Compliance Reporting"
  />
);

ExclusionReportIntroContainer.defaultProps = {
};

ExclusionReportIntroContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

export default connect(mapStateToProps, null)(ExclusionReportIntroContainer);
