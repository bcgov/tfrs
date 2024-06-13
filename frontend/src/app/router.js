import React from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'

import * as RoutePath from '../constants/routes'
import {
  CREDIT_TRANSACTIONS_HISTORY,
  FUEL_CODES,
  HISTORICAL_DATA_ENTRY,
  ROLES,
  USERS as ADMIN_USERS,
  USER_LOGIN_HISTORY
} from '../constants/routes/Admin'
import CONTACT_US from '../constants/routes/ContactUs'
import CREDIT_CALCULATIONS from '../constants/routes/CreditCalculations'
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions'
import ORGANIZATIONS from '../constants/routes/Organizations'
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting'
import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports'
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload'
import USERS from '../constants/routes/Users'

import DashboardContainer from '../dashboard/DashboardContainer'
import FuelCodeAddContainer from '../admin/fuel_codes/FuelCodeAddContainer'
import FuelCodeDetailContainer from '../admin/fuel_codes/FuelCodeDetailContainer'
import FuelCodeEditContainer from '../admin/fuel_codes/FuelCodeEditContainer'
import FuelCodesContainer from '../admin/fuel_codes/FuelCodesContainer'
import AdminComplianceReportingContainer from '../admin/compliance_reporting/ComplianceReportingContainer'
import CarbonIntensityLimitDetailContainer from '../admin/compliance_reporting/CarbonIntensityLimitDetailContainer'
import CarbonIntensityLimitEditContainer from '../admin/compliance_reporting/CarbonIntensityLimitEditContainer'
import DefaultCarbonIntensityDetailContainer from '../admin/compliance_reporting/DefaultCarbonIntensityDetailContainer'
import DefaultCarbonIntensityEditContainer from '../admin/compliance_reporting/DefaultCarbonIntensityEditContainer'
import EnergyDensityDetailContainer from '../admin/compliance_reporting/EnergyDensityDetailContainer'
import EnergyDensityEditContainer from '../admin/compliance_reporting/EnergyDensityEditContainer'
import EnergyEffectivenessRatioDetailContainer
  from '../admin/compliance_reporting/EnergyEffectivenessRatioDetailContainer'
import EnergyEffectivenessRatioEditContainer from '../admin/compliance_reporting/EnergyEffectivenessRatioEditContainer'
import PetroleumCarbonIntensityDetailContainer
  from '../admin/compliance_reporting/PetroleumCarbonIntensityDetailContainer'
import PetroleumCarbonIntensityEditContainer from '../admin/compliance_reporting/PetroleumCarbonIntensityEditContainer'
import CreditTransactionsHistoryContainer from '../admin/credit_trade_history/CreditTradeHistoryContainer'
import SecureFileSubmissionsContainer from '../secure_file_submission/SecureFileSubmissionContainer'
import SecureFileSubmissionAddContainer from '../secure_file_submission/SecureFileSubmissionAddContainer'
import SecureFileSubmissionDetailContainer from '../secure_file_submission/SecureFileSubmissionDetailContainer'
import SecureFileSubmissionEditContainer from '../secure_file_submission/SecureFileSubmissionEditContainer'
import HistoricalDataEntryContainer from '../admin/historical_data_entry/HistoricalDataEntryContainer'
import HistoricalDataEntryEditContainer from '../admin/historical_data_entry/HistoricalDataEntryEditContainer'
import RolesContainer from '../admin/roles/RolesContainer'
import RoleViewContainer from '../admin/roles/RoleViewContainer'
import UsersContainer from '../admin/users/UsersContainer'
import UserAddContainer from '../admin/users/UserAddContainer'
import UserEditContainer from '../admin/users/UserEditContainer'
import UserLoginHistoryContainer from '../admin/user_login_history/UserLoginHistoryContainer'
import NotFound from './components/NotFound'
import ComplianceReportingContainer from '../compliance_reporting/ComplianceReportingContainer'
import ExclusionReportEditContainer from '../exclusion_reports/ExclusionReportEditContainer'
import ContactUsContainer from '../contact_us/ContactUsContainer'
import CreditTransactionsContainer from '../credit_transfers/CreditTransactionsContainer'
import CreditTransferAddContainer from '../credit_transfers/CreditTransferAddContainer'
import CreditTransferEditContainer from '../credit_transfers/CreditTransferEditContainer'
import CreditTransferViewContainer from '../credit_transfers/CreditTransferViewContainer'
import MyOrganizationContainer from '../organizations/MyOrganizationContainer'
import OrganizationsContainer from '../organizations/OrganizationsContainer'
import OrganizationViewContainer from '../organizations/OrganizationViewContainer'
import OrganizationRolesContainer from '../organizations/OrganizationRolesContainer'
import SettingsContainer from '../settings/SettingsContainer'
import UserProfileContainer from '../settings/UserProfileContainer'
import UserViewContainer from '../users/UserViewContainer'
import NotificationsContainer from '../notifications/NotificationsContainer'
import CONFIG from '../config'
import OrganizationEditContainer from '../organizations/OrganizationEditContainer'
import ComplianceReportingEditContainer from '../compliance_reporting/ComplianceReportingEditContainer'
import ComplianceReportingEditRedirector from '../compliance_reporting/ComplianceReportingEditRedirector'
import ExclusionReportingEditRedirector from '../exclusion_reports/ExclusionReportingEditRedirector'


