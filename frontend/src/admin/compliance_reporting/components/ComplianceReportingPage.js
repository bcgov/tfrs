import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import DefaultCarbonIntensitiesTable from './DefaultCarbonIntensitiesTable';
import CarbonIntensityLimitsTable from './CarbonIntensityLimitsTable';
import EnergyEffectivenessRatiosTable from './EnergyEffectivenessRatiosTable';
import EnergyDensitiesTable from './EnergyDensitiesTable';
import CONFIG from '../../../config';

const ComplianceReportingPage = props => (
  <div className="page-compliance-reporting">
    <h1>{props.title}</h1>
    <div className="right-toolbar-container">
      <div className="actions-container" />
    </div>
    <div className="row">
      <div className="col-md-12 col-lg-6">
        <h2>Carbon Intensity Limits</h2>
        {props.carbonIntensityLimits.isFetching && <Loading />}
        {!props.carbonIntensityLimits.isFetching &&
          <CarbonIntensityLimitsTable
            items={props.carbonIntensityLimits.items.filter(item => (
              item.description >= CONFIG.COMPLIANCE_REPORTING.STARTING_YEAR
            ))}
            isFetching={props.carbonIntensityLimits.isFetching}
            isEmpty={
              props.carbonIntensityLimits.items &&
              props.carbonIntensityLimits.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>

      <div className="col-md-12 col-lg-6">
        <h2>Energy Effectiveness Ratio</h2>
        {props.energyEffectivenessRatios.isFetching && <Loading />}
        {!props.energyEffectivenessRatios.isFetching &&
          <EnergyEffectivenessRatiosTable
            items={props.energyEffectivenessRatios.items.filter(item => (
              (item.energyEffectivenessRatio.gasoline &&
                item.energyEffectivenessRatio.gasoline.ratio) ||
              (item.energyEffectivenessRatio.diesel &&
                item.energyEffectivenessRatio.diesel.ratio)
            ))}
            isFetching={props.energyEffectivenessRatios.isFetching}
            isEmpty={
              props.energyEffectivenessRatios.items &&
              props.energyEffectivenessRatios.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 col-lg-6">
        <h2>Default Carbon Intensities</h2>
        {props.defaultCarbonIntensities.isFetching && <Loading />}
        {!props.defaultCarbonIntensities.isFetching &&
          <DefaultCarbonIntensitiesTable
            items={props.defaultCarbonIntensities.items.filter(item => item.carbonIntensity)}
            isFetching={props.defaultCarbonIntensities.isFetching}
            isEmpty={
              props.defaultCarbonIntensities.items &&
              props.defaultCarbonIntensities.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>

      <div className="col-md-12 col-lg-6">
        <h2>Energy Densities</h2>
        {props.energyDensities.isFetching && <Loading />}
        {!props.energyDensities.isFetching &&
          <EnergyDensitiesTable
            items={props.energyDensities.items.filter(item =>
              item.energyDensity && item.energyDensity.density)}
            isFetching={props.energyDensities.isFetching}
            isEmpty={
              props.energyDensities.items &&
              props.energyDensities.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>
    </div>
  </div>
);

ComplianceReportingPage.defaultProps = {
};

ComplianceReportingPage.propTypes = {
  carbonIntensityLimits: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  defaultCarbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  energyDensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  energyEffectivenessRatios: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ComplianceReportingPage;
