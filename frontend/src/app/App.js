import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import CONFIG from '../config';

import KeycloakAwareApp from './KeycloakAwareApp';

const App = (props) => {
  if (CONFIG.KEYCLOAK.ENABLED) {
    return <KeycloakAwareApp>{props.children}</KeycloakAwareApp>;
  }
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default withRouter(connect(state => ({}))(App));
