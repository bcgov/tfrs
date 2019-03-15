/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { getCreditTransferType } from '../../actions/creditTransfersActions';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

const LinkedCreditTransactions = props => (
  <div className="linked-credit-transactions">
    <div className="row">
      <div className="col-xs-2 header">ID</div>
      <div className="col-xs-4 header">Type</div>
      <div className="col-xs-4 status header">Status</div>
      {props.canLink &&
        <div className="col-xs-2 unlink header">Unlink</div>
      }
    </div>
    {props.creditTrades.map(creditTrade => (
      <div className="row" key={creditTrade.id}>
        <div className="col-xs-2">
          <Link to={CREDIT_TRANSACTIONS.DETAILS.replace(':id', creditTrade.id)}>
            {creditTrade.id}
          </Link>
        </div>
        <div className="col-xs-4">{getCreditTransferType(creditTrade.type.id)}</div>
        <div className="col-xs-4 status">{Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === creditTrade.status.id).description}</div>
        {props.canLink &&
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
        }
      </div>
    ))}
  </div>
);

LinkedCreditTransactions.propTypes = {
  canLink: PropTypes.bool.isRequired,
  creditTrades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.shape(),
    type: PropTypes.shape()
  })).isRequired,
  selectLinkIdForModal: PropTypes.func.isRequired
};

export default LinkedCreditTransactions;
