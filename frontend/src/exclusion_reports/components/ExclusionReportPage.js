import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';
import history from '../../app/History';
import ExclusionReportTable from './ExclusionReportTable';

const ExclusionReportPage = (props) => {
  const { isFetching, items } = props.exclusionReports;
  const isEmpty = items.length === 0;

  return (
    <div className="page_exclusion_report">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <div className="btn-group">
            <button
              id="new-exclusion-report"
              className="btn btn-primary"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_EXCLUSION_REPORT}
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
                      const route = EXCLUSION_REPORTS.ADD.replace(':period', compliancePeriod.description)
                        .replace(':tab', 'intro');

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
      <ExclusionReportTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
        loggedInUser={props.loggedInUser}
      />
      }
    </div>
  );
};

ExclusionReportPage.defaultProps = {
};

ExclusionReportPage.propTypes = {
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  exclusionReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ExclusionReportPage;
