import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Loading from '../../app/components/Loading'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import { useNavigate } from 'react-router'

const CreditTransactions = (props) => {
  const { isFetching, items } = props.creditTransfers
  const navigate = useNavigate()

  if (isFetching) {
    return <Loading />
  }

  const inProgress = {
    creditTransfers: 0
  }

  items.forEach((item) => {
    if (['Buy', 'Sell'].indexOf(item.type.theType) >= 0) {
      if (!item.isRescinded && ['Accepted', 'Submitted', 'Draft'].indexOf(item.status.status) >= 0) {
        inProgress.creditTransfers += 1
      }
    }
  })

  return (
    <div className="dashboard-fieldset credit-transactions">
      <h1>Transactions</h1>
      <span key="credit-transactions-label">There are:</span>

      {props.loggedInUser.organization.actionsTypeDisplay !== 'None' &&
        <div>
          <p><br/></p>
          <div key="credit-transactions">

            <div className="value">
              {inProgress.creditTransfers}
            </div>

            <div className="content">
              <button
                onClick={() => {
                  props.setFilter([{
                    id: 'compliancePeriod',
                    value: ''
                  }, {
                    id: 'transactionType',
                    value: 'Transfer'
                  }, {
                    id: 'status',
                    value: 'Sent,Submitted,Draft'
                  }], 'credit-transfers')

                  return navigate(CREDIT_TRANSACTIONS.LIST)
                }}
                type="button"
              >
                Transfer(s) in progress (including draft)
              </button>
            </div>
            <p><br/></p>
          </div>
        </div>
      }

      <div>
        <div className="content">
          <h2>View all compliance unit transactions:</h2>

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
        <p><br/></p>
      </div>

      <div>
        <div className="content">
          <a
            href={ORGANIZATIONS.BULLETIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            RLCF-013: Transfers
          </a>
          <a
            href={ORGANIZATIONS.BULLETIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon icon={['far', 'file-pdf']} />
          </a>
        </div>
        <p><br/></p>
      </div>

      {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
      (props.loggedInUser.organization.statusDisplay === 'Active' ||
      (props.loggedInUser.organization.organizationBalance &&
      (props.loggedInUser.organization.organizationBalance.validatedCredits > 0))) &&
      <div className="add-button">
        <FontAwesomeIcon icon="play" /> {' '}
        <button
          onClick={() => navigate(CREDIT_TRANSACTIONS.ADD)}
          type="button"
        >
          Start a new transfer
        </button>
      </div>
      }
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
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      actionsTypeDisplay: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
  setFilter: PropTypes.func.isRequired
}

export default CreditTransactions
