import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {hot} from 'react-hot-loader/root';

import KeycloakAwareApp from './KeycloakAwareApp';

const App = props => (
  <KeycloakAwareApp>{props.children}</KeycloakAwareApp>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default hot(withRouter(connect(state => ({}))(App)));
