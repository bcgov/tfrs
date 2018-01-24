import React from 'react';
import PropTypes from 'prop-types';

const ErrorAlert = props => (
  <div>
    <h1>{props.title}</h1>
    <p>{props.message}</p>
  </div>
);

ErrorAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default ErrorAlert;
