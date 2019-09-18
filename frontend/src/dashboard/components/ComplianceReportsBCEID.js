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
    if (item.type === 'Compliance Report') {
      if (item.status.fuelSupplierStatus === 'Draft') {
        awaitingReview.complianceReports.draft += 1;
        awaitingReview.complianceReports.total += 1;
      }

      if (item.status.fuelSupplierStatus === 'Submitted' &&
      ['Accepted', 'Rejected'].indexOf(item.status.directorStatus) < 0) {
        if (item.status.analystStatus === 'Requested Supplemental' ||
        item.status.managerStatus === 'Requested Supplemental') {
          awaitingReview.complianceReports.supplemental += 1;
        } else {
          awaitingReview.complianceReports.review += 1;
        }

        awaitingReview.complianceReports.total += 1;
      }
    }

    if (item.type === 'Exclusion Report') {
      if (item.status.fuelSupplierStatus === 'Draft') {
        awaitingReview.exclusionReports.draft += 1;
        awaitingReview.exclusionReports.total += 1;
      }

      if (item.status.fuelSupplierStatus === 'Submitted' &&
      ['Accepted', 'Rejected'].indexOf(item.status.directorStatus) < 0) {
        if (item.status.analystStatus === 'Requested Supplemental' ||
        item.status.managerStatus === 'Requested Supplemental') {
          awaitingReview.exclusionReports.supplemental += 1;
        } else {
          awaitingReview.exclusionReports.review += 1;
        }

        awaitingReview.exclusionReports.total += 1;
      }
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
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'status',
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
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'status',
                  value: 'Requested Supplemental'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports.supplemental} requested supplemental
            </button>
          </div>

          <div>{/* Awaiting Government Review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Compliance Report'
                }, {
                  id: 'status',
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
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'status',
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
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'status',
                  value: 'Requested Supplemental'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.supplemental} requested supplemental
            </button>
          </div>

          <div>{/* Awaiting Government Review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'type',
                  value: 'Exclusion Report'
                }, {
                  id: 'status',
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
        <FontAwesomeIcon icon="play" />
        {` Start a new `}
        <button type="button">
          compliance report
        </button>
        {` or `}
        <button type="button">
          exclusion report
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
