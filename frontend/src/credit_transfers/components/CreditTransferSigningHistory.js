import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, LCFS_COMPLIANCE_START_DT } from '../../../src/constants/values'
import { arrayMove, transformTransactionStatusDesc } from '../../utils/functions'

class CreditTransferSigningHistory extends Component {
  static recordedFound (histories) {
    return histories.find(history => (
      history.status.id === CREDIT_TRANSFER_STATUS.recorded.id
    ))
  }

  constructor (props) {
    super(props)

    const recordedFound = CreditTransferSigningHistory.recordedFound(props.history)

    if (recordedFound &&
      moment(props.tradeEffectiveDate).format('YYYYMMDD') < moment(recordedFound.createTimestamp).format('YYYYMMDD')) {
      const approvedIndex = props.history.findIndex(history => (
        history.status.id === CREDIT_TRANSFER_STATUS.approved.id))

      const recordedIndex = props.history.findIndex(history => (
        history.status.id === CREDIT_TRANSFER_STATUS.recorded.id
      ))

      arrayMove(props.history, approvedIndex, recordedIndex)
    }
  }

  _renderApproved (history) {
    // if "recorded" status was found, this means this credit trade
    // was from the historical data entry
    // show "the Director" at all times
    // use effective date as well
    const approveTimeStamp = history.createTimestamp >= moment('2024-01-01')
    return (
      <li key={history.createTimestamp}>
        <strong className="text-success">
        {transformTransactionStatusDesc(history.status.id, history.creditTrade.type.id, history.createTimestamp)} {' '}
        </strong>
        <span>
          on {moment(history.createTimestamp).format('LL')} by the
          <strong> Director </strong> under the
        </span>
        <em>
          {approveTimeStamp ? ' Low Carbon Fuels Act' : ' Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act'}
        </em>
      </li>
    )
  }

  _renderDeclined (history) {
    let roleDisplay = null

    if (history.userRole) {
      roleDisplay = history.userRole.description

      if (history.userRole.name === 'GovDeputyDirector' ||
      history.userRole.name === 'GovDirector') {
        roleDisplay = roleDisplay.replace('Government ', '')
      }
    }

    // if "recorded" status was found, this means this credit trade
    // was from the historical data entry
    // don't show the name and just put in "the {role}" instead

    return (
      <li key={history.createTimestamp}>
        <strong className="text-danger">{transformTransactionStatusDesc(history.status.id, history.creditTrade.type.id, history.createTimestamp)} </strong>
        {CreditTransferSigningHistory.recordedFound(this.props.history) &&
          <span>
            on {moment(this.props.tradeEffectiveDate).format('LL')} by the
            <strong> Director </strong> under the
          </span>
        }
        {!CreditTransferSigningHistory.recordedFound(this.props.history) &&
          <span>
            on {moment(history.createTimestamp).format('LL')} by
            <strong> {history.user.firstName} {history.user.lastName}</strong>
            <strong>{roleDisplay && `, ${roleDisplay}`} </strong> under the
          </span>
        }
        <em> Low Carbon Fuels Act</em>
      </li>
    )
  }

