import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

import { CREDIT_TRANSFER_STATUS } from '../../../src/constants/values'
import { arrayMove } from '../../utils/functions'

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
    return (
      <p key={history.createTimestamp}>
        <strong className="text-success">Approved </strong>
        <span>
          on {moment(this.props.tradeEffectiveDate).format('LL')} by the
          <strong> Director </strong> under the
        </span>
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>
      </p>
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
      <p key={history.createTimestamp}>
        <strong className="text-danger">Declined </strong>
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
        <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act</em>
      </p>
    )
  }

  static renderAccepted (history) {
    return (<strong>Signed</strong>)
  }

  static renderHistory (history) {
    return (<strong>{history.status.status} </strong>)
  }

  static renderNotRecommended () {
    return (
      <span>
        <strong>Reviewed</strong> and
        <strong className="text-danger"> Not Recommended</strong>
      </span>
    )
  }

  static renderRecommended () {
    return (
      <span>
        <strong>Reviewed</strong> and
        <strong className="text-success"> Recommended</strong>
      </span>
    )
  }

  static renderRecorded () {
    return (<strong>Recorded</strong>)
  }

  static renderRefused () {
    return (<strong className="text-danger">Refused</strong>)
  }

  static renderRescinded () {
    return (<strong className="text-danger">Rescinded</strong>)
  }

  static renderSubmitted (history) {
    return (<strong>Proposed</strong>)
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

  static calculateTransferCategoryAndNextChange (agreementDate, submissionDate, categoryDSelected) {
    if (categoryDSelected) {
      return { category: 'D', nextChangeInMonths: null }
    }
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
    const { history, dateOfWrittenAgreement, categoryDSelected, loggedInUser } = this.props
    const lastHistoryItem = history[history.length - 1]
    if (history.length > 0 && loggedInUser.isGovernmentUser) {
      const agreementDate = dateOfWrittenAgreement || history[0].createTimestamp
      const { category, nextChangeInMonths } = CreditTransferSigningHistory
        .calculateTransferCategoryAndNextChange(agreementDate, history[0].createTimestamp, categoryDSelected)
      let nextChangeDate = null
      if (nextChangeInMonths !== null) {
        nextChangeDate = moment(agreementDate).add(nextChangeInMonths, 'months').format('LL')
      }
      const endDate = nextChangeDate
      const categoryCorD = categoryDSelected || category === 'C'
      return (
        <>
          <p>
            <li>
              <span>Date of written agreement reached between the two suppliers: </span>
              <strong>{moment(agreementDate).format('LL')}</strong>
              {lastHistoryItem.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
                <span> (<strong>Category {category}</strong>)</span>
              }
              {lastHistoryItem.status.id !== CREDIT_TRANSFER_STATUS.approved.id && (
                <>
                  <span> (proposal falls under <strong>Category {category}</strong>{categoryCorD ? ')' : ''}</span>
                  {nextChangeDate && (<span> if approved by: <strong>{endDate}</strong>)</span>)}
                </>
              )}
            </li>
          </p>
        </>
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
                action = CreditTransferSigningHistory.renderNotRecommended()
                break

              case CREDIT_TRANSFER_STATUS.proposed.id:
                action = CreditTransferSigningHistory.renderSubmitted(history)
                break

              case CREDIT_TRANSFER_STATUS.recommendedForDecision.id:
                action = CreditTransferSigningHistory.renderRecommended()
                break

              case CREDIT_TRANSFER_STATUS.recorded.id:
                action = CreditTransferSigningHistory.renderRecorded(history)
                break

              case CREDIT_TRANSFER_STATUS.refused.id:
                action = CreditTransferSigningHistory.renderRefused()
                break

              default:
                action = CreditTransferSigningHistory.renderHistory(history)
            }
          }

          return (
            <>
              <p key={history.createTimestamp}><li>{action} <span> on </span>
                {moment(history.createTimestamp).format('LL')}
                <span> by </span>
                <strong> {history.user.firstName} {history.user.lastName}</strong> of
                <strong> {history.user.organization.name} </strong>
                </li>
              </p>
            </>
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
  categoryDSelected: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  })
}

export default CreditTransferSigningHistory
