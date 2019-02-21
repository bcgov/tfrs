import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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

export default withRouter(connect(state => ({}))(App));
