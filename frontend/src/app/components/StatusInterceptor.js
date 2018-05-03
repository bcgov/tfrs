import React from 'react';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert';

const StatusInterceptor = (props) => {
  let title = '';
  let message = '';

  switch (props.statusCode) {
    case 401:
      title = `You are logged in but we can't find your account in our system. Please contact your company representative for assistance.`;
      message = `HTTP Status Code: 401 Unauthenticated.`;
      break;
    case 403:
      title = `You are logged in but do not have permission to access this content. Please contact your company representative for assistance.`;
      message = `HTTP Status Code: 403 Forbidden.`;
      break;
    case 500:
      title = `An API error is preventing access to the system. Please try again later.`;
      message = `HTTP Status Code: 500 Internal Server Error.`;
      break;
    case 502:
      title = `A gateway error is preventing access to the system. Please try again later.`;
      message = `HTTP Status Code: 502 Bad Gateway.`;
      break;
    default:
      title = 'Server Error!';
      message = `An API error occurred`;
  }

  return (<ErrorAlert title={title} message={message} />);
};

StatusInterceptor.propTypes = {
  statusCode: PropTypes.string.isRequired
};

export default StatusInterceptor;
