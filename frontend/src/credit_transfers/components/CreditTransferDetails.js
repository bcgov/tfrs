/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';

import Loading from '../../app/components/Loading';

import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormButtons from './CreditTransferFormButtons';

const CreditTransferDetails = props => (
  <div className="credit-transfer">
    {props.isFetching && <Loading />}
    {!props.isFetching &&
      <div>
        <h1>{props.title}</h1>
        <CreditTransferProgress />
        <div className="credit-transfer-details">
          <div className="main-form">
            <span>
              {`${props.creditsFrom && props.creditsFrom.name} proposes to `}
              {props.tradeType && props.tradeType.theType.toLowerCase()}
              &nbsp;{props.numberOfCredits}
              &nbsp;credit{(props.numberOfCredits > 1) && 's'} to&nbsp;
              {`${props.creditsTo && props.creditsTo.name} for `}
              {numeral(props.fairMarketValuePerCredit).format(NumberFormat.CURRENCY)}
              &nbsp;per credit for a total value of&nbsp;
              {numeral(props.totalValue).format(NumberFormat.CURRENCY)}
              &nbsp;effective on Director&apos;s Approval
            </span>
          </div>
        </div>
        <CreditTransferVisualRepresentation
          creditsFrom={props.creditsFrom}
          creditsTo={props.creditsTo}
          numberOfCredits={props.numberOfCredits}
          totalValue={props.totalValue}
        />
        <div>{props.note}</div>
        <form onSubmit={e => e.preventDefault()}>
          <CreditTransferFormButtons
            changeStatus={props.changeStatus}
          />
        </form>
      </div>
    }
  </div>
);

CreditTransferDetails.defaultProps = {
  title: 'Credit Transfer',
  totalValue: '0',
  numberOfCredits: '0',
  fairMarketValuePerCredit: '0',
  creditsFrom: {
    name: '...'
  },
  creditsTo: {
    name: '...'
  },
  tradeType: {
    theType: 'sell'
  }
};

CreditTransferDetails.propTypes = {
  title: PropTypes.string,
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  tradeType: PropTypes.shape({
    name: PropTypes.string,
    theType: PropTypes.string,
    id: PropTypes.number
  }),
  numberOfCredits: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  fairMarketValuePerCredit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  note: PropTypes.string,
  totalValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  changeStatus: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired

};

export default CreditTransferDetails;
