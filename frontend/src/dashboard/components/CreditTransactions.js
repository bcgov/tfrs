import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import history from '../../app/History';
import Loading from '../../app/components/Loading';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';

const CreditTransactions = (props) => {
  const { isFetching, items } = props.creditTransfers;

  if (isFetching) {
    return <Loading />;
  }

  const inProgress = {
    creditTransfers: {
      analyst: 0,
      director: 0,
      total: 0
    },
    part3Awards: {
      analyst: 0,
      director: 0,
      total: 0
    }
  };

  items.forEach((item) => {
    if (['Credit Reduction', 'Credit Validation', 'Part 3 Award'].indexOf(item.type.theType) >= 0) {
      if (item.status.status === 'Submitted') {
        inProgress.part3Awards.analyst += 1;
        inProgress.part3Awards.total += 1;
      }

      if (['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0) {
        inProgress.part3Awards.director += 1;
        inProgress.part3Awards.total += 1;
      }
    }

    if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
      if (item.status.status === 'Submitted') {
        inProgress.creditTransfers.analyst += 1;
        inProgress.creditTransfers.total += 1;
      }

      if (['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0) {
        inProgress.creditTransfers.director += 1;
        inProgress.creditTransfers.total += 1;
      }
    }
  });

  return (
    <div className="dashboard-fieldset">
      <h1>Credit Transactions</h1>
      There are:

      <div>
        <div className="value">
          {inProgress.creditTransfers.total}
        </div>

        <div className="content">
          <h2>credit transfers in progress:</h2>

          <div>
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
                  value: 'Signed 2/2'
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              {inProgress.creditTransfers.analyst} awaiting government analyst review
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
                  value: 'Credit Transfer'
                }, {
                  id: 'status',
                  value: 'Reviewed'
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              {inProgress.creditTransfers.director} awaiting Director review and statutory decision
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="value">
          {inProgress.part3Awards.total}
        </div>

        <div className="content">
          <h2>Part 3 Awards in progress:</h2>

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
              {inProgress.part3Awards.director} awaiting Director review
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="content offset-value">
          <h2>View all credit transactions:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear();

                props.setFilter([{
                  id: 'compliancePeriod',
                  value: currentYear.toString()
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              Current compliance period
            </button>
            {` | `}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              All/historical
            </button>
          </div>
          <div>&nbsp;</div>
          <div>
            <Link
              to={ORGANIZATIONS.LIST}
            >
              Fuel Supplier Organizations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

CreditTransactions.defaultProps = {
};

CreditTransactions.propTypes = {
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default CreditTransactions;
