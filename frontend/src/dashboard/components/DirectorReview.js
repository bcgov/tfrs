import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';
import history from '../../app/History';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';

const DirectorReview = (props) => {
  const {
    isFetching: fetchingComplianceReports,
    items: complianceReports
  } = props.complianceReports;

  const {
    isFetching: fetchingCreditTransfers,
    items: creditTransfers
  } = props.creditTransfers;

  if (fetchingComplianceReports || fetchingCreditTransfers) {
    return <Loading />;
  }

  const awaitingReview = {
    complianceReports: 0,
    creditTransfers: 0,
    exclusionReports: 0,
    part3Awards: 0,
    total: 0
  };

  complianceReports.forEach((item) => {
    if (['Not Recommended', 'Recommended'].indexOf(item.status.managerStatus) >= 0 &&
    item.status.directorStatus === 'Unreviewed') {
      if (item.type === 'Compliance Report') {
        awaitingReview.complianceReports += 1;
        awaitingReview.total += 1;
      }

      if (item.type === 'Exclusion Report') {
        awaitingReview.exclusionReports += 1;
        awaitingReview.total += 1;
      }
    }
  });

  creditTransfers.forEach((item) => {
    if (['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0) {
      if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
        awaitingReview.creditTransfers += 1;
        awaitingReview.total += 1;
      }

      if (['Part 3 Award'].indexOf(item.type.theType) >= 0) {
        awaitingReview.part3Awards += 1;
        awaitingReview.total += 1;
      }
    }
  });

  return (
    <div className="dashboard-fieldset">
      <h1>Director Review</h1>
      There are:

      <div>
        <div className="value">
          {awaitingReview.total}
        </div>
        <div className="content">
          <h2>item(s) in progress for your action:</h2>

          <div>{/* Credit transfers awaiting review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }, {
                  id: 'transactionType',
                  value: 'Credit Transfer'
                }, {
                  id: 'status',
                  value: 'Reviewed'
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              {`${awaitingReview.creditTransfers} `}
              credit transfer(s) for your review and statutory decision
            </button>
          </div>

          <div>{/* Compliance Reports awaiting review */}
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
                  value: 'Manager'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.complianceReports} compliance report(s) awaiting your review
            </button>
          </div>

          <div>{/* Exclusion Reports awaiting review */}
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
                  value: 'Manager'
                }], 'compliance-reporting');

                return history.push(COMPLIANCE_REPORTING.LIST);
              }}
              type="button"
            >
              {awaitingReview.exclusionReports} exclusion report(s) awaiting your review
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }, {
                  id: 'transactionType',
                  value: 'Part 3 Award'
                }, {
                  id: 'status',
                  value: 'Reviewed'
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              {awaitingReview.part3Awards} Part 3 Award(s) awaiting Director review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DirectorReview.defaultProps = {
};

DirectorReview.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default DirectorReview;
