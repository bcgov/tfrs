import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getFuelSuppliers } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';

import CreditTransferForm from './components/CreditTransferForm';

class CreditTransferAddContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      initiator: {},
      tradeType: { id: 0 },
      numberOfCredits: '',
      respondent: { id: 0 },
      fairMarketValuePerCredit: '',
      tradeStatus: { id: 0 },
      totalValue: 0,
      note: ''
    };

    this._handleInputChange = this._handleInputChange.bind(this);
  }

  componentDidMount () {
    // this.props.getLoggedInUser();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    // Set the initiator as the logged in user's organization
    this.setState({
      initiator: this.props.loggedInUser.organization
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    if (typeof this.state[name] === 'object') {
      this.setState({ [name]: { id: parseInt(value, 10) || 0 } });
    } else {
      this.setState({ [name]: value }, () => this.computeTotalValue(name));
    }
  }

  handleSubmit (event, status) {
    event.preventDefault();

    console.log(event, status);
    console.log(this.state);

    const data = {
      initiator: this.state.initiator.id,
      number_of_credits: this.state.numberOfCredits,
      respondent: this.respondent.id,
      fair_market_value_per_credit: this.state.fairMarketValuePerCredit,
      note: this.note,
      status: CREDIT_TRANSFER_STATUS.draft.id,
      credit_trade_type: this.state.tradeType.id
    };

    console.log("submitting", data);

    // this.props.addCreditTransfer(data);
  }

  computeTotalValue (name) {
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.numberOfCredits * this.state.fairMarketValuePerCredit
      });
    }
  }

  render () {
    return (
      <CreditTransferForm
        fuelSuppliers={this.props.fuelSuppliers}
        title="New Credit Transfer"
        initiator={this.state.initiator}
        tradeType={this.state.tradeType}
        numberOfCredits={this.state.numberOfCredits}
        respondent={this.state.respondent}
        fairMarketValuePerCredit={this.state.fairMarketValuePerCredit}
        totalValue={this.state.totalValue}
        note={this.state.note}
        tradeStatus={this.state.tradeStatus}
        handleInputChange={this._handleInputChange}
        handleSubmit={this.handleSubmit}
        history={this.props.history}
        errors=''
      />
    );
  }
}

CreditTransferAddContainer.propTypes = {
  getLoggedInUser: PropTypes.func.isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers
});

const mapDispatchToProps = dispatch => ({
  getFuelSuppliers: () => {
    dispatch(getFuelSuppliers());
  },
  getLoggedInUser: () => {
    dispatch(getLoggedInUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferAddContainer);
