import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import CarbonIntensityLimitsTable from './CarbonIntensityLimitsTable';
import EnergyEffectivenessRatiosTable from './EnergyEffectivenessRatiosTable';

const ComplianceReportingPage = (props) => {
  return (
    <div className="page-compliance-reporting">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container" />
      </div>
      <div className="row">
        <div className="col-md-6">
          {props.carbonIntensityLimits.isFetching && <Loading />}
          {!props.carbonIntensityLimits.isFetching && [
            <h2 key="carbon-intensity-limits-header">Carbon Intensity Limits</h2>,
            <CarbonIntensityLimitsTable
              items={props.carbonIntensityLimits.items}
              isFetching={props.carbonIntensityLimits.isFetching}
              isEmpty={
                props.carbonIntensityLimits.items &&
                props.carbonIntensityLimits.items.length === 0
              }
              key="carbon-intensity-limits"
              loggedInUser={props.loggedInUser}
            />
          ]}
        </div>
        <div className="col-md-6">
          {props.energyEffectivenessRatios.isFetching && <Loading />}
          {!props.energyEffectivenessRatios.isFetching && [
            <h2 key="carbon-intensity-limits-header">Carbon Intensity Limits</h2>,
            <EnergyEffectivenessRatiosTable
              items={props.energyEffectivenessRatios.items}
              isFetching={props.energyEffectivenessRatios.isFetching}
              isEmpty={
                props.energyEffectivenessRatios.items &&
                props.energyEffectivenessRatios.items.length === 0
              }
              key="carbon-intensity-limits"
              loggedInUser={props.loggedInUser}
            />
          ]}
        </div>
      </div>
    </div>
  );
};

ComplianceReportingPage.defaultProps = {
};

ComplianceReportingPage.propTypes = {
  carbonIntensityLimits: PropTypes.shape({
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
