/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ComplianceReportingPage from './components/ComplianceReportingPage'

import AdminTabs from '../components/AdminTabs'
import { carbonIntensities } from '../../actions/carbonIntensities'
import { defaultCarbonIntensities } from '../../actions/defaultCarbonIntensities'
import { energyDensities } from '../../actions/energyDensities'
import { energyEffectivenessRatios } from '../../actions/energyEffectivenessRatios'
import { petroleumCarbonIntensities } from '../../actions/petroleumCarbonIntensities'

const ComplianceReportingContainer = props => {
  console.log(props,'2020')
  useEffect(() => {
    props.loadCarbonIntensities()
    props.loadDefaultCarbonIntensities()
    props.loadEnergyDensities()
    props.loadEnergyEffectivenessRatios()
    props.loadPetroleumCarbonIntensities()
  }, [])

  return ([
    <AdminTabs
      active="compliance-reporting"
      key="nav"
      loggedInUser={props.loggedInUser}
    />,
    <ComplianceReportingPage
      carbonIntensityLimits={props.carbonIntensityLimits}
      defaultCarbonIntensities={props.defaultCarbonIntensities}
      energyDensities={props.energyDensities}
      energyEffectivenessRatios={props.energyEffectivenessRatios}
      fuelTypes={props.referenceData.approvedFuels}
      key="compliance-reporting"
      loggedInUser={props.loggedInUser}
      petroleumCarbonIntensities={props.petroleumCarbonIntensities}
      title="Compliance Reporting"
    />
  ])
}

ComplianceReportingContainer.defaultProps = {
}

ComplianceReportingContainer.propTypes = {
  carbonIntensityLimits: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  defaultCarbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
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
  loadEnergyEffectivenessRatios: PropTypes.func.isRequired,
  loadPetroleumCarbonIntensities: PropTypes.func.isRequired,
  petroleumCarbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
}

const mapStateToProps = state => ({
  carbonIntensityLimits: {
    isFetching: state.rootReducer.carbonIntensityLimits.isFinding,
    items: state.rootReducer.carbonIntensityLimits.items
  },
  defaultCarbonIntensities: {
    isFetching: state.rootReducer.defaultCarbonIntensities.isFinding,
    items: state.rootReducer.defaultCarbonIntensities.items
  },
  energyDensities: {
    isFetching: state.rootReducer.energyDensities.isFinding,
    items: state.rootReducer.energyDensities.items
  },
  energyEffectivenessRatios: {
    isFetching: state.rootReducer.energyEffectivenessRatios.isFinding,
    items: state.rootReducer.energyEffectivenessRatios.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  petroleumCarbonIntensities: {
    isFetching: state.rootReducer.petroleumCarbonIntensities.isFinding,
    items: state.rootReducer.petroleumCarbonIntensities.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
})

const mapDispatchToProps = {
  loadCarbonIntensities: carbonIntensities.find,
  loadEnergyDensities: energyDensities.find,
  loadDefaultCarbonIntensities: defaultCarbonIntensities.find,
  loadEnergyEffectivenessRatios: energyEffectivenessRatios.find,
  loadPetroleumCarbonIntensities: petroleumCarbonIntensities.find
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceReportingContainer)
