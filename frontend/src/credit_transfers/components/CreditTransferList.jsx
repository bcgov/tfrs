/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

const CreditTransferList = (props) => {
  const tableClass = `table table-striped table-bordered table-hover table-condensed ${(props.isEmpty) ? 'hidden' : ''}`;
  const emptyDivClass = `mt-3${((props.isEmpty && !props.isFetching) ? '' : ' hidden')}`;
  return (
    <div>
      <div className={emptyDivClass}>No results found</div>
      <table className={tableClass}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Credits</th>
            <th>Value Per Credit</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map(item => (
            <tr key={item.id}>
              <td>{item.creditsFrom.name}</td>
              <td>{item.creditsTo.name}</td>
              <td>{item.numberOfCredits}</td>
              <td>{item.fairMarketValuePerCredit}</td>
              <td>{item.numberOfCredits * item.fairMarketValuePerCredit}</td>
              <td>{item.status.status}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
};

CreditTransferList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default CreditTransferList;
