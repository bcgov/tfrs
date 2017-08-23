import React, { Component } from 'react';
import { getCreditTradeRespondent } from '../../utils/functions.jsx';

export default class CreditTransferVisualRepresentation extends Component {
  render() {
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-3 col-md-offset-1">
          <div className="initiator-container label-success">
            <div>{this.props.data.initiatorFK && getCreditTradeRespondent(this.props.data.initiatorFK)}</div>
            <div>Available: 15,000</div>
          </div>
        </div>
        <div className="col-sm-4 col-md-2">
          <div className="arrow">
            <i className="fa fa-arrow-circle-right"></i>
            <div>10,000</div>
          </div>
        </div>
        <div className="col-sm-4 col-md-3">
          <div className="respondent-container label-warning">
            <div>{this.props.data.respondentFK && getCreditTradeRespondent(this.props.data.respondentFK)}</div>
            <div>Status: Sell Only</div>
          </div>
        </div>
      </div>
    )
  }
}