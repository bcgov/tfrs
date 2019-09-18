import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import Loading from '../../app/components/Loading';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';

const CreditTransactions = (props) => {
  const { isFetching, items } = props.creditTransfers;

  if (isFetching) {
    return <Loading />;
  }

  const inProgress = {
    creditTransfers: 0
  };

  items.forEach((item) => {
    if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
      if (!item.isRescinded && ['Accepted', 'Submitted'].indexOf(item.status.status) >= 0) {
        inProgress.creditTransfers += 1;
      }
    }
  });

  return (
    <div className="dashboard-fieldset">
      <h1>Credit Transactions</h1>
      There are:

      <div>
        <div className="value">
          {inProgress.creditTransfers}
        </div>

        <div className="content">
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
                value: 'Signed'
              }], 'credit-transfers');

              return history.push(CREDIT_TRANSACTIONS.LIST);
            }}
            type="button"
          >
            Credit transfer(s) in progress
          </button>
        </div>
      </div>

      <div>
        <div className="content">
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
        </div>
      </div>

      <div>
        <div className="value">
          <FontAwesomeIcon icon={['far', 'file-pdf']} />
        </div>
        <div className="content">
          <a
            href={ORGANIZATIONS.BULLETIN}
            key="bulletin"
            rel="noopener noreferrer"
            target="_blank"
          >
            Part 3 Fuel Suppliers Report (PDF)
          </a>
        </div>
      </div>

      {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
        <button className="add-button" type="button">
          <FontAwesomeIcon icon="play" /> Start a new credit transfer proposal
        </button>
      }
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
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default CreditTransactions;
