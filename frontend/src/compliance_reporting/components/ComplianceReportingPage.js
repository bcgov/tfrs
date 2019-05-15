import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import history from '../../app/History';
import ComplianceReportingTable from './ComplianceReportingTable';

const ComplianceReportingPage = (props) => {
  const { isFetching, items } = props.complianceReports;
  const isEmpty = items.length === 0;
  const period = props.compliancePeriods[0] ? props.compliancePeriods[0].description : '';

  return (
    <div className="page-compliance-reporting">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <div className="btn-group">
            <button
              id="new-compliance-report"
              className="btn btn-primary"
              onClick={() => {
                const route = COMPLIANCE_REPORTING.ADD.replace(':period?', period);

                history.push(route);
              }}
              type="button"
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_COMPLIANCE_REPORT}
            </button>
            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="caret" />
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
              {props.compliancePeriods.map(compliancePeriod => (
                <li key={compliancePeriod.description}>
                  <button
                    onClick={() => {
                      const route = COMPLIANCE_REPORTING.ADD.replace(':period?', compliancePeriod.description);

                      history.push(route);
                    }}
                    type="button"
                  >
                    {compliancePeriod.description}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <ComplianceReportingTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
        loggedInUser={props.loggedInUser}
      />
      }
    </div>
  );
};

ComplianceReportingPage.defaultProps = {
};

ComplianceReportingPage.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ComplianceReportingPage;
