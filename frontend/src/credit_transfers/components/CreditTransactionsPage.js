import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers;
  const isEmpty = items.length === 0;
  return (
    <div className="page_credit_transactions">
      {props.loggedInUser.role &&
        !props.loggedInUser.role.isGovernmentRole &&
        <h3 className="credit_balance">
          Credit Balance: {numeral(props.loggedInUser.organizationBalance).format(NumberFormat.INT)}
        </h3>
      }
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.role &&
            !props.loggedInUser.role.isGovernmentRole &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
            >
              Propose Trade
            </button>
          }
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <CreditTransferTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  );
};

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    organizationBalance: PropTypes.number,
    role: PropTypes.shape({
      id: PropTypes.number,
      isGovernmentRole: PropTypes.bool
    })
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CreditTransactionsPage;
