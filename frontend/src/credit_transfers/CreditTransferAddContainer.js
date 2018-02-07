/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Routes from '../constants/routes';

import history from '../app/History';
import { getFuelSuppliers } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import { addCreditTransfer } from '../actions/creditTransfersActions';

import { CREDIT_TRANSFER_STATUS } from '../constants/values';

import CreditTransferForm from './components/CreditTransferForm';

class CreditTransferAddContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fields: {
        initiator: {},
        tradeType: { id: 1, name: 'Sell' },
        numberOfCredits: '',
        respondent: { id: 0, name: '' },
        fairMarketValuePerCredit: '',
        tradeStatus: CREDIT_TRANSFER_STATUS.draft,
        note: ''
      },
      creditsFrom: {},
      creditsTo: {},
      totalValue: 0
    };

    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
  }

  componentDidMount () {
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    // Set the initiator as the logged in user's organization
    const fieldState = { ...this.state.fields };
    fieldState.initiator = this.props.loggedInUser.organization;
    this.setState({
      fields: fieldState,
      creditsFrom: fieldState.initiator
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    // console.log(typeof fieldState[name], value, name);

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
    const fieldState = { ...this.state.fields };
    if (name === 'respondent') {
      // Populate the dropdown
      const respondents = this.props.fuelSuppliers.filter((fuelSupplier) => {
        return fuelSupplier.id === id;
      });

      fieldState.respondent = respondents.length === 1 ? respondents[0] : { id: 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else if (name === 'tradeType') {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      });
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    // API data structure
    const data = {
      initiator: this.state.fields.initiator.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      fairMarketValuePerCredit: parseInt(this.state.fields.fairMarketValuePerCredit, 10),
      note: this.state.fields.note,
      status: this.state.fields.tradeStatus.id,
      type: this.state.fields.tradeType.id,
      tradeEffectiveDate: null
    };

    console.log('submitting', data);

    // TODO: Add more validation here?

    this.props.addCreditTransfer(
      data,
      () => { history.push(Routes.CREDIT_TRANSACTIONS); }
    );

    return false;
  }

  _changeStatus (status) {
    this.changeObjectProp(status.id, 'tradeStatus');
  }

  changeFromTo (tradeType, initiator, respondent) {
    // Change the creditsFrom and creditsTo according to the trade type
    let creditsFrom = initiator;
    let creditsTo = respondent;
    if (tradeType.id === 2) {
      creditsFrom = respondent;
      creditsTo = initiator;
    }

    this.setState({ creditsFrom, creditsTo });
  }

  computeTotalValue (name) {
    // Compute the total value when the fields change
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
        creditsFrom={this.state.creditsFrom}
        creditsTo={this.state.creditsTo}
        errors={this.props.errors}
        changeStatus={this._changeStatus}
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
  errors: PropTypes.shape({})
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  errors: state.rootReducer.creditTransfer.errors
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
