/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ComplianceReportIntro from './components/ComplianceReportIntro'

const ComplianceReportIntroContainer = props => (
  <ComplianceReportIntro
    activeTab="intro"
    period={props.period}
    loggedInUser={props.loggedInUser}
    title="Compliance Reporting"
  />
)

ComplianceReportIntroContainer.defaultProps = {
}

ComplianceReportIntroContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
})

export default connect(mapStateToProps, null)(ComplianceReportIntroContainer)
