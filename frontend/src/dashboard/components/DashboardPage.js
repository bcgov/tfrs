import React from 'react';

import Balance from './Balance';
import CreditTradingValue from './CreditTradingValue';
import CreditTransactions from './CreditTransactions';
import ComplianceReports from './ComplianceReports';
import FileSubmissions from './FileSubmissions';
import FuelCodes from './FuelCodes';

const DashboardPage = props => (
  <div className="row">
    <div className="col-md-3">
      <Balance />

      <CreditTradingValue />
    </div>

    <div className="col-md-6">
      <CreditTransactions />

      <ComplianceReports />

      <FuelCodes />
    </div>

    <div className="col-md-3">
      <FileSubmissions />
    </div>
  </div>
);

DashboardPage.defaultProps = {
};

DashboardPage.propTypes = {
};

export default DashboardPage;
