import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = props => (
  <div className="alert alert-danger error-alert" role="alert">
    <strong> {props.title} </strong>
    <div>{props.message}</div>
  </div>
);

ErrorAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default ErrorAlert;
