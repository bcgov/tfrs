import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, withRouter, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

// import createHistory from 'history/createHashHistory'; // 'history/createHashHistory' for  '#'
import * as Routes from './constants/routes';
import store from './store/store';

import App from './app/App';
import history from './app/History';
import './app/FontAwesome';
// import Dashboard from './components/dashboard/Dashboard';
import Organizations from './components/organizations/Organizations';
// import AccountActivity from './components/account_activity/AccountActivity';
// import CreditTransfer from './components/account_activity/CreditTransfer';
// import CreditTransferNew from './components/account_activity/CreditTransferNew';
// import Notifications from './components/notifications/Notifications';
// import Administration from './components/administration/Administration';
// import Settings from './components/settings/Settings';
import OrganizationDetails from './components/organizations/OrganizationDetails';
import NotFound from './components/reusables/NotFound';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';

import { getLoggedInUser } from './actions/userActions';

// // TODO: Move Routes to Routes.js

import '../styles/index.scss';

// // const history = createHistory();

store.dispatch(getLoggedInUser());

// ReactDOM.render(
//   <Provider store={store}>
//     <ConnectedRouter history={history} key={Math.random()}>
//       <div>
//         <App>
//           <Switch>
//             <Route
//               exact
//               path={Routes.HOME}
//               component={withRouter(Dashboard)}
//             />
//             <Route
//               exact
//               path={Routes.ORGANIZATIONS}
//               component={withRouter(Organizations)}
//             />
//             <Route
//               path={Routes.ORGANIZATION_DETAILS}
//               component={withRouter(OrganizationDetails)}
//             />
//             <Route
//               path={Routes.ACCOUNT_ACTIVITY}
//               component={withRouter(AccountActivity)}
//             />
//             <Route
//               path={Routes.CREDIT_TRANSFER_DETAILS}
//               component={withRouter(CreditTransfer)}
//             />

//             <Route
//               exact
//               path={Routes.CREDIT_TRANSFER}
//               component={withRouter(CreditTransferNew)}
//             />
//             <Route
//               path={Routes.NOTIFICATIONS}
//               component={withRouter(Notifications)}
//             />
//             <Route
//               path={Routes.ADMINISTRATION}
//               component={withRouter(Administration)}
//             />
//             <Route path={Routes.SETTINGS} component={withRouter(Settings)} />
//             <Route
//               exact
//               path={Routes.CREDIT_TRANSACTIONS}
//               component={withRouter(CreditTransactionsContainer)}
//             />
//             <Route
//               path={Routes.CREDIT_TRANSACTION_DETAILS}
//               component={withRouter(CreditTransferViewContainer)}
//             />
//             <Route
//               exact
//               path={Routes.CREDIT_TRANSACTIONS_ADD}
//               component={withRouter(CreditTransferAddContainer)}
//             />
//             <Route
//               path={Routes.CREDIT_TRANSACTION_EDIT}
//               component={withRouter(CreditTransferEditContainer)}
//             />
//             <Route component={NotFound} />
//           </Switch>
//         </App>
//       </div>
//     </ConnectedRouter>
//   </Provider>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history} key={Math.random()}>
      <div>
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
              path={Routes.CREDIT_TRANSACTIONS}
              component={withRouter(CreditTransactionsContainer)}
            />
            <Route
              path={Routes.CREDIT_TRANSACTION_DETAILS}
              component={withRouter(CreditTransferViewContainer)}
            />
            <Route
              exact
              path={Routes.CREDIT_TRANSACTIONS_ADD}
              component={withRouter(CreditTransferAddContainer)}
            />
            <Route
              path={Routes.CREDIT_TRANSACTION_EDIT}
              component={withRouter(CreditTransferEditContainer)}
            />
            <Route
              exact
              path={Routes.HISTORICAL_DATA_ENTRY}
              component={withRouter(HistoricalDataEntryContainer)}
            />
            <Route
              path={Routes.HISTORICAL_DATA_ENTRY_EDIT}
              component={withRouter(HistoricalDataEntryEditContainer)}
            />
            <Route
              path={Routes.LOGOUT}
              component={() => {
                if (window.location.host === 'lowcarbonfuels.gov.bc.ca') {
                  window.location = 'https://logon.gov.bc.ca/clp-cgi/logoff.cgi';
                } else {
                  window.location = 'https://logontest.gov.bc.ca/clp-cgi/logoff.cgi';
                }
              }}
            />
            <Route component={NotFound} />

          </Switch>
        </App>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
