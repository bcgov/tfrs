/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ComplianceReportingPage from './components/ComplianceReportingPage';

import AdminTabs from '../components/AdminTabs';
import {carbonIntensities} from "../../actions/carbonIntensities";

class ComplianceReportingContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.loadCarbonIntensities();
  }

  render () {
    return ([
      <AdminTabs
        active="compliance-reporting"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <ComplianceReportingPage
        carbonIntensities={this.props.carbonIntensities}
        carbonIntensityLimits={this.props.carbonIntensityLimits}
        energyDensities={this.props.energyDensities}
        energyEffectivenessRatios={this.props.energyEffectivenessRatios}
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
  carbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  carbonIntensityLimits: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  loadCarbonIntensities: PropTypes.func.isRequired,
  energyDensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  energyEffectivenessRatios: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loggedInUser: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  carbonIntensities: {
    isFetching: state.rootReducer.defaultCarbonIntensities.isFetching,
    items: state.rootReducer.defaultCarbonIntensities.items
  },
  carbonIntensityLimits: {
    isFetching: state.rootReducer.carbonIntensityLimits.isFetching,
    items: state.rootReducer.carbonIntensityLimits.items
  },
  energyDensities: {
    isFetching: state.rootReducer.energyDensities.isFetching,
    items: state.rootReducer.energyDensities.items
  },
  energyEffectivenessRatios: {
    isFetching: state.rootReducer.energyEffectivenessRatios.isFetching,
    items: state.rootReducer.energyEffectivenessRatios.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = {
  loadCarbonIntensities: carbonIntensities.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
