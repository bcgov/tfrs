import React from 'react';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert';

const StatusInterceptor = (props) => {
  let title = '';
  let message = '';

  switch (props.statusCode) {
    case 401:
      title = 'Not authenticated';
      message = `Sorry, you are not authenticated to use this application. Please contact your administrator`;
      break;
    case 403:
      title = `You are logged in but do not have permission to access to this content. Please contact your User Manager for help.`;
      message = `HTTP Status Code: 403 Forbidden.`;
      break;
    case 500:
      title = `You are logged in but there is an API Error, which is preventing access to the project.`;
      message = `HTTP Status Code: 500 Internal Server Error.`;
      break;
    case 502:
      title = `You are logged in but there is an API Error, which is preventing access to the project.`;
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
