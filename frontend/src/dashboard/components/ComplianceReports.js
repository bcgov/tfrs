import React from 'react';

const ComplianceReports = props => (
  <div className="dashboard-fieldset">
    <h1>Compliance &amp; Exclusion Reports</h1>
    There are:

    <div>
      <div className="value">
        5
      </div>
      <div className="content">
        <h2>compliance reports in progress:</h2>

        <div><a href="">2 awaiting government analyst review</a></div>
        <div><a href="">2 awaiting Compliance Manager review</a></div>
        <div><a href="">1 awaiting Director review</a></div>
      </div>
    </div>

    <div>
      <div className="value">
        6
      </div>
      <div className="content">
        <h2>exclusion reports in progress:</h2>

        <div><a href="">3 awaiting government analyst review</a></div>
        <div><a href="">2 awaiting Compliance Manager review</a></div>
        <div><a href="">1 awaiting Director review</a></div>
      </div>
    </div>

    <div>
      <div className="content offset-value">
        <h2>View all reports:</h2>

        <div><a href="">Current compliance period</a> | <a href="">All/historical</a></div>
      </div>
    </div>
  </div>
);

ComplianceReports.defaultProps = {
};

ComplianceReports.propTypes = {
};

export default ComplianceReports;
