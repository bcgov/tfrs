import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import * as Routes from '../../constants/routes';
import { DEFAULT_ORGANIZATION } from '../../constants/values';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers;
  const isEmpty = items.length === 0;
  return (
    <div className="page_credit_transactions">
      <h3 className="credit_balance">
        Credit Balance: {numeral(props.loggedInUser.organizationBalance).format(NumberFormat.INT)}
      </h3>
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.organization &&
            props.loggedInUser.organization.id === DEFAULT_ORGANIZATION.id &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => history.push(Routes.CREDIT_TRANSACTIONS_ADD)}
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
    organizationBalance: PropTypes.number
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CreditTransactionsPage;
