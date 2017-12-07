import React, {Component} from 'react';
import * as Values from '../constants/values.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import store from '../store/store.jsx';

export const plainEnglishPhrase = (data) => {
  let tradeStatus = data.status;
  let tradeRespondent = data.respondent;
  let tradeInitiator = data.initiator;
  let tradeType = data.type;
  let tradeTypePast = getCreditTradeTypePast(data.type);
  let toFrom = getToFrom(tradeType);
  switch (tradeStatus.id) {
    case Values.STATUS_COMPLETED:
      return (
        <PlainEnglishPhrasePast
          tradeInitiator={tradeInitiator}
          tradeTypePast={tradeTypePast}
          numberOfCredits={data.number_of_credits}
          toFrom={toFrom}
          tradeRespondent={tradeRespondent}
          fairMarketValuePerCredit={data.fair_market_value_per_credit}
          tradeEffectiveDate={data.trade_effective_date} />
      );
    default:
      return (
        <PlainEnglishPhrase
          tradeInitiator={tradeInitiator}
          tradeType={tradeType}
          numberOfCredits={data.number_of_credits}
          toFrom={toFrom}
          tradeRespondent={tradeRespondent}
          fairMarketValuePerCredit={data.fair_market_value_per_credit}
          tradeEffectiveDate={data.trade_effective_date} />
      );
    break;
  }
}

const getCreditTradeStatus = (tradeStatus) => {
  let statuses = store.getState().rootReducer[ReducerTypes.CREDIT_TRADE_STATUSES].data;
  let statusType = statuses.find(function(status) {
    return status.id === tradeStatus
  })
  return statusType.status;
}

const getCreditTradeTypePast = (type) => {
  if (type.the_type.includes('Sell')) {
    return 'sold'
  } else if (type.the_type.includes('Buy')) {
    return 'bought'
  }
}

const getToFrom = (tradeType) => {
  if (tradeType == 'sell') {
    return 'credits to';
  } else if (tradeType == 'buy') {
    return 'credits from';
  }
}

export const getCreditTradeRespondent = (respondentId) => {
  let organizations = store.getState().rootReducer[ReducerTypes.GET_ORGANIZATIONS].data;
  let respondent = organizations.find(function(organization) {
    return organization.id === respondentId
  })
  return respondent.name
}

export const getCreditTradeInitiator = (initiatorId) => {
  if (initiatorId == null) {
    return 'BC Government';
  } else {
    let organizations = store.getState().rootReducer[ReducerTypes.GET_ORGANIZATIONS].data;
    let initiator = organizations.find(function(organization) {
      return organization.id === initiatorId
    })
    return initiator.name
  }
}

const PlainEnglishPhrasePast = (props) => {
  let fairMarketValuePerCredit = addCommas(Number(props.fairMarketValuePerCredit));
  let totalValue = addCommas((Number(props.numberOfCredits) * Number(props.fairMarketValuePerCredit)));
  return (
    <div className="plain-english-phrase">
      <span className="value">{props.tradeInitiator.name}</span> <span className="value">{props.tradeTypePast}</span> <span className="value">{props.numberOfCredits}</span> {props.toFrom} <span className="value">{props.tradeRespondent.name}</span> for <span className="value">${fairMarketValuePerCredit}</span> per credit for a total value of <span className="value">${totalValue}</span> effective on <span className="value">{props.tradeEffectiveDate}.</span>
    </div>
  ) 
}

const PlainEnglishPhrase = (props) => {
  let fairMarketValuePerCredit = addCommas(Number(props.fairMarketValuePerCredit));
  let totalValue = addCommas((Number(props.numberOfCredits) * Number(props.fairMarketValuePerCredit)));
  return (
    <div className="plain-english-phrase">
      <span className="value">{props.tradeInitiator.name}</span> proposes to <span className="value">{props.tradeType.the_type.toLowerCase()}</span> <span className="value">{props.numberOfCredits}</span> {props.toFrom} <span className="value">{props.tradeRespondent.name}</span> for <span className="value">${fairMarketValuePerCredit}</span> per credit for a total value of <span className="value">${totalValue}</span> effective on Director's Approval.
    </div>
  )
}

export const getCreditTransferTitle = (data) => {
  let respondent = getCreditTradeRespondent(data.respondentFK);
  let tradeType = getCreditTradeType(data.creditTradeTypeFK);
  let toFrom = getToFrom(tradeType);
  return (
    <CreditTransferTitle
      respondent={respondent}
      tradeType={tradeType}
      tradeEffectiveDate={data.tradeEffectiveDate}
      toFrom={toFrom} />
  )
}

const CreditTransferTitle = (props) => {
  return (
    <h1>
      Credit Transfer - {props.tradeType} {props.toFrom} {props.respondent} {props.tradeEffectiveDate && '- proposed '} {props.tradeEffectiveDate}
    </h1>
  )
}

const addCommas = (number) => {
  let parts = number.toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(Values.ADD_COMMAS_REGEX, ',');
  return parts.join('.');
}

export const plainEnglishPhraseString = (data) => {
  let tradeStatus = data.status;
  let tradeRespondent = data.respondent;
  let tradeInitiator = data.initiator;
  let tradeType = data.type
  let tradeTypePast = getCreditTradeTypePast(data.type);
  let toFrom = getToFrom(tradeType);
  let fairMarketValuePerCredit = addCommas(Number(data.fairMarketValuePerCredit));
  let totalValue = addCommas((Number(data.numberOfCredits) * Number(data.fairMarketValuePerCredit)));
  switch (tradeStatus) {
    case Values.STATUS_COMPLETED:
      return (
        tradeInitiator + ' ' + tradeTypePast + ' ' +  data.numberOfCredits + ' ' + toFrom + ' ' + tradeRespondent + ' for $' + fairMarketValuePerCredit + ' per credit for a total value of $' + totalValue + ' effective on ' + data.tradeEffectiveDate + '.'
      );
    default:
      return (
        tradeInitiator + ' proposes to ' + tradeType + ' ' +  data.numberOfCredits + ' ' + toFrom + ' ' + tradeRespondent + ' for $' + fairMarketValuePerCredit + ' per credit for a total value of $' + totalValue + " effective on Director's Approval."
      );
    break;
  }
}