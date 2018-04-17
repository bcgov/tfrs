import React from 'react';
import PropTypes from 'prop-types';

const SuccessAlert = props => (
  <div className="alert alert-success">
    <h1>Success!</h1>
    <p>{props.message}</p>
  </div>
);

SuccessAlert.propTypes = {
  message: PropTypes.string.isRequired
};

export default SuccessAlert;
