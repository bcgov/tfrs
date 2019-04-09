import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import CarbonIntensitiesTable from './CarbonIntensitiesTable';
import CarbonIntensityLimitsTable from './CarbonIntensityLimitsTable';
import EnergyEffectivenessRatiosTable from './EnergyEffectivenessRatiosTable';
import EnergyDensitiesTable from './EnergyDensitiesTable';

const ComplianceReportingPage = props => (
  <div className="page-compliance-reporting">
    <h1>{props.title}</h1>
    <div className="right-toolbar-container">
      <div className="actions-container" />
    </div>
    <div className="row">
      <div className="col-md-6">
        <h2>Carbon Intensity Limits</h2>
        {props.carbonIntensityLimits.isFetching && <Loading />}
        {!props.carbonIntensityLimits.isFetching &&
          <CarbonIntensityLimitsTable
            items={props.carbonIntensityLimits.items}
            isFetching={props.carbonIntensityLimits.isFetching}
            isEmpty={
              props.carbonIntensityLimits.items &&
              props.carbonIntensityLimits.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>

      <div className="col-md-6">
        <h2>Energy Effectiveness Ratio</h2>
        {props.energyEffectivenessRatios.isFetching && <Loading />}
        {!props.energyEffectivenessRatios.isFetching &&
          <EnergyEffectivenessRatiosTable
            items={props.energyEffectivenessRatios.items}
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
      <div className="col-xs-12">&nbsp;</div>
    </div>

    <div className="row">
      <div className="col-md-6">
        <h2>Carbon Intensities</h2>
        {props.carbonIntensities.isFetching && <Loading />}
        {!props.carbonIntensities.isFetching &&
          <CarbonIntensitiesTable
            items={props.carbonIntensities.items}
            isFetching={props.carbonIntensities.isFetching}
            isEmpty={
              props.carbonIntensities.items &&
              props.carbonIntensities.items.length === 0
            }
            loggedInUser={props.loggedInUser}
          />
        }
      </div>

      <div className="col-md-6">
        <h2>Energy Densities</h2>
        {props.energyDensities.isFetching && <Loading />}
        {!props.energyDensities.isFetching &&
          <EnergyDensitiesTable
            items={props.energyDensities.items}
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
  carbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  carbonIntensityLimits: PropTypes.shape({
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
