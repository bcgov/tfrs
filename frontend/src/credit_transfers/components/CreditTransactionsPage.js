import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as NumberFormat from '../../constants/numeralFormats';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { DEFAULT_ORGANIZATION } from '../../constants/values';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

import * as Routes from '../../constants/routes';

import * as Lang from '../../constants/langEnUs';

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers;
  const isEmpty = items.length === 0;

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
                }
              </h3>
            </div>,
            <div className="form-group organization_filter" key="organization-filter">
              <label htmlFor="organizationFilterSelect">Show transactions involving:
                <select
                  id="organizationFilterSelect"
                  className="form-control"
                  onChange={(event) => {
                    const organizationId = parseInt(event.target.value, 10);
                    props.selectOrganization(organizationId);
                  }}
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
            <button
              id="credit-transfer-new-transfer"
              className="btn btn-primary"
              type="button"
              onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
            >
              <FontAwesomeIcon icon="plus-circle" />
              {!props.loggedInUser.isGovernmentUser && ` ${Lang.BTN_NEW_TRANSFER}`}
              {props.loggedInUser.isGovernmentUser && ` ${Lang.BTN_NEW_CREDIT_TRANSACTION}`}
            </button>
          }
          <button
            className="btn btn-info"
            type="button"
            onClick={() => {
              let url = Routes.BASE_URL + CREDIT_TRANSACTIONS.EXPORT;

              if (props.organization) {
                url += `?organization_id=${props.organization.id}`;
              }

              document.location = url;
            }}
          >
            <FontAwesomeIcon icon="file-excel" /> Download as .xls
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
  );
};

CreditTransactionsPage.defaultProps = {
  highlight: null,
  organization: null,
  organizations: []
};

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
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      })
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
};

export default CreditTransactionsPage;
