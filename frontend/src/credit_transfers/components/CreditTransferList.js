/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import moment from 'moment';
import { Link } from 'react-router-dom';

import * as Routes from '../../constants/routes';

const CreditTransferList = (props) => {
  const tableClass = `table table-striped table-bordered table-hover table-condensed ${(props.isEmpty) ? 'hidden' : ''}`;
  const emptyDivClass = `mt-3${((props.isEmpty && !props.isFetching) ? '' : ' hidden')}`;
  return (
    <div>
      <div className={emptyDivClass}>No results found</div>
      <table className={tableClass}>
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Credits</th>
            <th>Value Per Credit</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Last Updated On</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {props.items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.creditsFrom.name}</td>
              <td>{item.creditsTo.name}</td>
              <td align="right">{item.numberOfCredits}</td>
              <td align="right">
                <FormattedNumber value={item.fairMarketValuePerCredit} style="currency" currency="CAD" />
              </td>
              <td align="right">
                <FormattedNumber value={item.numberOfCredits * item.fairMarketValuePerCredit} style="currency" currency="CAD" />
              </td>
              <td>{item.status.status}</td>
              <td>{moment(item.updateTimestamp).format('LL')}</td>
              <td>
                <Link to={Routes.CREDIT_TRANSACTION_DETAILS + item.id}>View</Link>
              </td>
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
