import React from 'react';

import Administration from './Administration';
import Balance from './Balance';
import CreditTradingValue from './CreditTradingValue';
import CreditTransactions from './CreditTransactions';
import ComplianceReports from './ComplianceReports';
import FileSubmissions from './FileSubmissions';
import FuelCodes from './FuelCodes';
import UserSettings from './UserSettings';

const DashboardPage = props => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      <Balance />

      <CreditTradingValue />
    </div>

    <div className="col-md-5">
      <CreditTransactions />

      <ComplianceReports />

      <FuelCodes />
    </div>

    <div className="col-md-4">
      <FileSubmissions />

      <Administration />

      <UserSettings />
    </div>
  </div>
);

DashboardPage.defaultProps = {
};

DashboardPage.propTypes = {
};

export default DashboardPage;
