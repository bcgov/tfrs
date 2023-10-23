import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import moment from 'moment-timezone'
import * as NumberFormat from '../../constants/numeralFormats'
import {
  CREDIT_TRANSFER_STATUS,
  CREDIT_TRANSFER_TYPES
} from '../../constants/values'
import { getCreditTransferType } from '../../actions/creditTransfersActions'
import { transformCreditTransferTypeDesc } from '../../utils/functions'

class CreditTransferVisualRepresentation extends Component {
  _renderPart3Award () {
    return (
      <div className='row visual-representation container'>
        <div className='col-xs-10 col-sm-8 col-md-4'>
          <div className='respondent-container'>
            {this.props.creditsTo && this.props.creditsTo.name}
          </div>
        </div>
        <div className='col-xs-12 col-md-2 arrow'>
          <div>
            {numeral(this.props.numberOfCredits).format(NumberFormat.INT)}{' '}
            {this.props.updateTimestamp >= moment('2024-01-01') ? 'compliance unit' : 'credit'}{this.props.numberOfCredits > 1 && 's'}
          </div>
          <FontAwesomeIcon icon='arrow-alt-circle-up' size='4x' />{' '}
          <div>{transformCreditTransferTypeDesc(this.props.tradeType.id)}</div>
        </div>
      </div>
    )
  }

  _renderAdministrativeAdjustment () {
    return (
      <div className='row visual-representation container'>
        <div className='col-xs-10 col-sm-8 col-md-4'>
          <div className='respondent-container'>
            {this.props.creditsTo && this.props.creditsTo.name}
          </div>
        </div>
        <div className='col-xs-12 col-md-2 arrow'>
          <div>
            {numeral(this.props.numberOfCredits).format(NumberFormat.INT)}{' '}
            compliance unit{Math.abs(this.props.numberOfCredits) > 1 && 's'}
          </div>
          {this.props.numberOfCredits >= 0 &&
            <FontAwesomeIcon icon='arrow-alt-circle-up' size='4x' />
          }
          {this.props.numberOfCredits < 0 &&
            <FontAwesomeIcon icon='arrow-alt-circle-down' size='4x' />
          }
          {' '}
          <div>{getCreditTransferType(this.props.tradeType.id)}</div>
        </div>
      </div>
    )
  }

  _renderRetirement () {
    return (
      <div className='row visual-representation container'>
        <div className='col-xs-10 col-sm-8 col-md-4'>
          <div className='initiator-container'>
            {this.props.creditsFrom && this.props.creditsFrom.name}
          </div>
        </div>
        <div className='col-xs-12 col-md-2 arrow'>
          <div>
            {numeral(this.props.numberOfCredits).format(NumberFormat.INT)}{' '}
            {this.props.updateTimestamp >= moment('2024-01-01') ? 'compliance unit' : 'credit'}{this.props.numberOfCredits > 2 && 's'}
          </div>
          <FontAwesomeIcon icon='arrow-alt-circle-down' size='4x' />{' '}
          <div>{getCreditTransferType(this.props.tradeType.id)}</div>
        </div>
      </div>
    )
  }

