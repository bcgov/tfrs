import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';

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

          <div><a href="">{inProgress.creditTransfers.analyst} awaiting government analyst review</a></div>
          <div><a href="">{inProgress.creditTransfers.director} awaiting Director review and statutory decision</a></div>
        </div>
      </div>

      <div>
        <div className="value">
          {inProgress.part3Awards.total}
        </div>

        <div className="content">
          <h2>Part 3 Awards in progress:</h2>

          <div><a href="">{inProgress.part3Awards.analyst} awaiting government analyst review</a></div>
          <div><a href="">{inProgress.part3Awards.director} awaiting Director review</a></div>
        </div>
      </div>

      <div>
        <div className="content offset-value">
          <h2>View all credit transactions:</h2>

          <div><a href="">Current compliance period</a> | <a href="">All/historical</a></div>
          <div>&nbsp;</div>
          <div><a href="">Fuel Supplier Organizations</a></div>
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
  }).isRequired
};

export default CreditTransactions;