const Router = routerProps => (
  <Routes>
    <Route
      exact
      path={RoutePath.HOME}
      element={<DashboardContainer/>}
    />
    <Route
      exact
      path={RoutePath.SETTINGS}
      element={<SettingsContainer/>}
    />
    <Route
      exact
      path={RoutePath.SETTINGS_PROFILE}
      element={<UserProfileContainer/>}
    />
    <Route
      exact
      path={ORGANIZATIONS.LIST}
      element={<OrganizationsContainer/>}
    />
    <Route
      path={ORGANIZATIONS.ADD_USER}
      element={<UserAddContainer/>}
    />
    <Route
      path={ORGANIZATIONS.DETAILS}
      element={<OrganizationViewContainer/>}
    />
    <Route
      exact
      path={ORGANIZATIONS.MINE}
      element={<MyOrganizationContainer/>}
    />
    <Route
      exact
      path={ORGANIZATIONS.ROLES}
      element={<OrganizationRolesContainer/>}
    />
    <Route
      exact
      path={ORGANIZATIONS.ADD}
      element={<OrganizationEditContainer mode="add" />}
    />
    <Route
      path={ORGANIZATIONS.EDIT}
      element={<OrganizationEditContainer mode="edit" />}
    />
    <Route
      exact
      path={CREDIT_TRANSACTIONS.LIST}
      element={<CreditTransactionsContainer/>}
    />
    <Route
      path={CREDIT_TRANSACTIONS.HIGHLIGHT}
      element={<CreditTransactionsContainer/>}
    />
    <Route
      path={CREDIT_TRANSACTIONS.DETAILS}
      element={<CreditTransferViewContainer/>}
    />
    <Route
      exact
      path={CREDIT_TRANSACTIONS.ADD}
      element={<CreditTransferAddContainer/>}
    />
    <Route
      path={CREDIT_TRANSACTIONS.EDIT}
      element={<CreditTransferEditContainer/>}
    />
    <Route
      exact
      path={HISTORICAL_DATA_ENTRY.LIST}
      element={<HistoricalDataEntryContainer/>}
    />
    <Route
      path={HISTORICAL_DATA_ENTRY.EDIT}
      element={<HistoricalDataEntryEditContainer/>}
    />
    <Route
      path={USERS.ADD}
      element={<UserAddContainer/>}
    />
    <Route
      path={USERS.DETAILS}
      element={<UserViewContainer/>}
    />
    <Route
      path={USERS.DETAILS_BY_USERNAME}
      element={<UserViewContainer/>}
    />
    <Route
      path={USERS.EDIT}
      element={<UserEditContainer/>}
    />
    <Route
      exact
      path={CONTACT_US.DETAILS}
      element={<ContactUsContainer/>}
    />
    <Route
      exact
      path={CREDIT_TRANSACTIONS_HISTORY.LIST}
      element={<CreditTransactionsHistoryContainer/>}
    />
    <Route
      path={ROLES.DETAILS}
      element={<RoleViewContainer/>}
    />
    <Route
      exact
      path={ROLES.LIST}
      element={<RolesContainer/>}
    />
    <Route
      exact
      path={ADMIN_USERS.LIST}
      element={<UsersContainer/>}
    />
    <Route
      path={ADMIN_USERS.DETAILS}
      element={<UserViewContainer/>}
    />
    <Route
      path={ADMIN_USERS.DETAILS_BY_USERNAME}
      element={<UserViewContainer/>}
    />
    <Route
      path={ADMIN_USERS.ADD}
      element={<UserAddContainer/>}
    />
    <Route
      path={ADMIN_USERS.EDIT}
      element={<UserEditContainer/>}
    />
    <Route
      exact
      path={RoutePath.NOTIFICATIONS.LIST}
      element={<NotificationsContainer/>}
    />
    <Route
      exact
      path={USER_LOGIN_HISTORY.LIST}
      element={<UserLoginHistoryContainer />}
    />
    {CONFIG.FUEL_CODES.ENABLED && [
      <Route
        exact
        key="fuel_codes_list"
        path={FUEL_CODES.LIST}
        element={<FuelCodesContainer/>}
      />,
      <Route
        key="fuel_codes_add"
        path={FUEL_CODES.ADD}
        element={<FuelCodeAddContainer/>}
      />,
      <Route
        key="fuel_code_details"
        path={FUEL_CODES.DETAILS}
        element={<FuelCodeDetailContainer/>}
      />,
      <Route
        key="fuel_code_edit"
        path={FUEL_CODES.EDIT}
        element={<FuelCodeEditContainer/>}
      />
    ]}
    {CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED && [
      <Route
        exact
        key="secure_document_upload_list"
        path={SECURE_DOCUMENT_UPLOAD.LIST}
        element={<SecureFileSubmissionsContainer/>}
      />,
      <Route
        key="secure_document_upload_add"
        path={SECURE_DOCUMENT_UPLOAD.ADD}
        element={<SecureFileSubmissionAddContainer/>}
      />,
      <Route
        key="secure_document_upload_details"
        path={SECURE_DOCUMENT_UPLOAD.DETAILS}
        element={<SecureFileSubmissionDetailContainer/>}
      />,
      <Route
        key="secure_document_upload_edit"
        path={SECURE_DOCUMENT_UPLOAD.EDIT}
        element={<SecureFileSubmissionEditContainer/>}
      />
    ]}
    {CONFIG.COMPLIANCE_REPORTING.ENABLED && [
      <Route
        exact
        key="compliance_reporting_list"
        path={CREDIT_CALCULATIONS.LIST}
        element={<AdminComplianceReportingContainer/>}
      />,
      <Route
        key="carbon_intensity_limit_details"
        path={CREDIT_CALCULATIONS.CARBON_INTENSITIES_DETAILS}
        element={<CarbonIntensityLimitDetailContainer/>}
      />,
      <Route
        key="carbon_intensity_limit_edit"
        path={CREDIT_CALCULATIONS.CARBON_INTENSITIES_EDIT}
        element={<CarbonIntensityLimitEditContainer/>}
      />,
      <Route
        key="default_carbon_intensity_details"
        path={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_DETAILS}
        element={<DefaultCarbonIntensityDetailContainer/>}
      />,
      <Route
        key="default_carbon_intensity_edit"
        path={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_EDIT}
        element={<DefaultCarbonIntensityEditContainer/>}
      />,
      <Route
        key="energy_effectiveness_ratio_details"
        path={CREDIT_CALCULATIONS.ENERGY_DENSITIES_DETAILS}
        element={<EnergyDensityDetailContainer/>}
      />,
      <Route
        key="energy_effectiveness_ratio_edit"
        path={CREDIT_CALCULATIONS.ENERGY_DENSITIES_EDIT}
        element={<EnergyDensityEditContainer/>}
      />,
      <Route
        key="energy_effectiveness_ratio_details"
        path={CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_DETAILS}
        element={<EnergyEffectivenessRatioDetailContainer/>}
      />,
      <Route
        key="energy_effectiveness_ratio_edit"
        path={CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO_EDIT}
        element={<EnergyEffectivenessRatioEditContainer/>}
      />,
      <Route
        key="petroleum_carbon_intensity_details"
        path={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_DETAILS}
        element={<PetroleumCarbonIntensityDetailContainer/>}
      />,
      <Route
        key="petroleum_carbon_intensity_details"
        path={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_EDIT}
        element={<PetroleumCarbonIntensityEditContainer/>}
      />,
      <Route
        key="compliance_reporting_add"
        path={COMPLIANCE_REPORTING.ADD}
        exact={false}
        strict={false}
        element={<ComplianceReportingEditContainer/>}
      />,
      <Route
        key="compliance_reporting_edit"
        path={COMPLIANCE_REPORTING.EDIT}
        exact={false}
        strict={false}
        element={<ComplianceReportingEditContainer/>}
      />,
      <Route
        key="compliance_reporting_edit_redirect"
        path={COMPLIANCE_REPORTING.EDIT_REDIRECT}
        exact={false}
        strict={false}
        element={<ComplianceReportingEditRedirector/>}
      />,
      <Route
        key="compliance_reporting"
        path={COMPLIANCE_REPORTING.LIST}
        exact
        strict
        element={<ComplianceReportingContainer/>}
      />
    ]}
    {CONFIG.EXCLUSION_REPORTS.ENABLED && [
      <Route
        key="exclusion_reports_add"
        path={EXCLUSION_REPORTS.ADD}
        exact={false}
        strict={false}
        element={<ExclusionReportEditContainer/>}
      />,
      <Route
        key="exclusion_reports_edit"
        path={EXCLUSION_REPORTS.EDIT}
        exact={false}
        strict={false}
        element={<ExclusionReportEditContainer/>}
      />,
      <Route
        key="exclusion_reporting_edit_redirect"
        path={EXCLUSION_REPORTS.EDIT_REDIRECT}
        exact={false}
        strict={false}
        element={<ExclusionReportingEditRedirector/>}
      />
    ]}
    <Route
      path="/dashboard"
      exact
      element={<DashboardContainer/>}
    />
    <Route element={<NotFound/>} />
  </Routes>
)

export default Router
