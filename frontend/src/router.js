import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

import * as Routes from './constants/routes';
import {
  CREDIT_TRANSACTIONS_HISTORY,
  HISTORICAL_DATA_ENTRY,
  ROLES,
  USERS as ADMIN_USERS
} from './constants/routes/Admin';
import CONTACT_US from './constants/routes/ContactUs';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import ORGANIZATIONS from './constants/routes/Organizations';
import SECURE_DOCUMENT_UPLOAD from './constants/routes/SecureDocumentUpload';
import USERS from './constants/routes/Users';

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

const Router = props => (
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
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
