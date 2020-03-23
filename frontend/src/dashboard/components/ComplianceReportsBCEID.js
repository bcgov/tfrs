import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loading from '../../app/components/Loading';
import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';

const ComplianceReportsBCEID = (props) => {
  const { isFetching, items } = props.complianceReports;

  if (isFetching) {
    return <Loading />;
  }

  const awaitingReview = {
    complianceReports: {
      draft: 0,
      review: 0,
      supplemental: 0,
      total: 0
    },
    exclusionReports: {
      draft: 0,
      review: 0,
      supplemental: 0,
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

    if (status.fuelSupplierStatus === 'Draft') {
      awaitingReview[reportType].draft += 1;
      awaitingReview[reportType].total += 1;
    }

    if (status.fuelSupplierStatus === 'Submitted' &&
    ['Accepted', 'Rejected'].indexOf(status.directorStatus) < 0) {
      if (status.analystStatus === 'Requested Supplemental' ||
      status.managerStatus === 'Requested Supplemental') {
        awaitingReview[reportType].supplemental += 1;
      } else {
        awaitingReview[reportType].review += 1;
      }

      awaitingReview[reportType].total += 1;
    }
  });

  return (
    <div className="dashboard-fieldset">
      <h1>Compliance &amp; Exclusion Reports</h1>
      {props.loggedInUser.organization.name} has:

      <div>
        <div className="value">
          {awaitingReview.complianceReports.total}
        </div>
        <div className="content">
          <h2>compliance reports:</h2>

          <div>{/* Draft */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Draft'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.draft} in draft
            </button>
          </div>

          <div>{/* Requested Supplemental */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Supplemental Requested'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.supplemental} supplemental requested
            </button>
          </div>

          <div>{/* Awaiting Government Review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.review} awaiting government review
            </button>
          </div>
        </div>
      </div>

      {/* Exclusion Report */}
      <div>
        <div className="value">
          {awaitingReview.exclusionReports.total}
        </div>
        <div className="content">
          <h2>exclusion reports in progress:</h2>

          <div>{/* Draft */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Draft'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.draft} in draft
            </button>
          </div>

          <div>{/* Requested Supplemental */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Supplemental Requested'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.supplemental} supplemental requested
            </button>
          </div>

          <div>{/* Awaiting Government Review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.review} awaiting government review
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

      {props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.MANAGE) &&
      <div className="add-button">
        <FontAwesomeIcon icon="play" /> {` `}
        <button
          onClick={() => (history.push(COMPLIANCE_REPORTING.LIST))}
          type="button"
        >
          Start a new compliance report or exclusion report
        </button>
      </div>
      }
    </div>
  );
};

ComplianceReportsBCEID.defaultProps = {
};

ComplianceReportsBCEID.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ComplianceReportsBCEID;
