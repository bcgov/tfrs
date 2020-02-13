import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';
import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ComplianceReports = (props) => {
  const { isFetching, items } = props.complianceReports;

  if (isFetching) {
    return <Loading />;
  }

  const awaitingReview = {
    complianceReports: {
      analyst: 0,
      director: 0,
      manager: 0,
      total: 0
    },
    exclusionReports: {
      analyst: 0,
      director: 0,
      manager: 0,
      total: 0
    }
  };

  items.forEach((item) => {
    let { status } = item;
    const { supplementalReports, type } = item;
    const reportType = (type === 'Compliance Report') ? 'complianceReports' : 'exclusionReports';

    if (supplementalReports.length > 0) {
      let [deepestSupplementalReport] = supplementalReports;

      while (deepestSupplementalReport.supplementalReports &&
        deepestSupplementalReport.supplementalReports.length > 0) {
        [deepestSupplementalReport] = deepestSupplementalReport.supplementalReports;
      }
      ({ status } = deepestSupplementalReport);
    }

    if (status.fuelSupplierStatus === 'Submitted' && status.analystStatus === 'Unreviewed') {
      awaitingReview[reportType].analyst += 1;
      awaitingReview[reportType].total += 1;
    }

    if (['Not Recommended', 'Recommended'].indexOf(status.analystStatus) >= 0 &&
    status.managerStatus === 'Unreviewed') {
      awaitingReview[reportType].manager += 1;
      awaitingReview[reportType].total += 1;
    }

    if (['Not Recommended', 'Recommended'].indexOf(status.managerStatus) >= 0 &&
    status.directorStatus === 'Unreviewed') {
      awaitingReview[reportType].director += 1;
      awaitingReview[reportType].total += 1;
    }
  });

  return (
    <div className="dashboard-fieldset">
      <h1>Compliance &amp; Exclusion Reports</h1>
      There are:

      <div>
        <div className="value">
          {awaitingReview.complianceReports.total}
        </div>
        <div className="content">
          <h2>compliance reports in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.analyst} awaiting government analyst review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Analyst'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.manager} awaiting compliance manager review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Manager'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.director} awaiting Director review
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="value">
          {awaitingReview.exclusionReports.total}
        </div>
        <div className="content">
          <h2>exclusion reports in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.analyst} awaiting government analyst review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Analyst'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.manager} awaiting compliance manager review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Manager'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.director} awaiting Director review
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="content">
          <h2>View all reports:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear();

                props.setFilter([{
                  id: 'compliance-period',
                  value: currentYear.toString()
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              Current compliance period
            </button>
            {` | `}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              All/historical
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ComplianceReports.defaultProps = {
};

ComplianceReports.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ComplianceReports;
