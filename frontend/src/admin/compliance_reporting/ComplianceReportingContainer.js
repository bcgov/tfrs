/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ComplianceReportingPage from './components/ComplianceReportingPage';

import AdminTabs from '../components/AdminTabs';

class ComplianceReportingContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  render () {
    return ([
      <AdminTabs
        active="compliance-reporting"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <ComplianceReportingPage
        carbonIntensityLimits={this.props.carbonIntensityLimits}
        key="compliance-reporting"
        loggedInUser={this.props.loggedInUser}
        title="Compliance Reporting"
      />
    ]);
  }
}

ComplianceReportingContainer.defaultProps = {
};

ComplianceReportingContainer.propTypes = {
  carbonIntensityLimits: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  carbonIntensityLimits: {
    isFetching: state.rootReducer.carbonIntensityLimits.isFetching,
    items: state.rootReducer.carbonIntensityLimits.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
