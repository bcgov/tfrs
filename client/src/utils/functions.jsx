import React, {Component} from 'react';
import * as Values from '../constants/values.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import store from '../store/store.jsx';

export const plainEnglishPhrase = (data) => {
  let tradeStatus = getCreditTradeStatus(data.creditTradeStatusFK);
  let tradeRespondent = getCreditTradeRespondent(data.respondentFK);
  let tradeInitiator = getCreditTradeInitiator(data.initiatorFK);
  let tradeType = getCreditTradeType(data.creditTradeTypeFK);
  let tradeTypePast = getCreditTradeTypePast(data.creditTradeTypeFK);
  let toFrom = getToFrom(tradeType);
  switch (tradeStatus) {
    case Values.STATUS_COMPLETED:
      return (
        <PlainEnglishPhrasePast
          tradeInitiator={tradeInitiator}
          tradeTypePast={tradeTypePast}
          numberOfCredits={data.numberOfCredits}
          toFrom={toFrom}
          tradeRespondent={tradeRespondent}
          fairMarketValuePerCredit={data.fairMarketValuePerCredit}
          tradeEffectiveDate={data.tradeEffectiveDate} />
      );
    default:
      return (
        <PlainEnglishPhrase
          tradeInitiator={tradeInitiator}
          tradeType={tradeType}
          numberOfCredits={data.numberOfCredits}
          toFrom={toFrom}
          tradeRespondent={tradeRespondent}
          fairMarketValuePerCredit={data.fairMarketValuePerCredit}
          tradeEffectiveDate={data.tradeEffectiveDate} />
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

const getCreditTradeType = (tradeType) => {
  let types = store.getState().rootReducer[ReducerTypes.CREDIT_TRADE_TYPES].data;
  let typeName = types.find(function(type) {
    return type.id === tradeType
  })
  if (typeName['description'].includes('selling')) {
    return 'sell'
  } else if (typeName['description'].includes('buying')) {
    return 'buy'
  }
}

const getCreditTradeTypePast = (tradeType) => {
  let types = store.getState().rootReducer[ReducerTypes.CREDIT_TRADE_TYPES].data;
  let typeName = types.find(function(type) {
    return type.id === tradeType
  })
  if (typeName['description'].includes('selling')) {
    return 'sold'
  } else if (typeName['description'].includes('buying')) {
    return 'bought'
  }
}

const getToFrom = (tradeType) => {
  if (tradeType == 'sell') {
    return ' credits to ';
  } else if (tradeType == 'buy') {
    return ' credits from ';
  }
}

const getCreditTradeRespondent = (respondentId) => {
  let fuelSuppliers = store.getState().rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data;
  let respondent = fuelSuppliers.find(function(fuelSupplier) {
    return fuelSupplier.id === respondentId
  })
  return respondent.name
}

const getCreditTradeInitiator = (initiatorId) => {
  if (initiatorId == null) {
    return 'BC Government ';
  } else {
    let fuelSuppliers = store.getState().rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data;
    let initiator = fuelSuppliers.find(function(fuelSupplier) {
      return fuelSupplier.id === initiatorId
    })
    return initiator.name
  }
}

const PlainEnglishPhrasePast = (props) => {
  let fairMarketValuePerCredit = addCommas(Number(props.fairMarketValuePerCredit));
  let totalValue = addCommas((Number(props.numberOfCredits) * Number(props.fairMarketValuePerCredit)));
  return (
    <div className="plain-english-phrase">
      <span className="value">{props.tradeInitiator}</span> <span className="value">{props.tradeTypePast}</span> <span className="value">{props.numberOfCredits}</span> {props.toFrom} <span className="value">{props.tradeRespondent}</span> for <span className="value">${fairMarketValuePerCredit}</span> per credit for a total value of <span className="value">${totalValue}</span> effective on <span className="value">{props.tradeEffectiveDate}</span>
    </div>
  ) 
}

const PlainEnglishPhrase = (props) => {
  let fairMarketValuePerCredit = addCommas(Number(props.fairMarketValuePerCredit));
  let totalValue = addCommas((Number(props.numberOfCredits) * Number(props.fairMarketValuePerCredit)));
  return (
    <div className="plain-english-phrase">
      <span className="value">{props.tradeInitiator}</span> proposes to <span className="value">{props.tradeType}</span> <span className="value">{props.numberOfCredits}</span> {props.toFrom} <span className="value">{props.tradeRespondent}</span> for <span className="value">${fairMarketValuePerCredit}</span> per credit for a total value of <span className="value">${totalValue}</span> effective on Director's Approval.
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
      Credit Transfer - {props.tradeType} {props.toFrom} {props.respondent} - proposed {props.tradeEffectiveDate}
    </h1>
  )
}

const addCommas = (number) => {
  let parts = number.toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(Values.ADD_COMMAS_REGEX, ',');
  return parts.join('.');
}
