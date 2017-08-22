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
        tradeInitiator + ' ' + tradeTypePast + ' ' + data.numberOfCredits + toFrom + tradeRespondent + ' for $' + data.fairMarketValuePerCredit + ' per credit for a total value of $' + (Number(data.numberOfCredits) * Number(data.fairMarketValuePerCredit)) + ', effective on ' + data.tradeEffectiveDate  
      );
    default:
      return (
        tradeInitiator + ' proposes to ' + tradeType + ' ' + data.numberOfCredits + toFrom + tradeRespondent + ' for $' + data.fairMarketValuePerCredit + ' per credit for a total value of $' + (Number(data.numberOfCredits) * Number(data.fairMarketValuePerCredit)) + ", effective on Director's Approval"
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