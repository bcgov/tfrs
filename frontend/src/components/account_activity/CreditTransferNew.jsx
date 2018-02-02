import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes';
import * as Values from '../../constants/values';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import * as Routes from '../../constants/routes';
import { Modal } from 'react-bootstrap';
import { getLoggedInUser } from '../../actions/userActions';
import {
  getCreditTransferReset,
  addCreditTransfer,
  addCreditTransferReset } from '../../actions/accountActivityActions';
import { getFuelSuppliers } from '../../actions/organizationActions';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import TransactionHistory from './TransactionHistory';

class CreditTransferNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creditTransfer: {
        initiator: null,
        typeId: CREDIT_TRANSFER_TYPES.buy.id,
        numberOfCredits: 0,
        respondent: null,
        fairMarketValuePerCredit: 0.00,
        note: ""
      }
    };
  }

  componentDidMount() {
    console.log("statuses", CREDIT_TRANSFER_STATUS);
    console.log("logged in user", this.props.loggedInUserData);
    this.props.getFuelSuppliers();
    this.props.getLoggedInUser();

    this.state = {
      creditTransfer: {
        initiator: this.props.loggedInUserData.organization.id,
        typeId: CREDIT_TRANSFER_TYPES.buy.id,
        numberOfCredits: 0,
        respondent: null,
        fairMarketValuePerCredit: 0.00,
        note: ""
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    this.props.getCreditTransferReset();
    this.props.addCreditTransferReset();
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event, status) {
    event.preventDefault();
    const initiator = this.props.loggedInUserData.organization.id;
    const creditTradeTypeFK = this.creditTransfer.value;
    const numberOfCredits = this.creditTransfer.numberOfCredits.value;
    const respondent = this.respondent.value;
    const valuePerCredit = this.valuePerCredit.value;
    const note = this.note.value;
    const data = {
      initiator: initiator,
      numberOfCredits: numberOfCredits,
      respondent: respondent,
      valuePerCredit: valuePerCredit,
      note: note,
      status: status.id,
      creditTradeTypeFK: creditTradeTypeFK
    }
    console.log(data)
    // this.props.addCreditTransfer(data);
  }

  render() {
    return (
      <div className="credit-transfer">
        <h1>New Credit Transfer</h1>
        <div className="credit-transfer-progress-bar">
          <div className="arrow-steps clearfix">
            <div className="step"><span>Proposed</span></div>
            <div className="step"><span>Accepted</span></div>
            <div className="step"><span>Approved</span></div>
            <div className="step"><span>Complete</span></div>
          </div>
        </div>
        <div className="credit-transfer-details">
          <form className="form-inline" onSubmit={(event, status) => this.handleSubmit(event, Values.STATUS_PROPOSED)}>
            <div className="main-form">
              <span>{this.props.loggedInUserData.organization && this.props.loggedInUserData.organization.name} proposes to </span>
              <div className="form-group">
                <select
                  className="form-control"
                  id="proposal-type"
                  name="creditTradeType"
                  // ref={(input) => this.creditTransfer.type = input}
                    value={this.state.creditTransfer.typeId}
                  onChange={this.handleInputChange}>
                  <option value="1">Sell</option>
                  <option value="2">Buy</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  id="number-of-credits"
                  defaultValue="0"
                  name="numberOfCredits"
                  value={this.state.creditTransfer.numberOfCredits}
                  onChange={this.handleInputChange} />
                  {/* ref={(input) => this.numberOfCredits = input} />*/}
              </div>
              <span>{this.state.creditTradeTypeFK === "Buy" ? "credits from " : "credits to "}</span>
              <div className="form-group">
                <select
                  className="form-control"
                  id="respondent"
                  name="respondent"
                  ref={(input) => this.respondent = input}
                  onChange={(event) => this.handleInputChange(event)}>
                  { this.props.fuelSuppliers &&
                    this.props.fuelSuppliers.map((organization) => {
                      return (this.props.loggedInUserData.organization.id != organization.id) &&
                        <option key={organization.id} value={organization.id}>{organization.name}</option>
                    }
                  )}
                </select>
              </div>
              <span>for </span>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">$</span>
                  <input
                    type="number"
                    data-number-to-fixed="2"
                    className="form-control"
                    id="value-per-credit"
                    name="valuePerCredit"
                    placeholder="Amount"
                    onChange={(event) => this.handleInputChange(event)}
                    ref={(input) => this.valuePerCredit = input} />
                  <div className="input-group-addon">.00</div>
                </div>
              </div>
              <span>per credit for a total value of $</span>
              <span>{ this.state.valuePerCredit * this.state.numberOfCredits }</span>
              <span> effective on Director's Approval</span>
            </div>
            {this.props.addCreditTransferError.length > 0 &&
            <div className="alert alert-danger">
              <div>{this.props.addCreditTransferError}</div>
            </div>
            }
            <div className="form-group note">
              <label htmlFor="comment">Note:</label>
              <textarea
                className="form-control"
                rows="5"
                id="note"
                ref={(input) => this.note = input}>
              </textarea>
            </div>
            <div className="btn-container">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => this.props.history.push(Routes.ACCOUNT_ACTIVITY)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={(event, status) => this.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}>
                Save Draft
              </button>
              <button
                type="submit"
                className="btn btn-primary">
                Propose
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect (
  state => ({
    data: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER].data,
    addCreditTransferError: state.rootReducer[ReducerTypes.ADD_CREDIT_TRANSFER].errorMessage,
    fuelSuppliers: state.rootReducer[ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS].data,
    loggedInUserData: state.rootReducer[ReducerTypes.GET_LOGGED_IN_USER].data,
  }),
  dispatch => ({
    addCreditTransfer: (data) => {
      dispatch(addCreditTransfer(data));
    },
    addCreditTransferReset: () => {
      dispatch(addCreditTransferReset());
    },
    getCreditTransferReset: () => {
      dispatch(getCreditTransferReset());
    },
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    },
    getLoggedInUser: () => {
      dispatch(getLoggedInUser());
    },
  })
)(CreditTransferNew)
