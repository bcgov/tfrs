import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import { transformTransactionStatusDesc } from '../../utils/functions'

class CreditTransferProgress extends Component {
  static addStepRescinded () {
    return (
      <div
        className="step current"
        key={CREDIT_TRANSFER_STATUS.rescinded.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.rescinded.description}</span>
      </div>
    )
  }

  _addStepAccepted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.accepted.id &&
          !this.props.isRescinded)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.accepted.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.accepted.description}</span>
      </div>
    )
  }

  _addStepCompleted () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.approved.id}
      >
        <span>{transformTransactionStatusDesc(CREDIT_TRANSFER_STATUS.approved.id, this.props.type.id, this.props.updateTimestamp)}</span>
      </div>
    )
  }

  _addStepDeclined () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id) ? 'current' : ''}`}
        key={CREDIT_TRANSFER_STATUS.declinedForApproval.id}
      >
        <span>{transformTransactionStatusDesc(CREDIT_TRANSFER_STATUS.declinedForApproval.id, this.props.type.id, this.props.updateTimestamp)}</span>
      </div>
    )
  }

  _addStepDraft () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.draft.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.draft.description}</span>
      </div>
    )
  }

  _addStepProposed () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.proposed.id &&
          !this.props.isRescinded)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.proposed.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.proposed.description}</span>
      </div>
    )
  }

  _addStepReviewed () {
    return (
      <div
        className={`step ${((this.props.status.id === CREDIT_TRANSFER_STATUS.recommendedForDecision.id ||
          this.props.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id) &&
          !this.props.isRescinded)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.recommendedForDecision.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.recommendedForDecision.description}</span>
      </div>
    )
  }

  _addStepRefused () {
    return (
      <div
        className={`step ${(this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id &&
          !this.props.isRescinded)
          ? 'current'
: ''}`}
        key={CREDIT_TRANSFER_STATUS.refused.id}
      >
        <span>{CREDIT_TRANSFER_STATUS.refused.description}</span>
      </div>
    )
  }

  _renderCreditTransfer () {
    const view = []

    view.push(this._addStepDraft())

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id &&
      this.props.isRescinded) {
      view.push(CreditTransferProgress.addStepRescinded())
    }

    view.push(this._addStepProposed())

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.proposed.id &&
      this.props.isRescinded) {
      view.push(CreditTransferProgress.addStepRescinded())
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) {
      view.push(this._addStepRefused())
    } else {
      view.push(this._addStepAccepted())
    }

    if ((this.props.status.id === CREDIT_TRANSFER_STATUS.accepted.id ||
      this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) &&
      this.props.isRescinded) {
      view.push(CreditTransferProgress.addStepRescinded())
    }

    view.push(this._addStepReviewed())

    if ((this.props.status.id === CREDIT_TRANSFER_STATUS.notRecommended.id ||
      this.props.status.id === CREDIT_TRANSFER_STATUS.recommendedForDecision.id) &&
      this.props.isRescinded) {
      view.push(CreditTransferProgress.addStepRescinded())
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id) {
      view.push(this._addStepDeclined())
    } else {
      view.push(this._addStepCompleted())
    }

    return view
  }

  _renderGovernmentTransfer () {
    const view = []

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.rescinded.id) {
      view.push(CreditTransferProgress.addStepRescinded())
      return view
    }

    view.push(this._addStepDraft())
    view.push(this._addStepReviewed())

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id) {
      view.push(this._addStepDeclined())
    } else {
      view.push(this._addStepCompleted())
    }

    return view
  }

  render () {
    if ([
      CREDIT_TRANSFER_TYPES.buy.id,
      CREDIT_TRANSFER_TYPES.sell.id
    ].includes(this.props.type.id)) {
      return (
        <div className="credit-transfer-progress-bar">
          <div
            className={`arrow-steps clearfix
              ${(this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id ||
                this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id ||
                this.props.isRescinded)
? 'negative'
: ''}`}
          >
            {this._renderCreditTransfer()}
          </div>
        </div>
      )
    }

    return (
      <div className="credit-transfer-progress-bar pvr">
        <div className={`arrow-steps clearfix
          ${(this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id) ? 'negative' : ''}`}
        >
          {this._renderGovernmentTransfer()}
        </div>
      </div>
    )
  }
}

CreditTransferProgress.defaultProps = {
  isRescinded: false,
  status: {
    id: 0,
    status: ''
  },
  type: {
    id: CREDIT_TRANSFER_TYPES.sell.id,
    theType: 'Transfer'
  },
  updateTimestamp: '2023-12-31'
}

CreditTransferProgress.propTypes = {
  isRescinded: PropTypes.bool,
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }),
  type: PropTypes.shape({
    id: PropTypes.number,
    theType: PropTypes.string
  }),
  updateTimestamp: PropTypes.string
}

export default CreditTransferProgress
