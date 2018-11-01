import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, ZERO_DOLLAR_REASON } from '../../constants/values';

class CreditTransferTextRepresentation extends Component {
  constructor (props) {
    super(props);

    this.compliancePeriod = (this.props.compliancePeriod) ? this.props.compliancePeriod.description : '';
    this.creditsFrom = this.props.creditsFrom.name;
    this.creditsTo = this.props.creditsTo.name;
    this.fairMarketValuePerCredit =
      numeral(this.props.fairMarketValuePerCredit).format(NumberFormat.CURRENCY);
    this.numberOfCredits = numeral(this.props.numberOfCredits).format(NumberFormat.INT);
    this.totalValue = numeral(this.props.totalValue).format(NumberFormat.CURRENCY);
    this.tradeEffectiveDate = (this.props.tradeEffectiveDate)
      ? moment(this.props.tradeEffectiveDate).format('LL') : "on Director's approval";

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.draft.id) {
      this.tradeStatus = 'Drafted';
    } else {
      this.tradeStatus = Object.values(CREDIT_TRANSFER_STATUS).find(element =>
        element.id === this.props.status.id).description;
    }
  }

  _buyAction () {
    switch (this.props.status.id) {
      case CREDIT_TRANSFER_STATUS.approved.id:
        return ' bought ';
      case CREDIT_TRANSFER_STATUS.refused.id:
        return ' proposed to buy ';
      default:
        return ' is proposing to buy ';
    }
  }

  _renderBuy () {
    return (
      <div className="text-representation">
        <span className="value">{this.creditsTo}</span> {this._buyAction()}
        <span className="value"> {this.numberOfCredits} </span> credit{(this.props.numberOfCredits > 1) && 's'} from
        <span className="value"> {this.creditsFrom} </span>
        for <span className="value"> {this.totalValue}</span>
        {this._statusText(this.props.creditsFrom)}
        {this.props.zeroDollarReason != null &&
        <div className="zero-reason">
          <span>The fair market value per credit is zero because:
            <span className="value">
              {Object.values(ZERO_DOLLAR_REASON)
                .find(zd => zd.id === this.props.zeroDollarReason.id)
                .textRepresentationDescription}
            </span>
          </span>
        </div>
        }
      </div>
    );
  }

  _renderDefault () {
    return (
      <div className="text-representation">
        A credit transfer of
        <span className="value"> {this.numberOfCredits} </span> credit{(this.props.numberOfCredits > 1) && 's'} for
        <span className="value"> {this.creditsTo} </span>
        has been <span className="value lowercase"> {this.tradeStatus} </span>
        effective <span className="value"> {this.tradeEffectiveDate}</span>.
      </div>
    );
  }

  _renderPart3Award () {
    return (
      <div className="text-representation">
        An <span className="value">award</span> of
        <span className="value"> {this.numberOfCredits} </span>
        credit{(this.props.numberOfCredits > 1) && 's'} earned by
        <span className="value"> {this.creditsTo} </span> for the completion of a
        Part 3 Agreement milestone(s) has been
        <span className="value lowercase"> {this.tradeStatus}</span>
        {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
          <span>, effective
            <span className="value"> {this.tradeEffectiveDate}</span>
          </span>
        }.
      </div>
    );
  }

  _renderRetirement () {
    return (
      <div className="text-representation">
        A <span className="value">reduction</span> of
        <span className="value"> {this.numberOfCredits} </span>
        credit{(this.props.numberOfCredits > 1) && 's'} earned by
        <span className="value"> {this.creditsFrom} </span>
        has been <span className="value lowercase"> {this.tradeStatus}</span>
        {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
          <span>, effective
            <span className="value"> {this.tradeEffectiveDate}</span>
          </span>
        }.
      </div>
    );
  }

  _renderSell () {
    return (
      <div className="text-representation">
        <span className="value">{this.creditsFrom}</span> {this._sellAction()}
        <span className="value"> {this.numberOfCredits} </span> credit{(this.props.numberOfCredits > 1) && 's'} to
        <span className="value"> {this.creditsTo} </span>
        for <span className="value"> {this.fairMarketValuePerCredit} </span> per credit
        for a total value of <span className="value"> {this.totalValue}</span>
        {this._statusText(this.props.creditsTo)}
        {this.props.zeroDollarReason != null &&
          <div className="zero-reason">
            <span>The fair market value per credit is zero because:
              <span className="value">
                {Object.values(ZERO_DOLLAR_REASON)
                  .find(zd => zd.id === this.props.zeroDollarReason.id)
                  .textRepresentationDescription}
              </span>
            </span>
          </div>
        }
      </div>
    );
  }

  _renderValidation () {
    return (
      <div className="text-representation">
        A <span className="value">validation</span> of
        <span className="value"> {this.numberOfCredits} </span>
        credit{(this.props.numberOfCredits > 1) && 's'} earned by
        <span className="value"> {this.creditsTo} </span>
        has been <span className="value lowercase"> {this.tradeStatus}</span>
        {this.props.status.id === CREDIT_TRANSFER_STATUS.approved.id &&
          <span>, effective
            <span className="value"> {this.tradeEffectiveDate}</span>
          </span>
        }.
      </div>
    );
  }

  _rescindedBy () {
    const rescindedBy = this.props.history.find(history => (history.isRescinded));

    if (rescindedBy) {
      return [
        <span key="rescinded-by" className="value"> {rescindedBy.user.organization.name} </span>,
        <span key="rescinded-by-text">rescinded the proposal.</span>
      ];
    }

    return false;
  }

  _sellAction () {
    if (this.props.isRescinded) {
      return ' proposed to sell ';
    }

    switch (this.props.status.id) {
      case CREDIT_TRANSFER_STATUS.approved.id:
        return ' sold ';
      case CREDIT_TRANSFER_STATUS.refused.id:
        return ' proposed to sell ';
      default:
        return ' is proposing to sell ';
    }
  }

  _statusText (respondent) {
    if (this.props.isRescinded) {
      return <span>. {this._rescindedBy()}</span>;
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.refused.id) {
      return <span>. <span className="value"> {respondent.name} </span> refused the proposal.</span>;
    }

    if (this.props.status.id === CREDIT_TRANSFER_STATUS.declinedForApproval.id) {
      return <span>. The proposal was declined.</span>;
    }
    return <span>, effective <span className="value"> {this.tradeEffectiveDate}</span>.</span>;
  }

  render () {
    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.buy.id:
        return this._renderBuy();

      case CREDIT_TRANSFER_TYPES.part3Award.id:
        return this._renderPart3Award();

      case CREDIT_TRANSFER_TYPES.retirement.id:
        return this._renderRetirement();

      case CREDIT_TRANSFER_TYPES.sell.id:
        return this._renderSell();

      case CREDIT_TRANSFER_TYPES.validation.id:
        return this._renderValidation();

      default:
        return this._renderDefault();
    }
  }
}

CreditTransferTextRepresentation.defaultProps = {
  compliancePeriod: {
    description: ''
  },
  creditsFrom: {
    name: 'From'
  },
  creditsTo: {
    name: 'To'
  },
  history: [],
  isRescinded: false,
  tradeEffectiveDate: '',
  zeroDollarReason: null
};

CreditTransferTextRepresentation.propTypes = {
  compliancePeriod: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string
  }),
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  fairMarketValuePerCredit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    creditTradeUpdateTime: PropTypes.string,
    isRescinded: PropTypes.bool,
    status: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string
    }),
    user: PropTypes.shape({
      displayName: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string
    })
  })),
  isRescinded: PropTypes.bool,
  numberOfCredits: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }).isRequired,
  totalValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  tradeEffectiveDate: PropTypes.string,
  tradeType: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    theType: PropTypes.string
  }).isRequired,
  zeroDollarReason: PropTypes.shape({
    id: PropTypes.number,
    reason: PropTypes.string
  })
};

export default CreditTransferTextRepresentation;
