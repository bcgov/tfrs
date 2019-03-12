/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';

const LinkedCreditTransactions = props => (
  <div className="linked-credit-transactions">
    <div className="row">
      <div className="col-xs-2 header">ID</div>
      <div className="col-xs-4 header">Type</div>
      <div className="col-xs-4 status header">Status</div>
      <div className="col-xs-2 unlink header">Unlink</div>
    </div>
    {props.creditTrades.map(creditTrade => (
      <div className="row" key={creditTrade.id}>
        <div className="col-xs-2">
          <Link to={CREDIT_TRANSACTIONS.DETAILS.replace(':id', creditTrade.id)}>
            {creditTrade.id}
          </Link>
        </div>
        <div className="col-xs-4">{creditTrade.type.theType}</div>
        <div className="col-xs-4 status">{creditTrade.status.status}</div>
        <div className="col-xs-2 unlink">
          <button
            className="unlink-action text-danger"
            data-target="#confirmUnlink"
            data-toggle="modal"
            onClick={() => props.selectLinkIdForModal(creditTrade.id)}
            type="button"
          >
            <FontAwesomeIcon icon="unlink" />
          </button>
        </div>
      </div>
    ))}
  </div>
);

LinkedCreditTransactions.propTypes = {
  creditTrades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.shape(),
    type: PropTypes.shape()
  })).isRequired,
  selectLinkIdForModal: PropTypes.func.isRequired
};

export default LinkedCreditTransactions;
