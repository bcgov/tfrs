import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { DEFAULT_ORGANIZATION } from '../../constants/values';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

const CreditTransactionsPage = (props) => {
  const { isFetching, items } = props.creditTransfers;
  const isEmpty = items.length === 0;

  return (
    <div className="page_credit_transactions">
      <div className="credit_balance">
        {props.loggedInUser.role &&
          !props.loggedInUser.role.isGovernmentRole &&
          <h3>
            Credit Balance: {
              numeral(props.loggedInUser.organizationBalance).format(NumberFormat.INT)
            }
          </h3>
        }
        {!isFetching &&
          props.loggedInUser.role &&
          props.loggedInUser.role.isGovernmentRole &&
          [
            !props.organization &&
            <h3 key="all-organizations-credit-balance">
              All Organizations Credit Balance: {
                numeral(1000000000000000 - props.loggedInUser.organizationBalance)
                  .format(NumberFormat.INT)
              }
            </h3>,
            props.organization && props.organization.organizationBalance &&
            <h3 key={props.organization.id}>
              {props.organization.name}
              Credit Balance: {
                numeral(props.organization.organizationBalance.validatedCredits)
                  .format(NumberFormat.INT)
              }
            </h3>,
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
          {props.loggedInUser.role &&
          props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
            >
              Propose Trade
            </button>
          }
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <CreditTransferTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  );
};

CreditTransactionsPage.defaultProps = {
  organization: null,
  organizations: []
};

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    organizationBalance: PropTypes.number,
    role: PropTypes.shape({
      id: PropTypes.number,
      isGovernmentRole: PropTypes.bool
    })
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
