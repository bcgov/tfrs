/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ComplianceReportIntro from './components/ComplianceReportIntro';

class ComplianceReportIntroContainer extends Component {
  constructor () {
    super();

    if (document.location.pathname.indexOf('/edit/') >= 0) {
      this.edit = true;
    } else {
      this.edit = false;
    }
  }

  componentDidMount () {
  }

  render () {
    const { id } = this.props.match.params;
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return (
      <ComplianceReportIntro
        activeTab="intro"
        compliancePeriod={period}
        edit={this.edit}
        id={id}
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
      id: PropTypes.string,
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
