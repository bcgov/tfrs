import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StatusInterceptor extends Component {
  _render401Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>Welcome to the Transportation Fuel Reporting System.</p>
        <p>It looks like you don&apos;t have an account setup yet, or that you are trying to access a page that you do not have permissions to see.</p>
        <p>You will need to <a href="mailto:lcfrr@gov.bc.ca?subject=Account%20Setup%20for%20TFRS">contact us</a> for help.</p>
      </div>
    );
  }

  _render403Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>Welcome to the Transportation Fuel Reporting System.</p>
        <p>It looks like you don&apos;t have an account setup yet, or that you are trying to access a page that you do not have permissions to see.</p>
        <p>You will need to <a href="mailto:lcfrr@gov.bc.ca?subject=Account%20Setup%20for%20TFRS">contact us</a> for help.</p>
      </div>
    );
  }

  _render500Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>We&apos;re sorry.</p>
        <p>It looks like our system took an unexpected break. We have been notified and will look into it.</p>
      </div>
    );
  }

  _render502Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
      <p>We&apos;re sorry.</p>
        <p>It looks like our system took an unexpected break. We have been notified and will look into it.</p>
      </div>
    );
  }

  _renderDefaultMessage () {
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
        return this._render401Message();
      case 403:
        return this._render403Message();
      case 500:
        return this._render500Message();
      case 502:
        return this._render502Message();
      default:
        return this._renderDefaultMessage();
    }
  }
}

StatusInterceptor.propTypes = {
  statusCode: PropTypes.number.isRequired
};

export default StatusInterceptor;
