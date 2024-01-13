import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import numeral from 'numeral'
import { Checkbox } from 'react-bootstrap'
// import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'

import * as NumberFormat from '../../constants/numeralFormats'
import {
  CREDIT_TRANSFER_STATUS,
  CREDIT_TRANSFER_TYPES,
  ZERO_DOLLAR_REASON
} from '../../constants/values'
import { transformTransactionStatusDesc } from '../../utils/functions'

class CreditTransferTextRepresentation extends Component {
  constructor (props) {
    super(props)

    this.compliancePeriod = this.props.compliancePeriod
      ? this.props.compliancePeriod.description
      : ''
    this.creditsFrom = this.props.creditsFrom.name
    this.creditsTo = this.props.creditsTo.name
    this.fairMarketValuePerCredit = numeral(
      this.props.fairMarketValuePerCredit
    ).format(NumberFormat.CURRENCY)
    this.numberOfCredits = numeral(this.props.numberOfCredits).format(
      NumberFormat.INT
    )
    this.totalValue = numeral(this.props.totalValue).format(
      NumberFormat.CURRENCY
    )

    this.tradeEffectiveDate = this.formatTradeEffectiveDate()

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id) {
      this.tradeStatus = 'Drafted'
    } else {
      this.tradeStatus = Object.values(CREDIT_TRANSFER_STATUS).find(
        (element) => element.id === this.props.status.id
      ).description
    }
  }

  getTradeEffectiveDate () {
    if (this.props.tradeEffectiveDate) {
      return this.props.tradeEffectiveDate
    }
    // Directly find the 'Approved' history
    const approvedHistory = this.props.history.find((history) => history.status.status === 'Approved')
    return approvedHistory ? approvedHistory.createTimestamp : null
  }

  formatTradeEffectiveDate = () => {
    const now = moment()
    const tradeEffectiveDate = this.getTradeEffectiveDate()
    // If no effective date is available, handle this case
    if (!tradeEffectiveDate) {
      return <span></span>
    }

    const formattedDate = moment(tradeEffectiveDate).format('LL')
    const status = this.props.status

    // Transaction is approved
    if (status.id === CREDIT_TRANSFER_STATUS.approved.id) {
      return (<span>, effective <span className='value'>{formattedDate}</span></span>)
    }

    // Check if tradeEffectiveDate exists and is in the future
    if (moment(tradeEffectiveDate).isAfter(now)) {
      return (<span> effective <span className='value'>{formattedDate}</span> or on the
        date the Director records the transfer, whichever is later.</span>)
    } else {
      return (<span>, effective on the date the Director records the transfer.</span>)
    }
  }

  _buyAction () {
    switch (this.props.status.id) {
      case CREDIT_TRANSFER_STATUS.approved.id:
        return ' bought '
      case CREDIT_TRANSFER_STATUS.refused.id:
        return ' proposed to buy '
      default:
        return ' is proposing to buy '
    }
  }

  _renderBuy () {
    return (
      <div className='text-representation'>
        <span className='value'>{this.creditsTo}</span> {this._buyAction()}
        <span className='value'> {this.numberOfCredits} </span> compliance unit
        {this.props.numberOfCredits > 1 && 's'} from
        <span className='value'> {this.creditsFrom} </span>
        for <span className='value'> {this.fairMarketValuePerCredit} </span> per
        credit for a total value of{' '}
        <span className='value'> {this.totalValue}</span>
        {this._statusText(this.props.creditsFrom)}
        {this.props.zeroDollarReason != null && (
          <div className='zero-reason'>
            <span>
              The fair market value per credit is zero because:
              <span className='value'>
                {
                  Object.values(ZERO_DOLLAR_REASON).find(
                    (zd) => zd.id === this.props.zeroDollarReason.id
                  ).textRepresentationDescription
                }
              </span>
            </span>
          </div>
        )}
      </div>
    )
  }

  _renderDefault () {
    return (
      <div className='text-representation'>
        A credit transfer of
        <span className='value'> {this.numberOfCredits} </span> compliance unit
        {this.props.numberOfCredits > 1 && 's'} for
        <span className='value'> {this.creditsTo} </span>
        has been <span className='value lowercase'> {this.tradeStatus} </span>
        {this.tradeEffectiveDate}
      </div>
    )
  }

  _renderPart3Award () {
    if (moment(this.props.updateTimestamp).isSameOrAfter(moment('2024-01-01'))) {
      return (
        <div className='text-representation'>
          <span className='value'>{this.numberOfCredits}</span> compliance unit{this.props.numberOfCredits > 1 ? 's' : ''} issued to <span className='value'>{this.creditsTo} </span>
          for the completion of a designated action in an Initiative Agreement has been <span className='value lowercase'>{this.tradeStatus}</span>
          {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.
        </div>
      )
    } else {
      return (
        <div className='text-representation'>
          An award of <span className='value'>{this.numberOfCredits}</span> credit{this.props.numberOfCredits > 1 ? 's' : ''} earned by <span className='value'>{this.creditsTo} </span>
          for the completion of Part 3 Agreement milestone(s) has been <span className='value lowercase'>{this.tradeStatus}</span>
          {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.
        </div>
      )
    }
  }

  _transformTradeStatus (tradeStatus) {
    if (tradeStatus === 'Refused') {
      return 'declined'
    }
    if (tradeStatus === 'Recorded') {
      return 'approved'
    }
    if (tradeStatus === 'Reviewed') {
      return 'reviewed'
    }
  }

  _renderAdministrativeAdjustment () {
    return (
      <div className='text-representation'>
        An <span className='value'>administrative adjustment</span> of
        <span className='value'> {this.numberOfCredits} </span>
        compliance unit{Math.abs(this.props.numberOfCredits) > 1 && 's'} has been
        <span className='value lowercase'> {this.tradeStatus}</span>,
        {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && (
            <span className='value'> {this.tradeEffectiveDate}</span>
        )}
        .
      </div>
    )
  }

  _renderRetirement () {
    if (this.props.updateTimestamp >= moment('2024-01-01')) {
      return (
        <div className='text-representation'>
          <span className='value'> {this.numberOfCredits} </span> compliance unit{this.props.numberOfCredits > 1 && 's'} issued to
          <span className='value'> {this.creditsFrom}</span>, {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.
        </div>
      )
    } else {
      return (
          <div className='text-representation'>
            A <span className='value'>reduction </span> of <span className='value'>{this.numberOfCredits} </span> credits earned by <span className='value'>{this.creditsTo}</span>
            {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
            <span> has been <span className='value'>approved </span> {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.</span>
          }
        </div>
      )
    }
  }

  _renderSell () {
    const status = this.props.status
    return (
      <div className='text-representation'>
        <span className='value'>{this.creditsFrom}</span> {this._sellAction()}
        <span className='value'> {this.numberOfCredits} </span> compliance unit
        {this.props.numberOfCredits > 1 && 's'} to
        <span className='value'> {this.creditsTo} </span>
        for <span className='value'> {this.fairMarketValuePerCredit} </span> per
        compliance unit for a total value of{' '}
        <span className='value'> {this.totalValue}</span>
        {this._statusText(this.props.creditsTo)}
        {this.props.zeroDollarReason != null && (
          <div className='zero-reason'>
            <span>
              The fair market value per compliance unit is zero because:
              <span className='value'>
                {
                  Object.values(ZERO_DOLLAR_REASON).find(
                    (zd) => zd.id === this.props.zeroDollarReason.id
                  ).textRepresentationDescription
                }
              </span>
            </span>
          </div>
        )}
        {this.props.loggedInUser.isGovernmentUser &&
          status.id !== CREDIT_TRANSFER_STATUS.approved.id &&
          status.id !== CREDIT_TRANSFER_STATUS.refused.id &&
          status.id !== CREDIT_TRANSFER_STATUS.declinedForApproval.id &&
          this.props.isRescinded !== true &&
          <div className="checkbox" style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              type="checkbox"
              id="categoryDcheckbox"
              label="Category D Selected"
              checked={this.props.categoryDSelected}
              // disabled={!this.props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.APPROVE)}
              onChange={(event) => this.props.toggleCategoryDSelection(event.target.checked)}
              style={{ paddingTop: 4 }}
            />
            <span>Select the checkbox to set the transfer as <span className='value'>Category D</span>&nbsp;if the price is significantly less than fair market value. This will override the default category determined by the agreement and approval dates indicated below.</span>
          </div>
        }
      </div>
    )
  }

  _renderValidation () {
    if (this.props.updateTimestamp >= moment('2024-01-01')) {
      return (
        <div className='text-representation'>
          <span className='value'> {this.numberOfCredits} </span> compliance unit{this.numberOfCredits > 1 && 's'} issued to
          <span className='value'> {this.creditsTo}</span>, {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.
        </div>
      )
    } else {
      return (
        <div className='text-representation'>
          A <span className='value'>validation </span> of <span className='value'>{this.numberOfCredits} </span> credits earned by <span className='value'>{this.creditsTo}</span>
          {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
            <span> has been <span className='value'>approved </span> {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id && this.tradeEffectiveDate}.</span>
          }
        </div>
      )
    }
  }

  _rescindedBy () {
    const rescindedBy = this.props.history.find(
      (history) => history.isRescinded
    )

    if (rescindedBy) {
      return [
        <span key='rescinded-by' className='value'>
          {' '}
          {rescindedBy.user.organization.name}{' '}
        </span>,
        <span key='rescinded-by-text'>rescinded the transfer.</span>
      ]
    }

    return false
  }

  _sellAction () {
    if (this.props.isRescinded) {
      return ' proposed to sell '
    }

    switch (this.props.status.id) {
      case CREDIT_TRANSFER_STATUS.approved.id:
        return ' transferred '
      case CREDIT_TRANSFER_STATUS.refused.id:
        return ' proposed to sell '
      default:
        return ' transfers '
    }
  }

  _statusText (respondent) {
    if (this.props.isRescinded) {
      return <span>. {this._rescindedBy()}</span>
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) {
      return (
        <span>
          . <span className='value'> {respondent.name} </span> declined the transfer.
        </span>
      )
    }

    if (
      this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id
    ) {
      return <span>. The proposal was {transformTransactionStatusDesc(CREDIT_TRANSFER_STATUS.declinedForApproval.id, this.props.tradeType.id, this.props.updateTimestamp).toLowerCase()}.</span>
    }
    return (this.tradeEffectiveDate)
  }

  render () {
    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.buy.id:
        return this._renderBuy()

      case CREDIT_TRANSFER_TYPES.part3Award.id:
        return this._renderPart3Award()

      case CREDIT_TRANSFER_TYPES.adminAdjustment.id:
        return this._renderAdministrativeAdjustment()

      case CREDIT_TRANSFER_TYPES.retirement.id:
        return this._renderRetirement()

      case CREDIT_TRANSFER_TYPES.sell.id:
        return this._renderSell()

      case CREDIT_TRANSFER_TYPES.validation.id:
        return this._renderValidation()

      default:
        return this._renderDefault()
    }
  }
}

CreditTransferTextRepresentation.defaultProps = {
  compliancePeriod: {
    description: ''
  },
  creditsFrom: {
    name: 'From'
  },
  creditsTo: {
    name: 'To'
  },
  history: [],
  isRescinded: false,
  tradeEffectiveDate: '',
  updateTimestamp: '',
  zeroDollarReason: null
}

CreditTransferTextRepresentation.propTypes = {
  updateTimestamp: PropTypes.string,
  compliancePeriod: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string
  }),
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  fairMarketValuePerCredit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  history: PropTypes.arrayOf(
    PropTypes.shape({
      creditTradeUpdateTime: PropTypes.string,
      isRescinded: PropTypes.bool,
      status: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string
      }),
      user: PropTypes.shape({
        displayName: PropTypes.string,
        firstName: PropTypes.string,
        id: PropTypes.number,
        lastName: PropTypes.string
      })
    })
  ),
  isRescinded: PropTypes.bool,
  numberOfCredits: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }).isRequired,
  totalValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tradeEffectiveDate: PropTypes.string,
  tradeType: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    theType: PropTypes.string
  }).isRequired,
  zeroDollarReason: PropTypes.shape({
    id: PropTypes.number,
    reason: PropTypes.string
  }),
  categoryDSelected: PropTypes.bool,
  toggleCategoryDSelection: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool,
    hasPermission: PropTypes.func
  })
}

export default CreditTransferTextRepresentation
