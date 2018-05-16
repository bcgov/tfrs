import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/store';

import './app/FontAwesome';

import { getLoggedInUser } from './actions/userActions';
import Router from './router';

import '../styles/index.scss';

store.dispatch(getLoggedInUser());

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
