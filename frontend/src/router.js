import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

/* global __LOGOUT_URL__ */
import * as Routes from './constants/routes';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import HISTORICAL_DATA_ENTRY from './constants/routes/HistoricalDataEntry';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';
import NotFound from './components/reusables/NotFound';
import Organizations from './components/organizations/Organizations';
import OrganizationDetails from './components/organizations/OrganizationDetails';

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
          path={Routes.ORGANIZATIONS}
          component={withRouter(Organizations)}
        />
        <Route
          path={Routes.ORGANIZATION_DETAILS}
          component={withRouter(OrganizationDetails)}
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
          path={Routes.LOGOUT}
          component={() => {
            window.location = __LOGOUT_URL__;
          }}
        />
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
