/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ComplianceReportingPage from './components/ComplianceReportingPage';

import AdminTabs from '../components/AdminTabs';
import { carbonIntensities } from '../../actions/carbonIntensities';
import { defaultCarbonIntensities } from '../../actions/defaultCarbonIntensities';
import { energyDensities } from '../../actions/energyDensities';
import { energyEffectivenessRatios } from '../../actions/energyEffectivenessRatios';

class ComplianceReportingContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.props.loadCarbonIntensities();
    this.props.loadDefaultCarbonIntensities();
    this.props.loadEnergyDensities();
    this.props.loadEnergyEffectivenessRatios();
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
        defaultCarbonIntensities={this.props.defaultCarbonIntensities}
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
  carbonIntensityLimits: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  defaultCarbonIntensities: PropTypes.shape({
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
  loggedInUser: PropTypes.shape().isRequired,
  loadCarbonIntensities: PropTypes.func.isRequired,
  loadDefaultCarbonIntensities: PropTypes.func.isRequired,
  loadEnergyDensities: PropTypes.func.isRequired,
  loadEnergyEffectivenessRatios: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  carbonIntensityLimits: {
    isFetching: state.rootReducer.carbonIntensityLimits.isFetching,
    items: state.rootReducer.carbonIntensityLimits.items
  },
  defaultCarbonIntensities: {
    isFetching: state.rootReducer.defaultCarbonIntensities.isFetching,
    items: state.rootReducer.defaultCarbonIntensities.items
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
  loadCarbonIntensities: carbonIntensities.find,
  loadEnergyDensities: energyDensities.find,
  loadDefaultCarbonIntensities: defaultCarbonIntensities.find,
  loadEnergyEffectivenessRatios: energyEffectivenessRatios.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer);
