/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import { getCreditTransferType } from '../../actions/creditTransfersActions';
import Errors from '../../app/components/Errors';
import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';

const CreditTransactionRequestDetails = props => (
  <div className="credit-transaction-details">
    {props.isFetching && <Loading />}
    {!props.isFetching &&
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-12">
              <label>
                Compliance Period:
                <span className="value"></span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label>
                Milestone ID:
                <span className="value"></span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label>
                Agreement Name:
                <span className="value"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-6">
          <label>
            Files:
          </label>
        </div>
      </div>
    }
  </div>
);

CreditTransactionRequestDetails.defaultProps = {
  errors: {},
  id: 0,
  status: {
    id: 0,
    status: ''
  }
};

CreditTransactionRequestDetails.propTypes = {
  changeStatus: PropTypes.func.isRequired,
  errors: PropTypes.shape(),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  id: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }),
  toggleCheck: PropTypes.func.isRequired
};

export default CreditTransactionRequestDetails;
