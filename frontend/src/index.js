import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';

import store from './store/store';

import './app/FontAwesome';

import Router from './router';

import '../styles/index.scss';

import configureAxios from './store/authorizationInterceptor';
import userManager from './store/oidc-usermanager';

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
