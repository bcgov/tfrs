import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import CarbonIntensityLimitsTable from './CarbonIntensityLimitsTable';

const ComplianceReportingPage = (props) => {
  const { isFetching, items } = props.carbonIntensityLimits;
  const isEmpty = items.length === 0;

  return (
    <div className="page-fuel-codes">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container" />
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <div className="row">
        <div className="col-md-6">
          <h2>Carbon Intensity Limits</h2>
          <CarbonIntensityLimitsTable
            items={items}
            isFetching={isFetching}
            isEmpty={isEmpty}
            loggedInUser={props.loggedInUser}
          />
        </div>
      </div>
      }
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
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ComplianceReportingPage;
