import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import KeycloakAwareApp from './KeycloakAwareApp';
import { useNavigate } from "react-router-dom";

const App = props => {
  let navigate = useNavigate();
  return (
    <KeycloakAwareApp navigate={navigate}>{props.children}</KeycloakAwareApp>
  )
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default connect(state => ({}))(App);
