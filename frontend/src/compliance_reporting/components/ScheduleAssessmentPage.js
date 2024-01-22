import React from 'react'
import PropTypes from 'prop-types'

import ComplianceReportingStatusHistory from './ComplianceReportingStatusHistory'
import { formatNumeric } from '../../utils/functions'
import { COMPLIANCE_YEAR } from '../../constants/values'

const ScheduleAssessmentPage = (props) => {
  const { status, isSupplemental, compliancePeriod } = props.complianceReport

  let originalCredits = 0
  let supplementalCredits = 0

  // try to search for the original credits from the credit transactions
  if (props.complianceReport.creditTransactions) {
    props.complianceReport.creditTransactions.forEach((transaction) => {
      if (!transaction.supplemental) {
        const { credits } = transaction
        if (transaction.type === 'Credit Reduction') {
          originalCredits = credits * -1
        } else if (transaction.type === 'Credit Validation') {
          originalCredits = credits
        }
      }
    })
  }

  if ([status.analystStatus, status.managerStatus].indexOf('Recommended') >= 0 &&
    status.directorStatus === 'Unreviewed') {
    // if this report is not a supplemental report and hasn't been accepted yet then the
    // originalCredits should be the one from the credit report
    if (!isSupplemental) {
    // check if the report was supposed to be a debit or credit
      originalCredits = Number(props.snapshot.summary.lines[25]) > 0
        ? Number(props.snapshot.summary.lines[25])
        : props.snapshot.summary.lines[26] * -1
    } else {
      supplementalCredits = Number(props.snapshot.summary.lines[25]) > 0
        ? Number(props.snapshot.summary.lines[25])
        : props.snapshot.summary.lines[26] * -1
    }
  } else if (status.directorStatus === 'Accepted' && isSupplemental) {
    supplementalCredits = Number(props.snapshot.summary.lines[25]) > 0
      ? Number(props.snapshot.summary.lines[25])
      : props.snapshot.summary.lines[26] * -1
  } else if (status.directorStatus === 'Rejected' && isSupplemental) {
    supplementalCredits = originalCredits

    if (props.complianceReport.creditTransactions) {
      props.complianceReport.creditTransactions.forEach((transaction) => {
        if (transaction.supplemental) {
          const { credits } = transaction
          if (transaction.type === 'Credit Reduction') {
            supplementalCredits -= credits
          } else if (transaction.type === 'Credit Validation') {
            supplementalCredits += credits
          }
        }
      })
    }
  } else if (status.fuelSupplierStatus === 'Submitted' &&
    (status.directorStatus === 'Unreviewed' || !status.directorStatus) && isSupplemental) {
    supplementalCredits = originalCredits

    if (props.complianceReport.creditTransactions) {
      props.complianceReport.creditTransactions.forEach((transaction) => {
        if (transaction.supplemental) {
          const { credits } = transaction
          if (transaction.type === 'Credit Reduction') {
            supplementalCredits -= credits
          } else if (transaction.type === 'Credit Validation') {
            supplementalCredits += credits
          }
        }
      })
    }
  }

  let credits = 0

  // if the new report shows a negative value, that means we have to reverse the
  // previous credits (assuming they were getting credits before)
  if (supplementalCredits < 0 && originalCredits > 0) {
    credits = originalCredits * -1
    credits += supplementalCredits

  // this is for the reverse situation where they originally had a debit, but
  // are now getting credits
  } else if (supplementalCredits > 0 && originalCredits < 0) {
    credits = supplementalCredits
    credits += originalCredits * -1

  // if they were previously had a debit, but still had a debit after
  // or if they were in a credit and was still in a credit after
  } else {
    credits = supplementalCredits - originalCredits
  }

  return (
    <div className="schedule-assessment">
      <ComplianceReportingStatusHistory
        complianceReport={props.complianceReport}
        hideChangelogs
      />
      {props.complianceReport.status.directorStatus === 'Unreviewed' &&
      <h2>
        If accepted the following information will become visible to
        {` ${props.snapshot.organization.name} `}
      </h2>
      }
      <h1>Part 2 requirements: {props.part2Compliant}</h1>

      {props.part2Compliant !== 'Did not supply Part 2 fuel' &&
      <p>
        Based on the information submitted,
        <strong> {props.snapshot.organization.name} </strong> {' was '}
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
        <strong> {props.snapshot.organization.name} </strong> {' was '}
        {props.part3Compliant === 'Non-compliant' &&
        <strong> not </strong>
        }
        compliant with the Part 3 requirements under section 6 (1) of the
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
        for the {` ${props.snapshot.compliancePeriod.description} `} compliance period.
      </p>

      {originalCredits > 0 && Number(compliancePeriod.description) < COMPLIANCE_YEAR && (
        <p>
          A
          <strong>
            {` validation of ${formatNumeric(Number(originalCredits), 0)} credit(s) `}
          </strong>
          in accordance with section 8 (8) of the
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
          and based on the information submitted by
          <strong> {props.snapshot.organization.name} </strong>. These
          credits may now be transferred to other Part 3 fuel suppliers in accordance with the
          Renewable and Low Carbon Fuel Requirements Regulation or retained for future compliance
          requirements.
        </p>
      )}

      {originalCredits < 0 && Number(compliancePeriod.description) < COMPLIANCE_YEAR && (
        <p>
          <strong> {props.snapshot.organization.name} </strong> applied
          {` ${formatNumeric(Number(originalCredits) * -1, 0)} `}
          {' credit(s) to '}
          {Number(props.snapshot.summary.lines[27]) < 0 && ' partially '}
          {' offset a net debit balance in the '}
          {` ${props.snapshot.compliancePeriod.description} `} compliance period.
        </p>
      )}

      {credits < 0 && isSupplemental && Number(compliancePeriod.description) < COMPLIANCE_YEAR && (
        <p>
          A <strong>reduction of {formatNumeric(Number(credits) * -1, 0)} credit(s)</strong> to
          either offset a net debit balance or to correct a discrepancy in previous
          reporting for the
          {` ${props.complianceReport.compliancePeriod.description} compliance period.`}
        </p>
      )}
      {credits > 0 && isSupplemental && Number(compliancePeriod.description) < COMPLIANCE_YEAR && (
        <p>
          A
          <strong>
            {` validation of ${formatNumeric(Number(credits), 0)} credit(s) `}
          </strong>
          in accordance with section 8 (8) of the
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act </em>
          and based on the <strong>Supplemental Reporting</strong> information submitted by
          <strong> {props.snapshot.organization.name} </strong>. These credits may now be
          transferred to other Part 3 fuel suppliers in accordance with
          the Renewable and Low Carbon Fuel Requirements Regulation or retained
          for future compliance requirements.
        </p>
      )}

      {props.snapshot.summary && Number(props.snapshot.summary.lines[27]) < 0 &&
      Number(compliancePeriod.description) < COMPLIANCE_YEAR &&
      <p>
        There were
        <strong>
          {` ${formatNumeric(Number(props.snapshot.summary.lines[27]) * -1, 0)} `}
          {' outstanding debits '}
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
  )
}

ScheduleAssessmentPage.defaultProps = {}

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
}

export default ScheduleAssessmentPage
