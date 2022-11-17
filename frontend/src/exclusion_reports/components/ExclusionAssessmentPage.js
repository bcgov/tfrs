import React from 'react'
import PropTypes from 'prop-types'

const ScheduleAssessmentPage = props => (
  <div className="schedule-assessment">
    <h1>Compliance Assessment</h1>

    <p>
      Based on the information submitted,
      <strong> {props.snapshot.organization.name} </strong> was compliant with the Part 3
      requirements of the
      <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
      under section 11.032 of the Renewable and Low Carbon Fuel Requirements Regulation for
      the {` ${props.snapshot.compliancePeriod.description} `} compliance period.
    </p>

    <p>
      The information to which this assessment is based is subject to verification through
      on-site inspection under the
      <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>,
      and records must be retained in accordance with the Renewable and Low Carbon Fuel
      Requirements Regulation.
    </p>
  </div>
)

ScheduleAssessmentPage.defaultProps = {
}

ScheduleAssessmentPage.propTypes = {
  exclusionReport: PropTypes.shape().isRequired,
  snapshot: PropTypes.shape({
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string
    }),
    organization: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired
}

export default ScheduleAssessmentPage
