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
      fields: {
        initiator: {},
        tradeType: { id: 0 },
        numberOfCredits: '',
        respondent: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        tradeStatus: { id: 0 },
        note: ''
      },
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    // Set the initiator as the logged in user's organization
    const fieldState = { ...this.state.fields };
    fieldState.initiator = this.props.loggedInUser.organization;
    this.setState({
      fields: fieldState
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      }, () => this.computeTotalValue(name));
    }
  }

  changeObjectProp (id, name) {
    let fieldState = { ...this.state.fields };
    if (name === 'respondent') {
      const respondents = this.props.fuelSuppliers.filter((fuelSupplier) => {
        return fuelSupplier.id === id;
      });

      fieldState.respondent = respondents.length === 1 ? respondents[0] : { id: 0 };
      this.setState({
        fields: fieldState
      });
    } else {
      fieldState = { id: id || 0 };
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    console.log(event, status);
    console.log(this.state);

    const data = {
      initiator: this.state.fields.initiator.id,
      number_of_credits: this.state.fields.numberOfCredits,
      respondent: this.state.fields.respondent.id,
      fair_market_value_per_credit: this.state.fields.fairMarketValuePerCredit,
      note: this.state.fields.note,
      status: CREDIT_TRANSFER_STATUS.draft.id,
      credit_trade_type: this.state.fields.tradeType.id
    };

    console.log("submitting", data);

    // this.props.addCreditTransfer(data);
  }

  computeTotalValue (name) {
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.fairMarketValuePerCredit
      });
    }
  }

  render () {
    return (
      <CreditTransferForm
        fuelSuppliers={this.props.fuelSuppliers}
        title="New Credit Transfer"
        fields={this.state.fields}
        totalValue={this.state.totalValue}
        tradeStatus={this.state.tradeStatus}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        history={this.props.history}
        errors=''
      />
    );
  }
}

CreditTransferAddContainer.propTypes = {
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
