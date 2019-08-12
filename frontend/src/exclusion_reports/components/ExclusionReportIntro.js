import React from 'react';
import PropTypes from 'prop-types';

const ExclusionReportIntro = (props) => {
  const exclusionReportDueDate = `20${Number(props.period.substr(-2)) + 1}`;

  return (
    <div className="page-exclusion-report-intro">
      <div>
        <h1>Exclusion Report for {props.period}</h1>
        <h2>British Columbia Renewable and Low Carbon Fuel Requirements Regulation</h2>
        <p>
        It is the responsibility of anyone who manufactures or imports fuel to determine whether
        their activities qualify them as a Part 2 (Renewable) and/or Part 3 (Low Carbon) fuel
        supplier under the
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act
          </em> (available online at <a href="http://www.bclaws.ca" rel="noopener noreferrer" target="_blank">www.bclaws.ca</a>).
        </p>
        <p>
        The {props.period} compliance period for Part 2 and Part 3 requirements is from January 1 to
        December 31, {props.period}.
          <strong> Exclusion reports are due March 31, {exclusionReportDueDate}</strong>.
        </p>

        <h3>Should I complete an &quot;Exclusion Report for {props.period}&quot;?</h3>
        <p>
        All persons who transfer fuel to a Part 3 fuel supplier under an exclusion agreement are
        required to submit an annual report to the Director.  For more information, see Information
        Bulletin RLCF-015 Exclusion Agreements and Reports, available
        from <a href="http://www.gov.bc.ca/lowcarbonfuels" rel="noopener noreferrer" target="_blank">www.gov.bc.ca/lowcarbonfuels</a>.
          <strong> This report does not apply to petroleum-based gasoline or petroleum-based diesel fuel.</strong>
        </p>

        <h3>Questions?</h3>
        <p>
        Please contact <a href="mailto:lcfrr@gov.bc.ca">lcfrr@gov.bc.ca</a> with any questions you
        may have about this form.
        </p>
      </div>
    </div>
  );
};

ExclusionReportIntro.propTypes = {
  period: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ExclusionReportIntro;
