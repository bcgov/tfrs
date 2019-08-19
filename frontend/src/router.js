import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

import * as Routes from './constants/routes';
import {
  CREDIT_TRANSACTIONS_HISTORY,
  FUEL_CODES,
  HISTORICAL_DATA_ENTRY,
  ROLES,
  USERS as ADMIN_USERS
} from './constants/routes/Admin';
import CONTACT_US from './constants/routes/ContactUs';
import CREDIT_CALCULATIONS from './constants/routes/CreditCalculations';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import ORGANIZATIONS from './constants/routes/Organizations';
import COMPLIANCE_REPORTING from './constants/routes/ComplianceReporting';
import EXCLUSION_REPORTS from './constants/routes/ExclusionReports';
import SECURE_DOCUMENT_UPLOAD from './constants/routes/SecureDocumentUpload';
import USERS from './constants/routes/Users';

import FuelCodeAddContainer from './admin/fuel_codes/FuelCodeAddContainer';
import FuelCodeDetailContainer from './admin/fuel_codes/FuelCodeDetailContainer';
import FuelCodeEditContainer from './admin/fuel_codes/FuelCodeEditContainer';
import FuelCodesContainer from './admin/fuel_codes/FuelCodesContainer';
import AdminComplianceReportingContainer from './admin/compliance_reporting/ComplianceReportingContainer';
import CarbonIntensityLimitDetailContainer from './admin/compliance_reporting/CarbonIntensityLimitDetailContainer';
import CarbonIntensityLimitEditContainer from './admin/compliance_reporting/CarbonIntensityLimitEditContainer';
import DefaultCarbonIntensityDetailContainer from './admin/compliance_reporting/DefaultCarbonIntensityDetailContainer';
import DefaultCarbonIntensityEditContainer from './admin/compliance_reporting/DefaultCarbonIntensityEditContainer';
import EnergyDensityDetailContainer from './admin/compliance_reporting/EnergyDensityDetailContainer';
import EnergyDensityEditContainer from './admin/compliance_reporting/EnergyDensityEditContainer';
import EnergyEffectivenessRatioDetailContainer
  from './admin/compliance_reporting/EnergyEffectivenessRatioDetailContainer';
import EnergyEffectivenessRatioEditContainer from './admin/compliance_reporting/EnergyEffectivenessRatioEditContainer';
import PetroleumCarbonIntensityDetailContainer
  from './admin/compliance_reporting/PetroleumCarbonIntensityDetailContainer';
import PetroleumCarbonIntensityEditContainer from './admin/compliance_reporting/PetroleumCarbonIntensityEditContainer';
import CreditTransactionsHistoryContainer from './admin/credit_trade_history/CreditTradeHistoryContainer';
import SecureFileSubmissionsContainer from './secure_file_submission/SecureFileSubmissionContainer';
import SecureFileSubmissionAddContainer from './secure_file_submission/SecureFileSubmissionAddContainer';
import SecureFileSubmissionDetailContainer from './secure_file_submission/SecureFileSubmissionDetailContainer';
import SecureFileSubmissionEditContainer from './secure_file_submission/SecureFileSubmissionEditContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';
import RolesContainer from './admin/roles/RolesContainer';
import RoleViewContainer from './admin/roles/RoleViewContainer';
import UsersContainer from './admin/users/UsersContainer';
import UserAddContainer from './admin/users/UserAddContainer';
import UserEditContainer from './admin/users/UserEditContainer';
import NotFound from './app/components/NotFound';
import ComplianceReportingContainer from './compliance_reporting/ComplianceReportingContainer';
import ExclusionReportEditContainer from './exclusion_reports/ExclusionReportEditContainer';
import ContactUsContainer from './contact_us/ContactUsContainer';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import MyOrganizationContainer from './organizations/MyOrganizationContainer';
import OrganizationsContainer from './organizations/OrganizationsContainer';
import OrganizationViewContainer from './organizations/OrganizationViewContainer';
import OrganizationRolesContainer from './organizations/OrganizationRolesContainer';
import SettingsContainer from './settings/SettingsContainer';
import UserProfileContainer from './settings/UserProfileContainer';
import UserViewContainer from './users/UserViewContainer';
import NotificationsContainer from './notifications/NotificationsContainer';
import AuthCallback from './app/AuthCallback';
import CONFIG from './config';
import OrganizationEditContainer from './organizations/OrganizationEditContainer';
import ComplianceReportingEditContainer from './compliance_reporting/ComplianceReportingEditContainer';
import ComplianceReportingSnapshotContainer from './compliance_reporting/SnapshotContainer';

