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
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';

configureAxios();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <App>
          <Router />
        </App>
      </OidcProvider>
    </Provider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);
