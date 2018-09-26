import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/store';

import './app/FontAwesome';

import { getLoggedInUser } from './actions/userActions';
import Router from './router';

import '../styles/index.scss';
import { OidcProvider } from 'redux-oidc';
import userManager from './store/oidc-usermanager';

import CONFIG from './config';
import configureAxios from "./store/authorizationInterceptor";

if (CONFIG.KEYCLOAK.ENABLED) {
  // Inject the keycloak provider

  configureAxios();

  ReactDOM.render(
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <Router />
      </OidcProvider>
    </Provider>,
    document.getElementById('root')
  );
} else {
  // Keycloak is off -- old behaviour

  store.dispatch(getLoggedInUser());

  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById('root')
  );
}
