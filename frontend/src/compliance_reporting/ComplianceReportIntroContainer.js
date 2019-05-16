/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ComplianceReportIntro from './components/ComplianceReportIntro';

class ComplianceReportIntroContainer extends Component {
  componentDidMount () {
  }

  render () {
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return (
      <ComplianceReportIntro
        activeTab="intro"
        compliancePeriod={period}
        loggedInUser={this.props.loggedInUser}
        title="Compliance Reporting"
      />
    );
  }
}

ComplianceReportIntroContainer.defaultProps = {
};

ComplianceReportIntroContainer.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      period: PropTypes.string
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportIntroContainer);
