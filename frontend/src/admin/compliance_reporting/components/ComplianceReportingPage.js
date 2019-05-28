import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import CarbonIntensitiesTable from './CarbonIntensitiesTable';
import CarbonIntensityLimitsTable from './CarbonIntensityLimitsTable';
import EnergyEffectivenessRatiosTable from './EnergyEffectivenessRatiosTable';
import EnergyDensitiesTable from './EnergyDensitiesTable';
import FuelClassesTable from './FuelClassesTable';
import FuelTypesTable from './FuelTypesTable';
import CREDIT_CALCULATIONS from '../../../constants/routes/CreditCalculations';

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
              item.limits && (item.limits.diesel || item.limits.gasoline)
            ))}
            isFetching={props.carbonIntensityLimits.isFetching}
            isEmpty={
              props.carbonIntensityLimits.items &&
              props.carbonIntensityLimits.items.length === 0
            }
          />
        }
      </div>

      <div className="col-md-12 col-lg-6">
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
          />
        }
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 col-lg-6">
        <h2>Default Carbon Intensities</h2>
        {props.defaultCarbonIntensities.isFetching && <Loading />}
        {!props.defaultCarbonIntensities.isFetching &&
          <CarbonIntensitiesTable
            items={props.defaultCarbonIntensities.items.filter(item => (item.density))}
            isFetching={props.defaultCarbonIntensities.isFetching}
            isEmpty={
              props.defaultCarbonIntensities.items &&
              props.defaultCarbonIntensities.items.length === 0
            }
            stateKey="default-carbon-intensity"
            viewUrl={CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES_DETAILS}
          />
        }
      </div>

      <div className="col-md-12 col-lg-6">
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
          />
        }
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 col-lg-6">
        <h2>Petroleum-based Carbon Intensities</h2>
        {props.petroleumCarbonIntensities.isFetching && <Loading />}
        {!props.petroleumCarbonIntensities.isFetching &&
          <CarbonIntensitiesTable
            defaultPageSize={2}
            items={props.petroleumCarbonIntensities.items.filter(item => (item.density))}
            isFetching={props.petroleumCarbonIntensities.isFetching}
            isEmpty={
              props.petroleumCarbonIntensities.items &&
              props.petroleumCarbonIntensities.items.length === 0
            }
            pageSizeOptions={[2, 5, 10]}
            stateKey="petroleum-carbon-intensity"
            viewUrl={CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_DETAILS}
          />
        }
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 col-lg-6">
        <h2>Fuel Types</h2>
        {props.fuelTypes &&
          <FuelTypesTable
            items={props.fuelTypes}
            isEmpty={
              props.fuelTypes &&
              props.fuelTypes.length === 0
            }
          />
        }
      </div>

      <div className="col-md-12 col-lg-6">
        <h2>Fuel Classes</h2>
        {props.fuelTypes &&
          <FuelClassesTable
            items={props.fuelTypes}
            isEmpty={
              props.fuelTypes &&
              props.fuelTypes.length === 0
            }
          />
        }
      </div>
    </div>
  </div>
);

ComplianceReportingPage.defaultProps = {
  fuelTypes: []
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
  fuelTypes: PropTypes.arrayOf(PropTypes.shape),
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  petroleumCarbonIntensities: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ComplianceReportingPage;
