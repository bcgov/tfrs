/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ComplianceReportIntro from './components/ComplianceReportIntro';

class ComplianceReportIntroContainer extends Component {
  render () {
    return (
      <ComplianceReportIntro
        activeTab="intro"
        period={this.props.period}
        edit={this.props.edit}
        loggedInUser={this.props.loggedInUser}
        title="Compliance Reporting"
        saving={this.props.saving}
      />
    );
  }
}

ComplianceReportIntroContainer.defaultProps = {
};

ComplianceReportIntroContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

export default connect(mapStateToProps, null)(ComplianceReportIntroContainer);
