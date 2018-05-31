import React, {Component} from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { DEFAULT_ORGANIZATION } from '../../constants/values';
import history from '../../app/History';
import Loading from '../../app/components/Loading';
import CreditTransferTable from './CreditTransferTable';

class CreditTransactionsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filterOrganization: 'all',
    }
  }

  render() {

      const { isFetching, items } = this.props.creditTransfers;
      const isEmpty = items.length === 0;

      const uniqueOrganizations = !isFetching ? Array.from(new Set(items.flatMap((item) => {return [item.creditsFrom.name, item.creditsTo.name];}))).sort(): [];

      let preFilteredItems = this.state.filterOrganization !== 'all' ? items.filter(
          item => {
            return item.creditsFrom.name === (this.state.filterOrganization) ||
            item.creditsTo.name === (this.state.filterOrganization)
          }
      ): items;


  return (
      <div className="page_credit_transactions">
      <h3 className="credit_balance">
        Credit Balance: {numeral(this.props.loggedInUser.organizationBalance).format(NumberFormat.INT)}
      </h3>
      <h1>{this.props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {this.props.loggedInUser.organization &&
            this.props.loggedInUser.organization.id === DEFAULT_ORGANIZATION.id &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => history.push(CREDIT_TRANSACTIONS.ADD)}
            >
              Propose Trade
            </button>
          }
        </div>
          {(!isFetching && this.props.loggedInUser.organization.id === DEFAULT_ORGANIZATION.id) &&
          <div className="form-group organization_filter">
              <label htmlFor="organizationFilterSelect">Show transactions involving:</label>
            <select id="organizationFilterSelect" className="form-control" onChange={e => this.setState({filterOrganization: e.target.value})}>
                <option value='all'>All Organizations</option>
                {uniqueOrganizations.map(organizationName => {return (<option key={organizationName} value={organizationName}>{organizationName}</option>)})}
            </select>
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
      )
  }
};

CreditTransactionsPage.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    organizationBalance: PropTypes.number
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default CreditTransactionsPage;
