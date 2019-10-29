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

      {props.loggedInUser.organization.actionsTypeDisplay !== 'None' && [
        <span key="credit-transactions-label">There are:</span>,
        <div key="credit-transactions">
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
                  value: 'Proposed,Signed'
                }], 'credit-transfers');

                return history.push(CREDIT_TRANSACTIONS.LIST);
              }}
              type="button"
            >
              Credit transfer(s) in progress
            </button>
          </div>
        </div>
      ]}

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
        <div className="content">
          <a
            href={ORGANIZATIONS.BULLETIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            Recognized Part 3 Fuel Suppliers
          </a>
          <a
            href={ORGANIZATIONS.BULLETIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={['far', 'file-pdf']} />
          </a>
        </div>
      </div>

      {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
      (props.loggedInUser.organization.statusDisplay === 'Active' ||
      (props.loggedInUser.organization.organizationBalance &&
      (props.loggedInUser.organization.organizationBalance.validatedCredits > 0))) &&
      <div className="add-button">
        <FontAwesomeIcon icon="play" /> {` `}
        <button
          onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
          type="button"
        >
          Start a new credit transfer proposal
        </button>
      </div>
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
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      actionsTypeDisplay: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default CreditTransactions;
