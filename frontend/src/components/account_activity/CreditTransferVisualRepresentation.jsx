import React, { Component } from 'react';
import * as Values from '../../constants/values.jsx';
import { FormattedNumber } from 'react-intl';

export default class CreditTransferVisualRepresentation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cost = this.props.data.fair_market_value_per_credit * this.props.data.number_of_credits;
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-2 col-md-offset-1">
          <div className="initiator-container label-success">
            <div>{this.props.data.initiator && this.props.data.initiator != null ? this.props.data.initiator.name : Values.DEFAULT_INITIATOR}</div>
          </div>
        </div>
        <div className="col-sm-4 col-md-2">
          <div className="arrow">
            <div>{this.props.data.number_of_credits} credit{this.props.data.number_of_credits > 2 && 's'}</div>
            <i className="fa fa-exchange"></i>
            <div><FormattedNumber value={cost} style="currency" currency="CAD"/> </div>
          </div>
        </div>
        <div className="col-sm-4 col-md-3">
          <div className="respondent-container label-warning">
            <div>{this.props.data.respondent.name}</div>
            <div>Status: Sell Only</div>
          </div>
        </div>
      </div>
    )
  }
}