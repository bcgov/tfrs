import React from 'react';
import PropTypes from 'prop-types';

import ScheduleTabs from './ScheduleTabs';
import ScheduleButtons from './ScheduleButtons';

const ComplianceReportIntro = (props) => {
  const complianceReportDueDate = `20${Number(props.period.substr(-2)) + 1}`;

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
        Supplier Exemption (see below).  The {props.compliancePeriod} compliance period for Part 2
        and Part 3 requirements is from January 1 to December 31, {props.compliancePeriod}.
          <strong> Compliance reports for {props.compliancePeriod} are due
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
        Payment of penalties must be sent to the Ministry of Energy, Mines and Petroleum Resources
        at the same time as this report is submitted.
        </p>
        <p>
        Cheques or money orders are to be made payable to the Minister of Finance.
        </p>

        <h3>Small  Fuel Supplier Exemption</h3>
        <p>
        Fuel suppliers and their affiliates who supplied less than a total of 75 million litres of
        gasoline and diesel class fuels (combined) in the {props.compliancePeriod} compliance period
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
        The Declaration &amp; Summary section of this Compliance Report compiles information from
        the other schedules of this report. This is the last section users should complete.
        </p>

        <h3>Questions?</h3>
        <p>
        Please contact <a href="mailto:lcfrr@gov.bc.ca">lcfrr@gov.bc.ca</a> with any questions you
        may have about this form.
        </p>
      </div>

      <ScheduleButtons
        edit={props.edit}
        saving={props.saving}
      />
    </div>
  );
};

ComplianceReportIntro.propTypes = {
  period: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired
};

export default ComplianceReportIntro;