  _creditTransferIcon () {
    if (Number(this.props.numberOfCredits) === 0) {
      return { icon: 'minus', className: '' }
    }

    if (this.props.totalValue === 0.0) {
      if (this.props.tradeType.id === CREDIT_TRANSFER_TYPES.buy.id) {
        return { icon: 'arrow-left', className: '' }
      }
      if (this.props.tradeType.id === CREDIT_TRANSFER_TYPES.sell.id) {
        return { icon: 'arrow-left', className: 'fa-flip-horizontal' }
      }
    }

    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.buy.id:
      case CREDIT_TRANSFER_TYPES.sell.id:
        return { icon: 'exchange-alt', className: '' }
      default:
        return { icon: 'minus', className: '' }
    }
  }

  _renderCreditTransfer () {
    const creditsFromStatus =
      this.props.creditsFrom.statusDisplay === 'Active' ? 'Registered' : 'Not registered'
    const creditsToStatus =
      this.props.creditsTo.statusDisplay === 'Active' ? 'Registered' : 'Not registered'

    return (
      <div className='row visual-representation container'>
        {this.props.creditsFrom && (
          <div className='col-xs-10 col-sm-8 col-md-4'>
            <div className='initiator-container'>
              {this.props.creditsFrom.name}
            </div>
            {[
              CREDIT_TRANSFER_STATUS.accepted.id,
              CREDIT_TRANSFER_STATUS.recommendedForDecision.id,
              CREDIT_TRANSFER_STATUS.notRecommended.id
            ].indexOf(this.props.status.id) >= 0 &&
              this.props.loggedInUser.isGovernmentUser && (
                <div className='credit-balance'>
                  Compliance Units:
                  {this.props.creditsFrom.organizationBalance &&
                    ` ${numeral(
                      this.props.creditsFrom.organizationBalance
                        .validatedCredits
                    ).format(NumberFormat.INT)} `}
                  (
                  {numeral(
                    this.props.creditsFrom.organizationBalance.deductions
                  ).format(NumberFormat.INT)}
                  )
                  <div
                    className={
                      creditsFromStatus === 'Inactive' ? 'text-danger' : ''
                    }
                  >
                    {creditsFromStatus}
                  </div>
                </div>
            )}
          </div>
        )}
        <div className='col-xs-12 col-md-2 arrow'>
          {Number(this.props.numberOfCredits) > 0 && (
            <div>
              {numeral(this.props.numberOfCredits).format(NumberFormat.INT)}{' '}
              compliance unit{this.props.numberOfCredits > 1 && 's'}
            </div>
          )}
          <FontAwesomeIcon
            icon={this._creditTransferIcon().icon}
            className={this._creditTransferIcon().className}
            size='6x'
          />
          {Number(this.props.totalValue) > 0 && (
            <div>
              {numeral(this.props.totalValue).format(NumberFormat.CURRENCY)}
            </div>
          )}
        </div>
        {this.props.creditsTo && (
          <div className='col-xs-10 col-sm-8 col-md-4'>
            <div className='respondent-container'>
              {this.props.creditsTo.name}
            </div>
            {[
              CREDIT_TRANSFER_STATUS.accepted.id,
              CREDIT_TRANSFER_STATUS.recommendedForDecision.id,
              CREDIT_TRANSFER_STATUS.notRecommended.id
            ].indexOf(this.props.status.id) >= 0 &&
              this.props.loggedInUser.isGovernmentUser && (
                <div className='credit-balance'>
                  Compliance Units:
                  {this.props.creditsTo.organizationBalance &&
                    ` ${numeral(
                      this.props.creditsTo.organizationBalance.validatedCredits
                    ).format(NumberFormat.INT)}`}
                  <div
                    className={
                      creditsToStatus === 'Inactive' ? 'text-danger' : ''
                    }
                  >
                    {creditsToStatus}
                  </div>
                </div>
            )}
          </div>
        )}
      </div>
    )
  }

  render () {
    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.part3Award.id:
      case CREDIT_TRANSFER_TYPES.validation.id:
        return this._renderPart3Award()

      case CREDIT_TRANSFER_TYPES.adminAdjustment.id:
        return this._renderAdministrativeAdjustment()

      case CREDIT_TRANSFER_TYPES.retirement.id:
        return this._renderRetirement()

      default:
        return this._renderCreditTransfer()
    }
  }
}

CreditTransferVisualRepresentation.defaultProps = {
  creditsFrom: {
    name: 'From'
  },
  creditsTo: {
    name: 'To'
  },
  numberOfCredits: '',
  status: {
    id: 0
  },
  zeroDollarReason: null
}

CreditTransferVisualRepresentation.propTypes = {
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    organizationBalance: PropTypes.shape({
      deductions: PropTypes.number,
      validatedCredits: PropTypes.number
    }),
    statusDisplay: PropTypes.string
  }),
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    organizationBalance: PropTypes.shape({
      validatedCredits: PropTypes.number
    }),
    statusDisplay: PropTypes.string
  }),
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  numberOfCredits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.shape({
    id: PropTypes.number
  }),
  totalValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tradeType: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    theType: PropTypes.string
  }).isRequired,
  zeroDollarReason: PropTypes.shape({
    id: PropTypes.number,
    reason: PropTypes.string
  })
}

export default CreditTransferVisualRepresentation
