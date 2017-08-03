import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { getCreditTransfer, getCreditTransferReset } from '../../actions/accountActivityActions.jsx';

class CreditTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalType: '',
    };
  }


  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getCreditTransfer(this.props.match.params.id);
    }
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

  handleSubmit(event) {
    event.preventDefault();
    const initiator = this.initiator.value;
    const numberOfCredits = this.numberOfCredits.value;
    const respondent = this.respondent.value;
    const valuePerCredit = this.valuePerCredit.value;
  }
  
  render() {
    return (
      <div className="credit-transfer">
        <h1>Credit Transfer {this.props.data.respondent && "Sell to " + this.props.data.respondent + " Proposed " + this.props.data.trade_effective_date}</h1>
        <div className="credit-transfer-details">
          { this.props.data.initiator &&
            <form className="form-inline" onSubmit={(event) => this.handleSubmit(event)}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  id="initiator" 
                  name="initiator"
                  defaultValue={this.props.data.initiator}
                  ref={(input) => this.initiator = input} />
              </div>
              <span>proposes to</span>
              <div className="form-group">
                <select 
                  className="form-control" 
                  id="proposal-type" 
                  name="proposalType"
                  ref={(input) => this.proposalType = input}
                  onChange={(event) => this.handleInputChange(event)}>
                  <option>Sell</option>
                  <option>Buy</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="number-of-credits" 
                  name="numberOfCredits"
                  defaultValue={this.props.data.number_of_credits}
                  ref={(input) => this.numberOfCredits = input} />
              </div>
              <span>credits to</span>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  id="respondent" 
                  name="respondent"
                  defaultValue={this.props.data.respondent}
                  ref={(input) => this.respondent = input} />
              </div>
              <span>for</span>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="value-per-credit" 
                  name="valuePerCredit"
                  defaultValue={this.props.data.fair_market_value_per_credit}
                 ref={(input) => this.valuePerCredit = input} />
              </div>
              <span>per credit for a total value of</span>
              <span>{
                this.props.data.fair_market_value_per_credit * this.props.data.number_of_credits
              }</span>
              <span>effective on Director's Approval</span>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          }
        </div>
      </div>
    );
  }
}

  // initiator: 'BC Any Fuels',
  // respondent: 'Ultramor', 
  // trade_effective_date: Date.now(),
  // number_of_credits: 100,
  // fair_market_value_per_credit: 10,

export default connect (
  state => ({
    data: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER].data
  }),
  dispatch => ({
    getCreditTransfer: (id) => {
      dispatch(getCreditTransfer(id));
    },
    getCreditTransferReset: () => {
      dispatch(getCreditTransferReset());
    }
  })
)(CreditTransfer)
