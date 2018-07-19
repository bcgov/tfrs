import React from 'react';
import PropTypes from 'prop-types';

import CreditTradeHistoryTable from './CreditTradeHistoryTable';
import Loading from '../../../app/components/Loading';

const CreditTradeHistoryPage = (props) => {
  const { isFetching, items } = props.data;

  return (
    <div className="page_historical_data_entry">
      <h1>User Activity</h1>

      {isFetching && <Loading />}
      {!isFetching &&
      <CreditTradeHistoryTable
        items={items}
      />
      }
    </div>
  );
};

CreditTradeHistoryPage.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

export default CreditTradeHistoryPage;
