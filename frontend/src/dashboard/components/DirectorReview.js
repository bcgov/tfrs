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
  const { isGettingDashboard: fetchingDashboard, supplementalItems: supplementalReports } = props.complianceReports
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
      const { status } = item
      if (['Not Recommended', 'Recommended'].indexOf(status.managerStatus) >= 0 && status.directorStatus === 'Unreviewed') {
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
          ['Recommended', 'Not Recommended','Recorded'].indexOf(item.status.status) >= 0
        ) {
          if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
            awaitingReview.creditTransfers += 1
            awaitingReview.total += 1
          }

          if (['Part 3 Award', 'Initiative Agreement'].indexOf(item.type.theType) >= 0) {
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

      <div>
      There are:
        <>
          <div className="content">
            {typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_CREDIT_TRANSACTIONS.VIEW
              ) && (
                <div>
                  <span>  {fetchingCreditTransfers ? <Loading/> : `${awaitingReview.creditTransfers} `}</span>
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
                            value: 'Transfer'
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
                    data-testid="creditTransferBtn"
                  >

                    Transfer(s) awaiting review
                  </button>
                </div>
            )}

            {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
              typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_COMPLIANCE_REPORT.VIEW
              ) && (
                <div>
                  <span>{fetchingDashboard ? <Loading/> : awaitingReview.complianceAndExclusionReports}</span>
                  <button
                    className="btn-text"
                    onClick={() => {
                      props.setFilter(
                        [
                          {
                            id: 'current-status',
                            value: ['For Director Review']
                          }

                        ],
                        'compliance-reporting'
                      )

                      return navigate(COMPLIANCE_REPORTING.LIST, { state: { items: ['For Director Review'] } })
                    }}
                    type="button"
                  >
                   Compliance report(s) awaiting review
                  </button>
                </div>
            )}

            {typeof props.loggedInUser.hasPermission === 'function' &&
              props.loggedInUser.hasPermission(
                PERMISSIONS_CREDIT_TRANSACTIONS.VIEW
              ) && (
                <div>
                <span> {awaitingReview.part3Awards}</span>
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
                            value: 'Part 3 Award, Initiative Agreement'
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
                    Initiative Agreement submission(s) awaiting review
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
    items: PropTypes.arrayOf(PropTypes.shape()),
    supplementalItems: PropTypes.arrayOf(PropTypes.shape())
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
