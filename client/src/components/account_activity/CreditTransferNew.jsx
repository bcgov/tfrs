import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Values from '../../constants/values.jsx';
import * as Routes from '../../constants/routes.jsx';
import { Modal } from 'react-bootstrap';
import { 
  getCreditTransfer,
  getCreditTransferReset,
  addCreditTransfer } from '../../actions/accountActivityActions.jsx';
import { getFuelSuppliers } from '../../actions/fuelSuppliersActions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import TransactionHistory from './TransactionHistory.jsx';

class CreditTransferNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creditTradeTypeFK: '',
      valuePerCredit: '',
      numberOfCredits: '',
    };
  }

  componentWillUnmount() {
    this.props.getCreditTransferReset();
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
    const initiatorFK = this.props.fuelSuppliers[0].id;
    const creditTradeTypeFK = this.creditTradeTypeFK.value;
    const numberOfCredits = this.numberOfCredits.value;
    const respondentFK = this.respondent.value;
    const valuePerCredit = this.valuePerCredit.value;
    const creditTradeStatusFK = status
    const note = this.note.value;
    const data = {
      initiatorFK: initiatorFK,
      numberOfCredits: numberOfCredits,
      respondentFK: respondentFK,
      valuePerCredit: valuePerCredit,
      note: note,
      creditTradeStatusFK: creditTradeStatusFK,
      creditTradeTypeFK: creditTradeTypeFK
    }
    this.props.addCreditTransfer(data);
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
              <span>{this.props.fuelSuppliers && this.props.fuelSuppliers[0].name} proposes to </span>
              <div className="form-group">
                <select 
                  className="form-control" 
                  id="proposal-type" 
                  name="creditTradeTypeFK"
                  ref={(input) => this.creditTradeTypeFK = input}
                  onChange={(event) => this.handleInputChange(event)}>
                  <option value="1">Sell</option>
                  <option value="2">Buy</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="number-of-credits" 
                  name="numberOfCredits"
                  onChange={(event) => this.handleInputChange(event)}
                  ref={(input) => this.numberOfCredits = input} />
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
                    this.props.fuelSuppliers.map((fuelSupplier) => (
                      <option value={fuelSupplier.id}>{fuelSupplier.name}</option>
                  ))}
                </select>
              </div>
              <span>for </span>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="value-per-credit" 
                  name="valuePerCredit"
                  onChange={(event) => this.handleInputChange(event)}
                  ref={(input) => this.valuePerCredit = input} />
              </div>
              <span>per credit for a total value of $</span>
              <span>{ this.state.valuePerCredit * this.state.numberOfCredits }</span>
              <span> effective on Director's Approval</span>
            </div>
            <div className="alert-warning">
            </div>
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
                onClick={(event, status) => this.handleSubmit(event, Values.STATUS_DRAFT)}>
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
        <TransactionHistory />
      </div>
    );
  }
}

export default connect (
  state => ({
    data: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER].data,
    fuelSuppliers: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data,
  }),
  dispatch => ({
    getCreditTransfer: (id) => {
      dispatch(getCreditTransfer(id));
    },
    addCreditTransfer: (data) => {
      dispatch(addCreditTransfer(data));
    },
    getCreditTransferReset: () => {
      dispatch(getCreditTransferReset());
    },
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    }
  })
)(CreditTransferNew)
