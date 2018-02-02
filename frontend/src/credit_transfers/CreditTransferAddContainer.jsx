import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import history from '../app/History';
import * as Routes from '../constants/routes';

import { getFuelSuppliers } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import { addCreditTransfer } from '../actions/creditTransfersActions';

import { CREDIT_TRANSFER_STATUS } from '../constants/values';

import CreditTransferForm from './components/CreditTransferForm';

class CreditTransferAddContainer extends Component {
  // static redirectToPage (page) {
  //   history.push(page);
  // }

  constructor (props) {
    super(props);
    this.state = {
      fields: {
        initiator: {},
        tradeType: { id: 1 },
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

    console.log(typeof fieldState[name], value, name);

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
      console.log('setting number here to', id);
      fieldState[name] = { id: id || 0 };
      console.log(fieldState);
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    console.log(event, status);
    console.log(this.state);

    let transferStatus = status || CREDIT_TRANSFER_STATUS.propose;

    // API data structure
    const data = {
      initiator: this.state.fields.initiator.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      fairMarketValuePerCredit: parseInt(this.state.fields.fairMarketValuePerCredit, 10),
      note: this.state.fields.note,
      status: CREDIT_TRANSFER_STATUS.draft.id,
      type: this.state.fields.tradeType.id,
      tradeEffectiveDate: null
    };

    console.log("submitting", data);

    // TODO: Add more validation here?

    this.props.addCreditTransfer(
      data,
      history.push(Routes.CREDIT_TRANSACTIONS)
    );
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
  addCreditTransfer: PropTypes.func.isRequired,
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
  },
  addCreditTransfer: (data) => {
    dispatch(addCreditTransfer(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferAddContainer);