const Router = routerProps => (
  <ConnectedRouter history={history} key={Math.random()}>
    <App>
      <Switch>
        <Route
          path="/authCallback"
          component={AuthCallback}
        />
        <Route
          exact
          path={Routes.HOME}
          component={withRouter(CreditTransactionsContainer)
          }
        />
        <Route
          exact
          path={Routes.SETTINGS}
          component={withRouter(SettingsContainer)}
        />
        <Route
          exact
          path={Routes.SETTINGS_PROFILE}
          component={withRouter(UserProfileContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.LIST}
          component={withRouter(OrganizationsContainer)}
        />
        <Route
          path={ORGANIZATIONS.ADD_USER}
          component={withRouter(UserAddContainer)}
        />
        <Route
          path={ORGANIZATIONS.DETAILS}
          component={withRouter(OrganizationViewContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.MINE}
          component={withRouter(MyOrganizationContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.ROLES}
          component={withRouter(OrganizationRolesContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.ADD}
          render={properties => <OrganizationEditContainer {...properties} mode="add" />}
        />
        <Route
          path={ORGANIZATIONS.EDIT}
          render={properties => <OrganizationEditContainer {...properties} mode="edit" />}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.LIST}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.HIGHLIGHT}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.DETAILS}
          component={withRouter(CreditTransferViewContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.ADD}
          component={withRouter(CreditTransferAddContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.EDIT}
          component={withRouter(CreditTransferEditContainer)}
        />
        <Route
          exact
          path={HISTORICAL_DATA_ENTRY.LIST}
          component={withRouter(HistoricalDataEntryContainer)}
        />
        <Route
          path={HISTORICAL_DATA_ENTRY.EDIT}
          component={withRouter(HistoricalDataEntryEditContainer)}
        />
        <Route
          path={USERS.ADD}
          component={withRouter(UserAddContainer)}
        />
        <Route
          path={USERS.DETAILS}
          component={withRouter(UserViewContainer)}
        />
        <Route
          path={USERS.DETAILS_BY_USERNAME}
          component={withRouter(UserViewContainer)}
        />
        <Route
          path={USERS.EDIT}
          component={withRouter(UserEditContainer)}
        />
        <Route
          exact
          path={CONTACT_US.DETAILS}
          component={withRouter(ContactUsContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS_HISTORY.LIST}
          component={withRouter(CreditTransactionsHistoryContainer)}
        />
        <Route
          path={ROLES.DETAILS}
          component={withRouter(RoleViewContainer)}
        />
        <Route
          exact
          path={ROLES.LIST}
          component={withRouter(RolesContainer)}
        />
        <Route
          exact
          path={ADMIN_USERS.LIST}
          component={withRouter(UsersContainer)}
        />
        <Route
          path={ADMIN_USERS.DETAILS}
          component={withRouter(UserViewContainer)}
        />
        <Route
          path={ADMIN_USERS.DETAILS_BY_USERNAME}
          component={withRouter(UserViewContainer)}
        />
        <Route
          path={ADMIN_USERS.ADD}
          component={withRouter(UserAddContainer)}
        />
        <Route
          path={ADMIN_USERS.EDIT}
          component={withRouter(UserEditContainer)}
        />
        <Route
          exact
          path={Routes.NOTIFICATIONS.LIST}
          component={withRouter(NotificationsContainer)}
        />
        {CONFIG.FUEL_CODES.ENABLED && [
          <Route
            exact
            key="fuel_codes_list"
            path={FUEL_CODES.LIST}
            component={withRouter(FuelCodesContainer)}
          />,
          <Route
            key="fuel_codes_add"
            path={FUEL_CODES.ADD}
            component={withRouter(FuelCodeAddContainer)}
          />,
          <Route
            key="fuel_code_details"
            path={FUEL_CODES.DETAILS}
            component={withRouter(FuelCodeDetailContainer)}
          />,
          <Route
            key="fuel_code_edit"
            path={FUEL_CODES.EDIT}
            component={withRouter(FuelCodeEditContainer)}
          />
        ]}
        {CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED && [
          <Route
            exact
            key="secure_document_upload_list"
            path={SECURE_DOCUMENT_UPLOAD.LIST}
            component={withRouter(SecureFileSubmissionsContainer)}
          />,
          <Route
            key="secure_document_upload_add"
            path={SECURE_DOCUMENT_UPLOAD.ADD}
            component={withRouter(SecureFileSubmissionAddContainer)}
          />,
          <Route
            key="secure_document_upload_details"
            path={SECURE_DOCUMENT_UPLOAD.DETAILS}
            component={withRouter(SecureFileSubmissionDetailContainer)}
          />,
          <Route
            key="secure_document_upload_edit"
            path={SECURE_DOCUMENT_UPLOAD.EDIT}
            component={withRouter(SecureFileSubmissionEditContainer)}
          />
        ]}
        {CONFIG.COMPLIANCE_REPORTING.ENABLED && [
          <Route
            exact
            key="compliance_reporting_list"
            path={CREDIT_CALCULATIONS.LIST}
            component={withRouter(AdminComplianceReportingContainer)}
          />,
          <Route
            exact
            key="compliance_reporting_snapshot"
            path={COMPLIANCE_REPORTING.SNAPSHOT}
            component={withRouter(ComplianceReportingSnapshotContainer)}
          />,
          <Route
            key="carbon_intensity_limit_details"
            path={CREDIT_CALCULATIONS.CARBON_INTENSITIES_DETAILS}
            component={withRouter(CarbonIntensityLimitDetailContainer)}
          />,
          <Route
            key="carbon_intensity_limit_edit"
            path={CREDIT_CALCULATIONS.CARBON_INTENSITIES_EDIT}
            component={withRouter(CarbonIntensityLimitEditContainer)}
          />,
          <Route
            key="default_carbon_intensity_details"
            path={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_DETAILS}
            component={withRouter(DefaultCarbonIntensityDetailContainer)}
          />,
          <Route
            key="default_carbon_intensity_edit"
            path={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_EDIT}
            component={withRouter(DefaultCarbonIntensityEditContainer)}
          />,
          <Route
            key="energy_effectiveness_ratio_details"
            path={CREDIT_CALCULATIONS.ENERGY_DENSITIES_DETAILS}
            component={withRouter(EnergyDensityDetailContainer)}
          />,
          <Route
            key="energy_effectiveness_ratio_edit"
            path={CREDIT_CALCULATIONS.ENERGY_DENSITIES_EDIT}
            component={withRouter(EnergyDensityEditContainer)}
          />,
          <Route
            key="energy_effectiveness_ratio_details"
            path={CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_DETAILS}
            component={withRouter(EnergyEffectivenessRatioDetailContainer)}
          />,
          <Route
            key="energy_effectiveness_ratio_edit"
            path={CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_EDIT}
            component={withRouter(EnergyEffectivenessRatioEditContainer)}
          />,
          <Route
            key="petroleum_carbon_intensity_details"
            path={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_DETAILS}
            component={withRouter(PetroleumCarbonIntensityDetailContainer)}
          />,
          <Route
            key="petroleum_carbon_intensity_details"
            path={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_EDIT}
            component={withRouter(PetroleumCarbonIntensityEditContainer)}
          />,
          <Route
            key="compliance_reporting_add"
            path={COMPLIANCE_REPORTING.ADD}
            exact={false}
            strict={false}
            component={withRouter(ComplianceReportingEditContainer)}
          />,
          <Route
            key="compliance_reporting_edit"
            path={COMPLIANCE_REPORTING.EDIT}
            exact={false}
            strict={false}
            component={withRouter(ComplianceReportingEditContainer)}
          />,
          <Route
            key="compliance_reporting"
            path={COMPLIANCE_REPORTING.LIST}
            exact
            strict
            component={withRouter(ComplianceReportingContainer)}
          />
        ]}
        {CONFIG.EXCLUSION_REPORTS.ENABLED && [
          <Route
            key="exclusion_reports_add"
            path={EXCLUSION_REPORTS.ADD}
            exact={false}
            strict={false}
            component={withRouter(ExclusionReportEditContainer)}
          />
        ]}
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
