import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as NumberFormat from '../../constants/numeralFormats'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import { DEFAULT_ORGANIZATION } from '../../constants/values'
import Loading from '../../app/components/Loading'
import Tooltip from '../../app/components/Tooltip'
import CreditTransferTable from './CreditTransferTable'
import { download } from '../../utils/functions'

import * as Routes from '../../constants/routes'
import * as Lang from '../../constants/langEnUs'
import { useNavigate } from 'react-router'

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers
  const isEmpty = items.length === 0
  const navigate = useNavigate()

  return (
    <div className="page_credit_transactions">
      <div className="credit_balance">
        {props.loggedInUser.roles &&
          !props.loggedInUser.isGovernmentUser &&
          <h3>
            Credit Balance: {
              numeral(props.loggedInUser.organization.organizationBalance.validatedCredits)
                .format(NumberFormat.INT)
            }
            <div className="reserved">
              (In Reserve: {
                numeral(props.loggedInUser.organization.organizationBalance.deductions)
                  .format(NumberFormat.INT)
              }){' '}
              <Tooltip
                className="info"
                show
                title="Reserved credits are the portion of credits in your credit balance that are
                currently pending the completion of a credit transaction. For example, selling
                credits to another organization (i.e. Credit Transfer) or being used to offset
                outstanding debits in a compliance period. Reserved credits cannot be transferred
                or otherwise used until the pending credit transaction has been completed."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          </h3>
        }
        {!isFetching &&
          props.loggedInUser.isGovernmentUser &&
          [
            !props.organization &&
            <div key="all-organizations-credit-balance">
              <h3>All Organizations</h3>
              <h3>
                Credit Balance: {
                  numeral(1000000000000000 -
                    props.loggedInUser.organization.organizationBalance.validatedCredits)
                    .format(NumberFormat.INT)
                }
              </h3>
            </div>,
            props.organization && props.organization.organizationBalance &&
            <div key={props.organization.id}>
              <h3>{props.organization.name}</h3>
              <h3>
                Credit Balance: {
                  numeral(props.organization.organizationBalance.validatedCredits)
                    .format(NumberFormat.INT)
                } ({
                  numeral(props.organization.organizationBalance.deductions)
                    .format(NumberFormat.INT)
                })
              </h3>
            </div>,
            <div className="form-group organization_filter" key="organization-filter">
              <label htmlFor="organizationFilterSelect">Show transactions involving:
                <select
                  id="organizationFilterSelect"
                  className="form-control"
                  onChange={(event) => {
                    const organizationId = parseInt(event.target.value, 10)
                    props.selectOrganization(organizationId)
                  }}
                  value={props.organization.id}
                >
                  <option value="-1">All Organizations</option>
                  {props.organizations.map(organization =>
                    (organization.id !== DEFAULT_ORGANIZATION.id &&
                      <option
                        key={organization.id.toString(10)}
                        value={organization.id.toString(10)}
                      >
                        {organization.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          ]
        }
      </div>
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
          (props.loggedInUser.organization.statusDisplay === 'Active' ||
          (props.loggedInUser.organization.organizationBalance &&
          (props.loggedInUser.organization.organizationBalance.validatedCredits > 0))) &&
          !props.loggedInUser.isGovernmentUser &&
            <button
              id="credit-transfer-new-transfer"
              className="btn btn-primary"
              type="button"
              onClick={() => navigate(CREDIT_TRANSACTIONS.ADD)}
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_TRANSFER}
            </button>
          }
          <button
            className="btn btn-info"
            id="download-credit-transfers"
            type="button"
            onClick={(e) => {
              const element = e.target
              const original = element.innerHTML

              element.firstChild.textContent = ' Downloading...'

              return download(Routes.BASE_URL + CREDIT_TRANSACTIONS.EXPORT, {
                organization_id: props.organization.id
              }).then(() => {
                element.innerHTML = original
              })
            }}
          >
            <FontAwesomeIcon icon="file-excel" /> <span>Download as .xls</span>
          </button>
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <CreditTransferTable
        highlight={props.highlight}
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  )
}

CreditTransactionsPage.defaultProps = {
  highlight: null,
  organization: null,
  organizations: []
}

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  highlight: PropTypes.string,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      actionsTypeDisplay: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        deductions: PropTypes.number,
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    }))
  }).isRequired,
  organization: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        deductions: PropTypes.number,
        validatedCredits: PropTypes.number
      })
    })
  ]),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  selectOrganization: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CreditTransactionsPage
