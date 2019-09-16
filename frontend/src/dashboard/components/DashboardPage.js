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
      <Balance
        loggedInUser={props.loggedInUser}
        organization={props.organization}
        organizations={props.organizations}
        selectOrganization={props.selectOrganization}
      />

      <CreditTradingValue />
    </div>

    <div className="col-md-5">
      <CreditTransactions
        creditTransfers={props.creditTransfers}
        setFilter={props.setFilter}
      />

      <ComplianceReports
        complianceReports={props.complianceReports}
        setFilter={props.setFilter}
      />

      <FuelCodes
        fuelCodes={props.fuelCodes}
        setFilter={props.setFilter}
      />
    </div>

    <div className="col-md-4">
      <FileSubmissions
        documentUploads={props.documentUploads}
        setFilter={props.setFilter}
      />

      <Administration />

      <UserSettings
        loggedInUser={props.loggedInUser}
        unreadNotificationsCount={props.unreadNotificationsCount}
      />
    </div>
  </div>
);

DashboardPage.defaultProps = {
  organization: {},
  organizations: [],
  unreadNotificationsCount: 0
};

DashboardPage.propTypes = {
  complianceReports: PropTypes.shape().isRequired,
  creditTransfers: PropTypes.shape().isRequired,
  documentUploads: PropTypes.shape().isRequired,
  fuelCodes: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  organization: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.bool
  ]),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  selectOrganization: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  unreadNotificationsCount: PropTypes.number
};

export default DashboardPage;
