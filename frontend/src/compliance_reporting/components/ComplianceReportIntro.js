import React from 'react'
import PropTypes from 'prop-types'

const ComplianceReportIntro = (props) => {
  const complianceReportDueDate = `20${Number(props.period.substr(-2)) + 1}`

  let litresText = ' 75 million '

  if (Number(props.period) === 2021) {
    litresText = ' 25 million '
  } else if (Number(props.period) > 2021) {
    litresText = ' 200,000 litres '
  }

  return (
    <div className="page-compliance-reporting-intro">
      <div>
        <h1>Compliance Report for {props.period}</h1>
        <h2>British Columbia Renewable and Low Carbon Fuel Requirements Regulation</h2>
        <p>
        It is the responsibility of anyone who manufactures or imports fuel to determine whether
        their activities qualify them as a Part 2 (Renewable) and/or Part 3 (Low Carbon) fuel
        supplier under the
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act
          </em> (available online at <a href="http://www.bclaws.ca" rel="noopener noreferrer" target="_blank">www.bclaws.ca</a>).
        </p>
        <p>
        All Part 2 and Part 3 fuel suppliers must report using this form unless they claim the Small
        Supplier Exemption (see below).  The {props.period} compliance period for Part 2
        and Part 3 requirements is from January 1 to December 31, {props.period}.
          <strong> Compliance reports for {props.period} are due
            March 31, {complianceReportDueDate}.
          </strong>
        </p>
        <p>
        The compliance report must be submitted by an officer or employee authorized by the fuel
        supplier, and records evidencing each matter reported under the Renewable and Low Carbon
        Fuel Requirements Regulation (Regulation) must be available for inspection upon request.
        These records must be retained for a period of seven years after the compliance period to
        which they refer.
        </p>
        <p>
        An administrative penalty must be made payable to the Minister of Finance. Payment is due
        March 31 following each compliance period. For more information please contact the Low
        Carbon Fuels Branch via email at <a href="mailto:lcfs@gov.bc.ca">lcfs@gov.bc.ca</a>.
        </p>

        <h3>Small  Fuel Supplier Exemption</h3>
        <p>
        Fuel suppliers and their affiliates who supplied less than a total of {litresText} litres of
        gasoline and diesel class fuels (combined) in the {props.period} compliance period
        may apply to be exempted from Part 2 and/or Part 3 requirements.  A Part 2 or Part 3 fuel
        supplier who applies to be exempted must submit an Exemption Report, available from (
          <a href="http://www.gov.bc.ca/lowcarbonfuels" rel="noopener noreferrer" target="_blank">
          www.gov.bc.ca/lowcarbonfuels
          </a>
        ). A Part 3 fuel supplier who does not supply any Part 2 fuels may not be exempted.
        </p>
        <p>
        For more information, see Information Bulletin RLCF-005 Exemption Reports; available from
        (
          <a href="http://www.gov.bc.ca/lowcarbonfuels" rel="noopener noreferrer" target="_blank">
          www.gov.bc.ca/lowcarbonfuels
          </a>
        ).
        </p>

        <h3>About this form</h3>
        <p>
        The values and calculations provided in this report are for informational purposes only and
        are subject to change at any time as a result of administrative and legislative changes.
        The Declaration &amp; Summary section of this Compliance Report compiles information from
        the other schedules of this report. This is the last section users should complete.
        </p>
        <p>
          <strong>Before reporting electricity for compliance periods prior to 2022, please review Information Bulletin RLCF-020 to confirm you meet all the conditions to be the Part 3 fuel supplier for the electricity supply prior to 2022. In most cases, the utility was the Part 3 fuel supplier for electricity supplied prior to 2022. For questions, please email the Low Carbon Fuels Branch at <a href="mailto:lcfs@gov.bc.ca" target="_blank" rel="noreferrer">lcfs@gov.bc.ca</a>.</strong>
        </p>

        <h3>Questions?</h3>
        <p>
        Please contact <a href="mailto:lcfs@gov.bc.ca">lcfs@gov.bc.ca</a> with any questions you
        may have about this form.
        </p>
      </div>
    </div>
  )
}

ComplianceReportIntro.propTypes = {
  period: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default ComplianceReportIntro
