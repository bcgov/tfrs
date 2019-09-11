import React from 'react';
import PropTypes from 'prop-types';

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

      <UserSettings
        loggedInUser={props.loggedInUser}
        unreadNotificationsCount={props.unreadNotificationsCount}
      />
    </div>
  </div>
);

DashboardPage.defaultProps = {
  unreadNotificationsCount: 0
};

DashboardPage.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  unreadNotificationsCount: PropTypes.number
};

export default DashboardPage;
