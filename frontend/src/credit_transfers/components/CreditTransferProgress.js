import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values';

class CreditTransferProgress extends Component {
  _addStepAccepted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.accepted.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.accepted.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.accepted.description}</span>
      </div>
    );
  }

  _addStepCompleted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id || this.props.status.id === CREDIT_TRANSFER_STATUS.completed.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.approved.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.approved.description}</span>
      </div>
    );
  }

  _addStepDraft () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.draft.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.draft.description}</span>
      </div>
    );
  }

  _addStepProposed () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.proposed.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.proposed.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.proposed.description}</span>
      </div>
    );
  }

  _addStepRecommended () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.recommendedForDecision.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.recommendedForDecision.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.recommendedForDecision.description}</span>
      </div>
    );
  }

  _addStepRescinded () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.rescinded.id) ? 'cancelled' : ''}`}
        key={CREDIT_TRANSFER_STATUS.rescinded.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.rescinded.description}</span>
      </div>
    );
  }

  _renderCreditTransfer () {
    const view = [];

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.rescinded.id) {
      view.push(this._addStepRescinded());
      return view;
    }

    view.push(this._addStepDraft());

    view.push(this._addStepProposed());
    view.push(this._addStepAccepted());
    view.push(this._addStepRecommended());
    view.push(this._addStepCompleted());

    return view;
  }

  _renderGovernmentTransfer () {
    const view = [];

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.rescinded.id) {
      view.push(this._addStepRescinded());
      return view;
    }

    view.push(this._addStepDraft());
    view.push(this._addStepRecommended());
    view.push(this._addStepCompleted());

    return view;
  }

  render () {
    return (
      <div className="credit-transfer-progress-bar">
        <div className="arrow-steps clearfix">
          {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id]
            .includes(this.props.type.id)
            ? this._renderCreditTransfer()
            : this._renderGovernmentTransfer()
          }
        </div>
      </div>
    );
  }
}

CreditTransferProgress.defaultProps = {
  status: {
    id: 0,
    status: ''
  },
  type: {
    id: CREDIT_TRANSFER_TYPES.sell.id,
    theType: 'Credit Transfer'
  }
};

CreditTransferProgress.propTypes = {
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }),
  type: PropTypes.shape({
    id: PropTypes.number,
    theType: PropTypes.string
  })
};

export default CreditTransferProgress;
