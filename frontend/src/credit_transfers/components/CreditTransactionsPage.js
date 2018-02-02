import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import CreditTransferTable from './CreditTransferTable';

import * as Routes from '../../constants/routes';

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers;
  const isEmpty = items.length === 0;
  return (
    <div className="page_credit_transactions">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <Link to={Routes.CREDIT_TRANSACTIONS_ADD}>Propose Trade</Link>
        </div>
      </div>
      <CreditTransferTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
    </div>
  );
};

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CreditTransactionsPage;
