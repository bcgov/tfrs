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
        active="fuel-codes"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <ComplianceReportingPage
        carbonIntensityLimits={{
          items: [{
            compliancePeriod: {
              id: 1,
              description: '2017'
            },
            dieselClassLimit: '90.02',
            gasolineClassLimit: '83.74'
          }, {
            compliancePeriod: {
              id: 2,
              description: '2018'
            },
            dieselClassLimit: '88.60',
            gasolineClassLimit: '82.41'
          }],
          isFetching: false
        }}
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
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
