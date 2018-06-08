import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

/* global __LOGOUT_URL__ */
import * as Routes from './constants/routes';
import CONTACT_US from './constants/routes/ContactUs';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import HISTORICAL_DATA_ENTRY from './constants/routes/HistoricalDataEntry';
import ORGANIZATIONS from './constants/routes/Organizations';

import ContactUsContainer from './contact_us/ContactUsContainer';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';
import NotFound from './components/reusables/NotFound';
import OrganizationsContainer from './organizations/OrganizationsContainer';

const Router = props => (
  <ConnectedRouter history={history} key={Math.random()}>
    <App>
      <Switch>
        <Route
          exact
          path={Routes.HOME}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          exact
          path={Routes.LOGOUT}
          component={() => {
            window.location = __LOGOUT_URL__;
          }}
        />
        <Route
          exact
          path={ORGANIZATIONS.LIST}
          component={withRouter(OrganizationsContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.LIST}
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
          exact
          path={CONTACT_US.DETAILS}
          component={withRouter(ContactUsContainer)}
        />
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
