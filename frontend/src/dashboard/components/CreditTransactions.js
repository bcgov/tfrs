import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'

import Loading from '../../app/components/Loading'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'

const CreditTransactions = (props) => {
  const { isFetching, items } = props.creditTransfers
  const navigate = useNavigate()

  if (isFetching) {
    return <Loading />
  }

  const awaitingReview = {
    creditTransfers: {
      analyst: 0,
      director: 0,
      total: 0
    },
    part3Awards: {
      analyst: 0,
      director: 0,
      total: 0
    }
  }

  items.forEach((item) => {
    if (['Part 3 Award'].indexOf(item.type.theType) >= 0) {
      if (['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0) {
        awaitingReview.part3Awards.director += 1
        awaitingReview.part3Awards.total += 1
      }
    }

    if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
      if (item.status.status === 'Accepted' && !item.isRescinded) {
        awaitingReview.creditTransfers.analyst += 1
        awaitingReview.creditTransfers.total += 1
      }

      if (['Recommended', 'Not Recommended'].indexOf(item.status.status) >= 0 && !item.isRescinded) {
        awaitingReview.creditTransfers.director += 1
        awaitingReview.creditTransfers.total += 1
      }
    }
  })

  return (
    <div className="dashboard-fieldset compliance-exclusion-value">
      <h1>Credit Transactions</h1>
      <p>There are:</p>

      <div>
        <div className='credit-transactions-reports'>
          <div className="value">
            {awaitingReview.creditTransfers.total}
          </div>
        </div>
        <div className="content">
          <h2>Credit transfers in progress:</h2>

          <div>{/* n awaiting government analyst review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }, {
                  id: 'transactionType',
                  value: 'Credit Transfer'
                }, {
                  id: 'status',
                  value: 'Signed'
                }], 'credit-transfers')

                return navigate(CREDIT_TRANSACTIONS.LIST)
              }}
              type="button"
            >
              {awaitingReview.creditTransfers.analyst} awaiting government analyst review
            </button>
          </div>

          <div>{/* n awaiting Director review */}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }, {
                  id: 'transactionType',
                  value: 'Credit Transfer'
                }, {
                  id: 'status',
                  value: 'Reviewed'
                }], 'credit-transfers')

                return navigate(CREDIT_TRANSACTIONS.LIST)
              }}
              type="button"
            >
              {`${awaitingReview.creditTransfers.director} `}
              awaiting Director review and statutory decision
            </button>
          </div>
        </div>
        <p><br /></p>
      </div>
      <div>{/* n awaiting Director review for Part 3 Awards */}
        <div className="value">
          {awaitingReview.part3Awards.total}
        </div>

        <div className="content">
          <h2>Part 3 Awards in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }, {
                  id: 'transactionType',
                  value: 'Part 3 Award'
                }, {
                  id: 'status',
                  value: 'Reviewed'
                }], 'credit-transfers')

                return navigate(CREDIT_TRANSACTIONS.LIST)
              }}
              type="button"
            >
              {awaitingReview.part3Awards.director} awaiting Director review
            </button>
          </div>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <h2>View all credit transactions:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear()

                props.setFilter([{
                  id: 'compliancePeriod',
                  value: currentYear.toString()
                }], 'credit-transfers')

                return navigate(CREDIT_TRANSACTIONS.LIST)
              }}
              type="button"
            >
              Current compliance period
            </button>
            {' | '}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliancePeriod',
                  value: ''
                }], 'credit-transfers')

                return navigate(CREDIT_TRANSACTIONS.LIST)
              }}
              type="button"
            >
              All/historical
            </button>
          </div>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <Link
            to={ORGANIZATIONS.LIST}
          >
            Fuel Supplier Organizations
          </Link>
        </div>
        <p><br /></p>
      </div>
    </div>
  )
}

CreditTransactions.defaultProps = {
}

CreditTransactions.propTypes = {
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
}

export default CreditTransactions
