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
          <a href="mailto:lcfs@gov.bc.ca?subject=Account%20Setup%20for%20TFRS"> contact us </a>
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
          <a href="mailto:lcfs@gov.bc.ca?subject=Account%20Setup%20for%20TFRS"> contact us </a>
          for help.
        </p>
      </div>
    );
  }

  static render404Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>The requested page could not be found.</p>
        <p>To trade this page for a valid one click <a href="/">here</a> or learn more about the Renewable and Low Carbon Fuel Requirements Regulation <a href="http://www.gov.bc.ca/lowcarbonfuels/" rel="noopener noreferrer" target="_blank">here</a></p>
      </div>
    );
  }

  static render500Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>We&apos;re sorry.</p>
        <p>It looks like our system is experiencing some technical difficulties. We have been
          notified and will look into it. Please try again later.
        </p>
      </div>
    );
  }

  static render502Message () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>We&apos;re sorry.</p>
        <p>It looks like our system is experiencing some technical difficulties. We have been
          notified and will look into it. Please try again later.
        </p>
      </div>
    );
  }

  static renderDefaultMessage () {
    return (
      <div className="alert alert-danger error-alert" role="alert">
        <p>Server Error!</p>
        <p>An API error occurred.</p>
      </div>
    );
  }

  render () {
    switch (this.props.statusCode) {
      case 401:
        return StatusInterceptor.render401Message();
      case 403:
        return StatusInterceptor.render403Message();
      case 404:
        return StatusInterceptor.render404Message();
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
