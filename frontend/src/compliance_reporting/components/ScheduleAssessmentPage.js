import React from 'react';
import PropTypes from 'prop-types';

import ComplianceReportingStatusHistory from './ComplianceReportingStatusHistory';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';

const ScheduleAssessmentPage = props => (
  <div className="schedule-assessment">
    <ComplianceReportingStatusHistory
      complianceReport={props.complianceReport}
    />

    {props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.APPROVE) &&
      <h2>
        Upon acceptance the following information will become visible to
        {` ${props.snapshot.organization.name} `}
      </h2>
    }
    <h1>Part 2 requirements: {props.part2Compliant}</h1>

    {props.part2Compliant !== 'Did not supply Part 2 fuel' &&
      <p>
        Based on the information submitted,
        <strong> {props.snapshot.organization.name} </strong> {` was `}
        {props.part2Compliant === 'Non-compliant' &&
        <strong> not </strong>
        }
        compliant with the Part 2 requirements of the
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
        under section 7 of the Renewable and Low Carbon Fuel Requirements Regulation for the
        {` ${props.snapshot.compliancePeriod.description} `} compliance period.
      </p>
    }
    {props.part2Compliant === 'Did not supply Part 2 fuel' &&
      <p>
        Based on the information submitted,
        <strong> {props.snapshot.organization.name} </strong> did not supply Part 2
        fuels and therefore was not subject to the Part 2 requirements of the
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
        under section 7 of the Renewable and Low Carbon Fuel Requirements Regulation for the
        {` ${props.snapshot.compliancePeriod.description} `} compliance period.
      </p>
    }

    <h1>Part 3 requirements: {props.part3Compliant}</h1>

    <p>
      Based on the information submitted,
      <strong> {props.snapshot.organization.name} </strong> {` was `}
      {props.part3Compliant === 'Non-compliant' &&
      <strong> not </strong>
      }
      compliant with the Part 3 requirements under section 6 (1) of the
      <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
      for the {` ${props.snapshot.compliancePeriod.description} `} compliance period.
    </p>

    {Number(props.snapshot.summary.lines[25]) > 0 &&
      <p>
        A
        <strong>
          {` validation of ${Number(props.snapshot.summary.lines[25])} credit(s) `}
        </strong>
        in accordance with section 8 (8) of the
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
        and based on the information submitted by
        <strong> {props.snapshot.organization.name} </strong>. These
        credits may now be transferred to other Part 3 fuel suppliers in accordance with the
        Renewable and Low Carbon Fuel Requirements Regulation or retained for future compliance
        requirements.
      </p>
    }

    {Number(props.snapshot.summary.lines[26]) > 0 &&
      <p>
        <strong> {props.snapshot.organization.name} </strong> applied
        {` ${Number(props.snapshot.summary.lines[26])} `}
        {` credits to `}
        {Number(props.snapshot.summary.lines[27]) < 0 && ' partially '}
        {` offset a net debit balance in the `}
        {` ${props.snapshot.compliancePeriod.description} `} compliance period.
      </p>
    }

    {Number(props.snapshot.summary.lines[27]) < 0 &&
      <p>
        There were
        <strong>
          {` ${Number(props.snapshot.summary.lines[27]) * -1} `}
          {` outstanding debits `}
        </strong>
        subject to an administrative penalty under section 10 of the
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>.
      </p>
    }

    <p>
      The information to which this assessment is based is subject to verification through
      on-site inspection under the
      <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>,
      and records must be retained in accordance with the Renewable and Low Carbon Fuel
      Requirements Regulation.
    </p>
  </div>
);

ScheduleAssessmentPage.defaultProps = {
};

ScheduleAssessmentPage.propTypes = {
  complianceReport: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  part2Compliant: PropTypes.string.isRequired,
  part3Compliant: PropTypes.string.isRequired,
  snapshot: PropTypes.shape({
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string
    }),
    organization: PropTypes.shape({
      name: PropTypes.string
    }),
    summary: PropTypes.shape({
      lines: PropTypes.shape()
    })
  }).isRequired
};

export default ScheduleAssessmentPage;
