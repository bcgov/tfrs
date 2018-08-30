import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import * as NumberFormat from '../../constants/numeralFormats';
import { CREDIT_TRANSFER_TYPES } from '../../constants/values';
import { getCreditTransferType } from '../../actions/creditTransfersActions';

class CreditTransferVisualRepresentation extends Component {
  _renderPart3Award () {
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-2 col-md-offset-1">
          <div className="respondent-container label-warning">
            <div>
              { this.props.creditsTo && this.props.creditsTo.name }
            </div>
          </div>
        </div>
        <div className="col-sm-4 col-md-5">
          <div className="arrow">
            <div>{numeral(this.props.numberOfCredits).format(NumberFormat.INT)} credit{this.props.numberOfCredits > 1 && 's'}</div>
            <FontAwesomeIcon icon="arrow-alt-circle-up" size="4x" /> <div>{getCreditTransferType(this.props.tradeType.id)}</div>
          </div>
        </div>
      </div>
    );
  }

  _renderRetirement () {
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-2 col-md-offset-1">
          <div className="initiator-container label-success">
            <div>
              { this.props.creditsFrom && this.props.creditsFrom.name }
            </div>
          </div>
        </div>
        <div className="col-sm-4 col-md-5">
          <div className="arrow">
            <div>{numeral(this.props.numberOfCredits).format(NumberFormat.INT)} credit{this.props.numberOfCredits > 2 && 's'}</div>
            <FontAwesomeIcon icon="arrow-alt-circle-down" size="4x" /> <div>{getCreditTransferType(this.props.tradeType.id)}</div>
          </div>
        </div>
      </div>
    );
  }

  _creditTransferIcon () {
    if (Number(this.props.numberOfCredits) === 0) {
      return { icon: 'minus', className: '' };
    }

    if (this.props.totalValue === 0.0) {
      if (this.props.tradeType.id === CREDIT_TRANSFER_TYPES.buy.id) {
        return { icon: 'arrow-left', className: '' };
      }
      if (this.props.tradeType.id === CREDIT_TRANSFER_TYPES.sell.id) {
        return { icon: 'arrow-left', className: 'fa-flip-horizontal' };
      }
    }

    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.buy.id:
      case CREDIT_TRANSFER_TYPES.sell.id:
        return { icon: 'exchange-alt', className: '' };
      default:
        return { icon: 'minus', className: '' };
    }
  }

  _renderCreditTransfer () {
    return (
      <div className="row visual-representation">
        <div className="col-sm-4 col-md-2 col-md-offset-1">
          <div className="initiator-container label-success">
            <div>
              { this.props.creditsFrom && this.props.creditsFrom.name }
            </div>
          </div>
        </div>
        <div className="col-sm-4 col-md-2">
          <div className="arrow">
            {(Number(this.props.numberOfCredits) > 0) &&
            <div>{numeral(this.props.numberOfCredits).format(NumberFormat.INT)} credit{this.props.numberOfCredits > 1 && 's'}</div>
            }
            <FontAwesomeIcon
              icon={this._creditTransferIcon().icon}
              className={this._creditTransferIcon().className}
              size="6x"
            />
            {` ${Number(this.props.totalValue) > 0 &&
            <div>{numeral(this.props.totalValue).format(NumberFormat.CURRENCY)}</div>}`}
          </div>
        </div>
        <div className="col-sm-4 col-md-3">
          <div className="respondent-container label-warning">
            <div>{this.props.creditsTo.name}</div>
          </div>
        </div>
      </div>
    );
  }

  render () {
    switch (this.props.tradeType.id) {
      case CREDIT_TRANSFER_TYPES.part3Award.id:
      case CREDIT_TRANSFER_TYPES.validation.id:
        return this._renderPart3Award();

      case CREDIT_TRANSFER_TYPES.retirement.id:
        return this._renderRetirement();

      default:
        return this._renderCreditTransfer();
    }
  }
}

CreditTransferVisualRepresentation.defaultProps = {
  creditsFrom: {
    name: 'From'
  },
  creditsTo: {
    name: 'To'
  },
  numberOfCredits: '',
  zeroDollarReason: null
};

CreditTransferVisualRepresentation.propTypes = {
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  numberOfCredits: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  totalValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
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

export default CreditTransferVisualRepresentation;
