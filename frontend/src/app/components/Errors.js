import React from 'react';
import PropTypes from 'prop-types';

const Errors = props => (
  <div className="alert alert-danger">
    <h1>{props.title}</h1>
    { Object.keys(props.errors).length > 0 &&
      Object.keys(props.errors).map(error => (
        <p key={error}>({error}) {props.errors[error]}</p>
      ))
    }
  </div>
);

Errors.defaultProps = {
  title: 'Error!'
};

Errors.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  title: PropTypes.string
};

export default Errors;
