import React, { Component } from 'react';
import { getCreditTradeRespondent } from '../../utils/functions.jsx';
import * as Values from '../../constants/values.jsx';

export default class CreditTransferVisualRepresentation extends Component {
  constructor(props) {
    super(props);
    console.log("this is the data", this.props.data)
    //determineBuyerandSeller()
  }

  determineBuyerandSeller(){
    // let seller = # logic to choose seller here.
    // let buyer = # logic to choose buyer based on the type here

    /*
    this.setState({
      //update the state here
      seller: seller,
      numberOfCredits: this.props.data.numberOfCredits
      buyer: buyer
    })
    */
  }
  
  render() {
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-2 col-md-offset-1">
          <div className="initiator-container label-success">
            {/* this.state.seller*/}
            <div>{this.props.data.initiatorFK && this.props.data.initiatorFK != null ? getCreditTradeRespondent(this.props.data.initiatorFK) : Values.DEFAULT_INITIATOR}</div>
            <div>Available: 65,000</div>
          </div>
        </div>
        <div className="col-sm-4 col-md-2">
          <div className="arrow">
            <div>25,000 credits</div>
            {/* <i className="fa fa-arrow-circle-right"></i> */}
            <i className="fa fa-exchange"></i>
            {/* this.state.credit */}
            <div>$13,250,365.00</div>
          </div>
        </div>
        <div className="col-sm-4 col-md-3">
          <div className="respondent-container label-warning">
            {/* this.state.buyer */}
            <div>{this.props.data.respondentFK && getCreditTradeRespondent(this.props.data.respondentFK)}</div>
            <div>Status: Sell Only</div>
          </div>
        </div>
      </div>
    )
  }
}