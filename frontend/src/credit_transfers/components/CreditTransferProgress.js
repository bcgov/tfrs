import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

const CreditTransferProgress = props => (
  <div className="credit-transfer-progress-bar">
    <div className="arrow-steps clearfix">
      <div
        className={`step ${(props.status.id === CREDIT_TRANSFER_STATUS.draft.id) ? 'current' : ''}`}
      >
        <span>{CREDIT_TRANSFER_STATUS.draft.description}</span>
      </div>
      <div
        className={`step ${(props.status.id === CREDIT_TRANSFER_STATUS.proposed.id) ? 'current' : ''}`}
      >
        <span>{CREDIT_TRANSFER_STATUS.proposed.description}</span>
      </div>
      <div
        className={`step ${(props.status.id === CREDIT_TRANSFER_STATUS.accepted.id) ? 'current' : ''}`}
      >
        <span>{CREDIT_TRANSFER_STATUS.accepted.description}</span>
      </div>
      <div
        className={`step ${(props.status.id === CREDIT_TRANSFER_STATUS.approved.id) ? 'current' : ''}`}
      >
        <span>{CREDIT_TRANSFER_STATUS.approved.description}</span>
      </div>
      <div
        className={`step ${(props.status.id === CREDIT_TRANSFER_STATUS.completed.id) ? 'current' : ''}`}
      >
        <span>{CREDIT_TRANSFER_STATUS.completed.description}</span>
      </div>
    </div>
  </div>
);

CreditTransferProgress.defaultProps = {
  status: {
    id: 0,
    status: ''
  }
};

CreditTransferProgress.propTypes = {
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  })
};

export default CreditTransferProgress;
