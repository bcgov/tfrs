import React from 'react';
import PropTypes from 'prop-types';

import Administration from './Administration';
import Balance from './Balance';
import BalanceBCEID from './BalanceBCEID';
import CreditTradingValue from './CreditTradingValue';
import CreditTransactions from './CreditTransactions';
import CreditTransactionsBCEID from './CreditTransactionsBCEID';
import ComplianceReports from './ComplianceReports';
import ComplianceReportsBCEID from './ComplianceReportsBCEID';
import FileSubmissions from './FileSubmissions';
import FuelCodes from './FuelCodes';
import OrganizationDetails from './OrganizationDetails';
import Part3Agreements from './Part3Agreements';
import UserSettings from './UserSettings';

const BCEIDDashboardPage = obj => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      <BalanceBCEID
        loggedInUser={obj.loggedInUser}
      />

      <CreditTradingValue />
    </div>

    <div className="col-md-5">
      <CreditTransactionsBCEID
        creditTransfers={obj.creditTransfers}
        loggedInUser={obj.loggedInUser}
        setFilter={obj.setFilter}
      />

      <Part3Agreements />

      <ComplianceReportsBCEID
        complianceReports={obj.complianceReports}
        loggedInUser={obj.loggedInUser}
        setFilter={obj.setFilter}
      />
    </div>

    <div className="col-md-4">
      <OrganizationDetails
        loggedInUser={obj.loggedInUser}
      />

      <UserSettings
        loggedInUser={obj.loggedInUser}
        unreadNotificationsCount={obj.unreadNotificationsCount}
      />
    </div>
  </div>
);

const IDIRDashboardPage = obj => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      <Balance
        loggedInUser={obj.loggedInUser}
        organization={obj.organization}
        organizations={obj.organizations}
        selectOrganization={obj.selectOrganization}
      />

      <CreditTradingValue />
    </div>

    <div className="col-md-5">
      <CreditTransactions
        creditTransfers={obj.creditTransfers}
        setFilter={obj.setFilter}
      />

      <ComplianceReports
        complianceReports={obj.complianceReports}
        setFilter={obj.setFilter}
      />

      <FuelCodes
        fuelCodes={obj.fuelCodes}
        setFilter={obj.setFilter}
      />
    </div>

    <div className="col-md-4">
      <FileSubmissions
        documentUploads={obj.documentUploads}
        setFilter={obj.setFilter}
      />

      <Administration />

      <UserSettings
        loggedInUser={obj.loggedInUser}
        unreadNotificationsCount={obj.unreadNotificationsCount}
      />
    </div>
  </div>
);

const DashboardPage = (props) => {
  if (!props.loggedInUser.isGovernmentUser) {
    return BCEIDDashboardPage(props);
  }

  return IDIRDashboardPage(props);
};

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
