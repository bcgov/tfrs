import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StatusInterceptor extends Component {
  static render401Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>Welcome to the Transportation Fuel Reporting System.</p>
        <p>It looks like you don&apos;t have an account setup yet, or that you are trying to access
          a page that you do not have permissions to see.
        </p>
        <p>You will need to
          <a href="mailto:lcfrr@gov.bc.ca?subject=Account%20Setup%20for%20TFRS">contact us</a>
          for help.
        </p>
      </div>
    );
  }

  static render403Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>Welcome to the Transportation Fuel Reporting System.</p>
        <p>It looks like you don&apos;t have an account setup yet, or that you are trying to access
          a page that you do not have permissions to see.
        </p>
        <p>You will need to
          <a href="mailto:lcfrr@gov.bc.ca?subject=Account%20Setup%20for%20TFRS">contact us</a>
          for help.
        </p>
      </div>
    );
  }

  static render500Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>We&apos;re sorry.</p>
        <p>It looks like our system took an unexpected break. We have been notified and will look
          into it.
        </p>
      </div>
    );
  }

  static render502Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>We&apos;re sorry.</p>
        <p>It looks like our system took an unexpected break. We have been notified and will look
          into it.
        </p>
      </div>
    );
  }

  static renderDefaultMessage () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <strong>Server Error!</strong>
        <div>An API error occurred.</div>
      </div>
    );
  }

  render () {
    switch (this.props.statusCode) {
      case 401:
        return StatusInterceptor.render401Message();
      case 403:
        return StatusInterceptor.render403Message();
      case 500:
        return StatusInterceptor.render500Message();
      case 502:
        return StatusInterceptor.render502Message();
      default:
        return StatusInterceptor.renderDefaultMessage();
    }
  }
}

StatusInterceptor.propTypes = {
  statusCode: PropTypes.number.isRequired
};

export default StatusInterceptor;
