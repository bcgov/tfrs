import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values';

class CreditTransferProgress extends Component {
  static addStepRescinded () {
    return (
      <div
        className="step cancelled"
        key={CREDIT_TRANSFER_STATUS.rescinded.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.rescinded.description}</span>
      </div>
    );
  }

  _addStepAccepted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.accepted.id &&
          !this.props.rescinded)
          ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.accepted.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.accepted.description}</span>
      </div>
    );
  }

  _addStepCompleted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id ||
          this.props.status.id === CREDIT_TRANSFER_STATUS.completed.id)
          ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.approved.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.approved.description}</span>
      </div>
    );
  }

  _addStepDraft () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id)
          ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.draft.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.draft.description}</span>
      </div>
    );
  }

  _addStepNotRecommended () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id &&
          !this.props.rescinded)
          ? 'cancelled' : ''}`}
        key={CREDIT_TRANSFER_STATUS.notRecommended.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.notRecommended.description}</span>
      </div>
    );
  }

  _addStepProposed () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.proposed.id &&
          !this.props.rescinded)
          ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.proposed.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.proposed.description}</span>
      </div>
    );
  }

  _addStepRecommended () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.recommendedForDecision.id &&
          !this.props.rescinded)
          ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.recommendedForDecision.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.recommendedForDecision.description}</span>
      </div>
    );
  }

  _addStepRefused () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id &&
          !this.props.rescinded)
          ? 'danger' : ''}`}
        key={CREDIT_TRANSFER_STATUS.refused.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.refused.description}</span>
      </div>
    );
  }

  _renderCreditTransfer () {
    const view = [];

    view.push(this._addStepDraft());

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id &&
      this.props.rescinded) {
      view.push(CreditTransferProgress.addStepRescinded());
      return view;
    }

    view.push(this._addStepProposed());

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.proposed.id &&
      this.props.rescinded) {
      view.push(CreditTransferProgress.addStepRescinded());
      return view;
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) {
      view.push(this._addStepRefused());
    } else {
      view.push(this._addStepAccepted());
    }

    if ((this.props.status.id === CREDIT_TRANSFER_STATUS.accepted.id ||
      this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) &&
      this.props.rescinded) {
      view.push(CreditTransferProgress.addStepRescinded());
      return view;
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id) {
      view.push(this._addStepNotRecommended());
    } else {
      view.push(this._addStepRecommended());
    }

    if ((this.props.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id ||
      this.props.status.id === CREDIT_TRANSFER_STATUS.recommendedForDecision.id) &&
      this.props.rescinded) {
      view.push(CreditTransferProgress.addStepRescinded());
      return view;
    }

    view.push(this._addStepCompleted());

    return view;
  }

  _renderGovernmentTransfer () {
    const view = [];

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.rescinded.id) {
      view.push(CreditTransferProgress.addStepRescinded());
      return view;
    }

    view.push(this._addStepDraft());
    view.push(this._addStepRecommended());
    view.push(this._addStepCompleted());

    return view;
  }

  render () {
    if ([
      CREDIT_TRANSFER_TYPES.buy.id,
      CREDIT_TRANSFER_TYPES.sell.id
    ].includes(this.props.type.id)) {
      return (
        <div className="credit-transfer-progress-bar">
          <div className="arrow-steps clearfix">
            {this._renderCreditTransfer()}
          </div>
        </div>
      );
    }

    return (
      <div className="credit-transfer-progress-bar pvr">
        <div className="arrow-steps clearfix">
          {this._renderGovernmentTransfer()}
        </div>
      </div>
    );
  }
}

CreditTransferProgress.defaultProps = {
  rescinded: false,
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
  rescinded: PropTypes.bool,
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
