/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { getCreditTransfersIfNeeded } from '../actions/creditTransfersActions';
import { getOrganization } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import CreditTransactionsPage from './components/CreditTransactionsPage';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';

class CreditTransactionsContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filterOrganization: -1
    };
  }

  componentDidMount () {
    this.clearUrl();
    this.loadData();

    this._selectOrganization = this._selectOrganization.bind(this);
  }

  clearUrl () {
    // Update the URL so it doesn't show the URL with the highlight
    if (this.props.match.params.id) {
      window.history.replaceState({}, 'Credit Transactions', CREDIT_TRANSACTIONS.LIST);
    }
  }

  loadData () {
    this.props.getCreditTransfersIfNeeded();
  }

  _getCreditTransfers () {
    if (this.state.filterOrganization !== -1) {
      const preFilteredItems = this.props.creditTransfers.items.filter(item =>
        item.creditsFrom.id === (this.state.filterOrganization) ||
        item.creditsTo.id === (this.state.filterOrganization));

      return {
        items: preFilteredItems,
        isFetching: this.props.creditTransfers.isFetching
      };
    }

    return this.props.creditTransfers;
  }

  _getUniqueOrganizations () {
    return (
      Array.from(new Set(this.props.creditTransfers.items.flatMap(item => [{
        id: item.creditsFrom.id,
        name: item.creditsFrom.name
      }, {
        id: item.creditsTo.id,
        name: item.creditsTo.name
      }])))
    ).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .reduce((acc, item) => (acc.find(o => o.id === item.id) ? acc : [...acc, item]), []);
  }

  _selectedOrganization () {
    if (this.state.filterOrganization === -1) {
      return false;
    }

    return this.props.organization;
  }

  _selectOrganization (organizationId) {
    if (organizationId !== -1) {
      this.props.getOrganization(organizationId);
    }

    this.setState({
      filterOrganization: organizationId
    });
  }

  render () {
    return (
      <CreditTransactionsPage
        creditTransfers={this._getCreditTransfers()}
        highlight={this.props.match.params.id}
        loggedInUser={this.props.loggedInUser}
        organization={this._selectedOrganization()}
        organizations={this._getUniqueOrganizations()}
        selectOrganization={this._selectOrganization}
        title="Credit Transactions"
      />
    );
  }
}

CreditTransactionsContainer.defaultProps = {
  match: {
    params: {
      id: null
    }
  },
  organization: null
};

CreditTransactionsContainer.propTypes = {
  creditTransfers: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  getCreditTransfersIfNeeded: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  organization: PropTypes.shape({
    name: PropTypes.string,
    organizationBalance: PropTypes.shape({
      validatedCredits: PropTypes.number
    })
  })
};

const mapStateToProps = state => ({
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  organization: state.rootReducer.organizationRequest.fuelSupplier
});

const mapDispatchToProps = dispatch => ({
  getCreditTransfersIfNeeded: () => {
    dispatch(getCreditTransfersIfNeeded());
  },
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  getOrganization: bindActionCreators(getOrganization, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionsContainer);
