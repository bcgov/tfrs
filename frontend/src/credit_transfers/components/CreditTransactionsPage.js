import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

class CreditTransactionsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filterOrganization: -1
    };
  }

  render () {
    const { isFetching, items } = this.props.creditTransfers;
    const isEmpty = items.length === 0;

    let uniqueOrganizations = [];

    if (!isFetching) {
      uniqueOrganizations = (
        Array.from(new Set(items.flatMap(item => [{
          id: item.creditsFrom.id,
          name: item.creditsFrom.name
        }, {
          id: item.creditsTo.id,
          name: item.creditsTo.name
        }])))
      ).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        .reduce((acc, item) => (acc.find(o => o.id === item.id) ? acc : [...acc, item]), []);
    }

    let preFilteredItems = items;

    if (this.state.filterOrganization !== -1) {
      preFilteredItems = items.filter(item =>
        item.creditsFrom.id === (this.state.filterOrganization) ||
        item.creditsTo.id === (this.state.filterOrganization));
    }

    return (
      <div className="page_credit_transactions">
        {this.props.loggedInUser.role &&
          !this.props.loggedInUser.role.isGovernmentRole &&
          <h3 className="credit_balance">
            Credit Balance: {
              numeral(this.props.loggedInUser.organizationBalance).format(NumberFormat.INT)
            }
          </h3>
        }
        <h1>{this.props.title}</h1>
        <div className="right-toolbar-container">
          <div className="actions-container">
            {this.props.loggedInUser.role &&
            this.props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.PROPOSE) &&
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
              >
                Propose Trade
              </button>
            }
          </div>
          {(!isFetching && this.props.loggedInUser.role.isGovernmentRole) &&
          <div className="form-group organization_filter">
            <label htmlFor="organizationFilterSelect">Show transactions involving:
              <select
                id="organizationFilterSelect"
                className="form-control"
                onChange={event => this.setState({
                  filterOrganization: parseInt(event.target.value, 10)
                })}
              >
                <option value="-1">All Organizations</option>
                {uniqueOrganizations.map(organization =>
                  (
                    <option key={organization.id.toString(10)} value={organization.id.toString(10)}>
                      {organization.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          }
        </div>
        {isFetching && <Loading />}
        {!isFetching &&
        <CreditTransferTable
          items={preFilteredItems}
          isFetching={isFetching}
          isEmpty={isEmpty}
        />
        }
      </div>
    );
  }
}

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    organizationBalance: PropTypes.number,
    role: PropTypes.shape({
      id: PropTypes.number,
      isGovernmentRole: PropTypes.bool
    })
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CreditTransactionsPage;