  static _isTransferType (history) {
    if (history.creditTrade && [CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(history.creditTrade.type.id) >= 0) {
      return true
    }
    return false
  }

  static renderAccepted (history) {
    return (<strong>{CreditTransferSigningHistory._isTransferType(history) ? 'Signed and submitted' : 'Signed'}</strong>)
  }

  static renderHistory (history) {
    return (<strong>{history.status.status} </strong>)
  }

  static renderNotRecommended (history) {
    const inputtedDate = new Date(history.createTimestamp)
    return (
      (CreditTransferSigningHistory._isTransferType(history) && inputtedDate >= LCFS_COMPLIANCE_START_DT)
        ? <span><strong>Recommended refusing</strong></span>
        : <span>
        <strong>Reviewed</strong> and
        <strong className="text-danger"> Not Recommended</strong>
      </span>
    )
  }

  static renderRecommended (history) {
    const inputtedDate = new Date(history.createTimestamp)
    return (
      (CreditTransferSigningHistory._isTransferType(history) && inputtedDate >= LCFS_COMPLIANCE_START_DT)
        ? <span><strong>Recommended recording</strong></span>
        : <span>
        <strong>Reviewed</strong> and
        <strong className="text-success"> Recommended</strong>
      </span>
    )
  }

  static renderRecorded (history) {
    history.createTimestamp >= moment('2024-01-01')
    return (history.createTimestamp >= moment('2024-01-01') ? <strong>Created</strong> : <strong>Recorded</strong>)
  }

  static renderRefused (history) {
    return (<span><strong className="text-danger">{CreditTransferSigningHistory._isTransferType(history) ? 'Declined' : 'Refused'}</strong></span>)
  }

  static renderRescinded () {
    return (<strong className="text-danger">Rescinded</strong>)
  }

  static renderSubmitted (history) {
    return (<span><strong>{CreditTransferSigningHistory._isTransferType(history) ? 'Signed and sent' : 'Proposed'}</strong></span>)
  }

  static monthsBetween (date1, date2) {
    let months = (date2.getFullYear() - date1.getFullYear()) * 12
    months -= date1.getMonth()
    months += date2.getMonth()
    if (date2.getDate() < date1.getDate()) {
      months--
    }
    return months
  }

  /**
   * Calculates the credit transfer category and the next change in months.
   *
   * @param {string} agreementDate - The date of the agreement
   * @param {string} submissionDate - The date of submission
   * @param {boolean} categoryDSelected - If true, category 'D' is chosen, ignoring other rules
   * @param {string|null} selectedCategory - A specific category, if provided
   * @returns {Object} The category and time (in months) until the next change, if any!
   */
  static calculateTransferCategoryAndNextChange (agreementDate, submissionDate, categoryDSelected, selectedCategory) {
    // If category 'D' is already chosen, return it immediately
    if (categoryDSelected) {
      return { category: 'D', nextChangeInMonths: null }
    }

    // If a specific category is selected, use it to determine the next change
    if (selectedCategory !== null) {
      const nextChange = (selectedCategory === 'A') ? 6 : (selectedCategory === 'B') ? 12 : null
      return { category: selectedCategory, nextChangeInMonths: nextChange }
    }

    // Otherwise, calculates based on the time since the agreement
    const now = new Date()
    submissionDate = submissionDate < now ? submissionDate : now
    const differenceInMonths = CreditTransferSigningHistory.monthsBetween(new Date(agreementDate), new Date(submissionDate))
    if (differenceInMonths < 6) {
      return { category: 'A', nextChangeInMonths: 6 }
    } else if (differenceInMonths < 12) {
      return { category: 'B', nextChangeInMonths: 12 }
    } else {
      return { category: 'C', nextChangeInMonths: null }
    }
  }

  _renderCategoryHistory () {
    const { history, dateOfWrittenAgreement, tradeCategory, categoryDSelected } = this.props
    // if there is no agreement date, it means this credit transfer
    // was created before we had this field as not optional
    // We won't show categorization if there is no agreement date.
    if (!dateOfWrittenAgreement) {
      return (<></>)
    }

    const lastHistoryItem = history[history.length - 1]
    const createdByGov = history[0].creditTrade?.initiator?.id === 1
    if (history.length > 0 && !createdByGov) {
      const agreementDate = dateOfWrittenAgreement || history[0].createTimestamp
      const selectedCategory = tradeCategory?.category || null
      const { category, nextChangeInMonths } = CreditTransferSigningHistory
        .calculateTransferCategoryAndNextChange(agreementDate, history[0].createTimestamp, categoryDSelected, selectedCategory)
      let nextChangeDate = null
      if (nextChangeInMonths !== null) {
        nextChangeDate = moment(agreementDate).add(nextChangeInMonths, 'months').format('LL')
      }
      const endDate = nextChangeDate
      const categoryCorD = categoryDSelected || category === 'C'
      return (
        <p>
          <li>
            <span>Date of written agreement reached between the two organizations: </span>
            <strong>{moment(agreementDate).format('LL')}</strong>
            {lastHistoryItem.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
              <span> (<strong>Category {category}</strong>)</span>
            }
            {lastHistoryItem.status.id !== CREDIT_TRANSFER_STATUS.approved.id &&
              lastHistoryItem.status.id !== CREDIT_TRANSFER_STATUS.rescinded.id &&
              lastHistoryItem.status.id !== CREDIT_TRANSFER_STATUS.refused.id &&
            (
              <>
                <span> (proposal falls under <strong>Category {category}</strong>{categoryCorD ? ')' : ''}</span>
                {nextChangeDate && (<span> if approved by: <strong>{endDate}</strong>)</span>)}
              </>
            )}
          </li>
        </p>
      )
    }
  }

  render () {
    return (
      <div className="credit-transfer-signing-history">
        <h3 className="signing-authority-header" key="header">Transaction History</h3>
        {this._renderCategoryHistory()}
        {this.props.history.length > 0 &&
        this.props.history.map((history, index, arr) => {
          let action
          if (history.isRescinded) {
            action = CreditTransferSigningHistory.renderRescinded()
          } else {
            if ([ // if the next history entry is also recommended/not recommended, don't show it
              CREDIT_TRANSFER_STATUS.notRecommended.id,
              CREDIT_TRANSFER_STATUS.recommendedForDecision.id,
              CREDIT_TRANSFER_STATUS.recorded.id
            ].includes(history.status.id) &&
            (index + 1) < arr.length && [
              CREDIT_TRANSFER_STATUS.notRecommended.id,
              CREDIT_TRANSFER_STATUS.recommendedForDecision.id,
              CREDIT_TRANSFER_STATUS.recorded.id
            ].includes(arr[index + 1].status.id)) {
              return false
            }

            switch (history.status.id) {
              case CREDIT_TRANSFER_STATUS.accepted.id:
                action = CreditTransferSigningHistory.renderAccepted(history)
                break

              case CREDIT_TRANSFER_STATUS.approved.id:
                return this._renderApproved(history)

              case CREDIT_TRANSFER_STATUS.declinedForApproval.id:
                return this._renderDeclined(history)

              case CREDIT_TRANSFER_STATUS.notRecommended.id:
                action = CreditTransferSigningHistory.renderNotRecommended(history)
                break

              case CREDIT_TRANSFER_STATUS.proposed.id:
                action = CreditTransferSigningHistory.renderSubmitted(history)
                break

              case CREDIT_TRANSFER_STATUS.recommendedForDecision.id:
                action = CreditTransferSigningHistory.renderRecommended(history)
                break

              case CREDIT_TRANSFER_STATUS.recorded.id:
                action = CreditTransferSigningHistory.renderRecorded(history)
                break

              case CREDIT_TRANSFER_STATUS.refused.id:
                action = CreditTransferSigningHistory.renderRefused(history)
                break

              default:
                action = CreditTransferSigningHistory.renderHistory(history)
            }
          }

          return (
            <p key={history.createTimestamp + index}><li>{action} <span> on </span>
              {moment(history.createTimestamp).format('LL')}
              <span> by </span>
              <strong> {history.user.firstName} {history.user.lastName}</strong> of
              <strong> {history.user.organization.name} </strong>
              </li>
            </p>
          )
        })}
      </div>
    )
  }
}

CreditTransferSigningHistory.defaultProps = {
  history: [],
  signatures: [],
  tradeEffectiveDate: null,
  dateOfWrittenAgreement: null,
  tradeCategory: null,
  categoryDSelected: false
}

CreditTransferSigningHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    createTimestamp: PropTypes.string,
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
    }),
    creditTrade: PropTypes.shape({
      initiator: PropTypes.shape({
        id: PropTypes.number
      })
    })
  })),
  signatures: PropTypes.arrayOf(PropTypes.shape({
    createTimestamp: PropTypes.string,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    })
  })),
  tradeEffectiveDate: PropTypes.string,
  dateOfWrittenAgreement: PropTypes.string,
  tradeCategory: PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.string
  }),
  categoryDSelected: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  })
}

export default CreditTransferSigningHistory
