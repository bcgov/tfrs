import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import CONFIG from '../../config'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import { useNavigate } from 'react-router'

const DirectorReview = (props) => {
  const {isGettingDashboard: fetchingDashboard, supplementalItems: supplementalReports } = props.complianceReports
  const navigate = useNavigate()
  const { isFinding: fetchingCreditTransfers, items: creditTransfers } =
    props.creditTransfers

  const awaitingReview = {
    complianceAndExclusionReports: 0,
    creditTransfers: 0,
    exclusionReports: 0,
    part3Awards: 0,
    total: 0
  }

  if (
    CONFIG.COMPLIANCE_REPORTING.ENABLED &&
    typeof props.loggedInUser.hasPermission === 'function' &&
    props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW)
  ) {
    supplementalReports &&
    supplementalReports.forEach((item) => {
        let { status } = item
        if (['Not Recommended', 'Recommended'].indexOf(status.managerStatus) >=0 && status.directorStatus === 'Unreviewed') {
            awaitingReview.complianceAndExclusionReports += 1
        }
      })
  }

  if (
    typeof props.loggedInUser.hasPermission === 'function' &&
    props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.VIEW)
  ) {
    creditTransfers.forEach((item) => {
      if (!item.isRescinded) {
        if (
          ['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0
        ) {
          if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
            awaitingReview.creditTransfers += 1
            awaitingReview.total += 1
          }

          if (['Part 3 Award'].indexOf(item.type.theType) >= 0) {
            awaitingReview.part3Awards += 1
            awaitingReview.total += 1
          }
        }
      }
    })
  }

  return (
    <div className="dashboard-fieldset director">
      <h1>Director Review</h1>
      There are:
      <div>
        <>
          <div className="value">{awaitingReview.total}</div>
          <div className="content">
            <h2> item(s) in progress for your action:</h2>
            {typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_CREDIT_TRANSACTIONS.VIEW
              ) && (
                <div>
                  {/* Credit transfers awaiting review */}
                  <button
                    onClick={() => {
                      props.setFilter(
                        [
                          {
                            id: 'compliancePeriod',
                            value: ''
                          },
                          {
                            id: 'transactionType',
                            value: 'Credit Transfer'
                          },
                          {
                            id: 'status',
                            value: 'Reviewed'
                          }
                        ],
                        'credit-transfers'
                      )

                      return navigate(CREDIT_TRANSACTIONS.LIST)
                    }}
                    type="button"
                  >
                  {fetchingCreditTransfers ? <Loading/> : `${awaitingReview.creditTransfers} `}
                  credit transfer(s) for your review and statutory decision
                  </button>
                </div>
            )}

            {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
              typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_COMPLIANCE_REPORT.VIEW
              ) && (
                <div>
                  <button
                    className="btn-text"
                    onClick={() => {
                      props.setFilter(
                        [
                          {
                            id: 'current-status',
                            value:["For Director Review"]
                          },
                         
                        ],
                        'compliance-reporting'
                      )

                      return navigate(COMPLIANCE_REPORTING.LIST,{state:{items:["For Director Review"]}})
                    }}
                    type="button"
                  >
                  {fetchingDashboard ? <Loading/> : awaitingReview.complianceAndExclusionReports} compliance / exclusion report(s) awaiting your review
                  </button>
                </div>
            )}

            {typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_CREDIT_TRANSACTIONS.VIEW
              ) && (
                <div>
                  <button
                    onClick={() => {
                      props.setFilter(
                        [
                          {
                            id: 'compliancePeriod',
                            value: ''
                          },
                          {
                            id: 'transactionType',
                            value: 'Part 3 Award'
                          },
                          {
                            id: 'status',
                            value: 'Reviewed'
                          }
                        ],
                        'credit-transfers'
                      )

                      return navigate(CREDIT_TRANSACTIONS.LIST)
                    }}
                    type="button"
                  >
                    {awaitingReview.part3Awards} Part 3 Award(s) awaiting your
                    review
                  </button>
                </div>
            )}
          </div>
        </>
      </div>
    </div>
  )
}

DirectorReview.defaultProps = {}

DirectorReview.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    isGettingDashboard: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    isFinding: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  setFilter: PropTypes.func.isRequired
}

export default DirectorReview
