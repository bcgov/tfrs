import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Routes from '../../constants/routes.jsx';
import { Link } from 'react-router-dom';
import { getCreditTransfer, getCreditTransferReset } from '../../actions/accountActivityActions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class Opportunity extends Component {
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
    const buyerType = this.buyerType.value;
    const valuePerCredit = this.valuePerCredit.value;
    const note = this.note.value;
    const opportunityAcknowledgement = this.opportunityAckowledgement.checked;
    debugger;
  }
  
  render() {
    return (
      <div className="opportunity">
        <h1>Opportunity {this.props.data.respondent && "Created " + this.props.data.trade_effective_date}</h1>
        <div className="credit-transfer-details">
          { (this.props.data.initiator || !this.props.match.params.id) &&
            <form className="form-inline" onSubmit={(event) => this.handleSubmit(event)}>
              <div className="main-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="initiator" 
                    name="initiator"
                    defaultValue={this.props.data.initiator}
                    ref={(input) => this.initiator = input} />
                </div>
                <span>proposes to </span>
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
                <span>{this.state.proposalType === "Buy" ? "credits from any " : "credits to any "}</span>
                <div className="form-group">
                  <select 
                    className="form-control" 
                    id="proposal-type" 
                    name="proposalType"
                    ref={(input) => this.buyerType = input}
                    onChange={(event) => this.handleInputChange(event)}>
                    <option>Part 3 Fuel Supplier</option>
                    <option>Part 2 Fuel Supplier</option>
                  </select>
                </div>
                <span>for </span>
                <div className="form-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    id="value-per-credit" 
                    name="valuePerCredit"
                    defaultValue={this.props.data.fair_market_value_per_credit}
                    ref={(input) => this.valuePerCredit = input} />
                </div>
                <span>per credit for a total value of $</span>
                <span>
                { this.props.data.fair_market_value_per_credit && this.props.data.number_of_credits ?
                  this.props.data.fair_market_value_per_credit * this.props.data.number_of_credits 
                  :
                  '_______'
                }
                </span>
                <span> effective on Director's Approval</span>
              </div>
              <div className="checkbox-inline acknowledgement">
                <label>
                  <input 
                    type="checkbox" 
                    id="opportunity-acknowledgement" 
                    name="opportunityAcknowledgement"
                    ref={(input) => this.opportunityAckowledgement = input} />
                  I acknowledge that an "Accept" action by a Fuel Supplier will result in an Accepted Offer submitted to the Director
                </label>
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
              { this.props.match.params.id ? 
                <div className="opportunity-actions-container">
                  <Link to={Routes.OPPORTUNITIES} className="btn btn-default">Cancel</Link>
                  <button type="button" className="btn btn-danger">Un-Publish Opportunity</button>
                  <button type="submit" className="btn btn-primary">Update Opportunity</button>
                </div>
              :
                <div className="opportunity-actions-container">
                  <Link to={Routes.OPPORTUNITIES} className="btn btn-default">Cancel</Link>
                  <button type="submit" className="btn btn-primary">Publish Opportunity</button>
                </div>
              }
            </form>
          }
        </div>
      </div>
    );
  }
}

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
)(Opportunity )
