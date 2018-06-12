import React from 'react';
import PropTypes from 'prop-types';

const Errors = props => (
  <div className="alert alert-danger error-alert" role="alert">
    <p>{props.title}</p>
    { typeof (props.errors) === 'string' &&
      <p>{props.errors}</p>
    }
    { typeof (props.errors) === 'object' &&
      Object.prototype.hasOwnProperty.call(props.errors, 'statusText') &&
      <p>{props.errors.statusText}</p>
    }
    { typeof (props.errors) === 'object' &&
      !Object.prototype.hasOwnProperty.call(props.errors, 'statusText') &&
      Object.keys(props.errors).length > 0 &&
      Object.keys(props.errors).map(error => (
        <p key={error}>{props.errors[error]}</p>
      ))
    }
  </div>
);

Errors.defaultProps = {
  title: 'Error!'
};

Errors.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]).isRequired,
  title: PropTypes.string
};

export default Errors;
