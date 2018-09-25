import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/store';

import './app/FontAwesome';

import { getLoggedInUser } from './actions/userActions';
import Router from './router';

import '../styles/index.scss';
import { OidcProvider } from "redux-oidc";
import userManager from "./store/oidc-usermanager";

//store.dispatch(getLoggedInUser());

ReactDOM.render(
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <Router />
      </OidcProvider>
    </Provider>,
  document.getElementById('root')
);
