import * as Values from '../constants/values.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import store from '../store/store.jsx';

export const plainEnglishPhrase = (data) => {
  let tradeStatus = getCreditTradeStatus(data.creditTradeStatusFK);
  let tradeRespondent = getCreditTradeRespondent(data.respondentFK);
  let tradeType = getCreditTradeType(data.creditTradeTypeFK);
  switch (tradeStatus) {
    case Values.STATUS_COMPLETED:
      return (
        'Completed'
      );
    default:
      return (
        'BC Government' + ' proposes to ' + tradeType + ' ' + data.numberOfCredits + ' credits to ' + tradeRespondent + ' for $' + data.fairMarketValuePerCredit + ' per credit for a total value of $' + (Number(data.numberOfCredits) * Number(data.fairMarketValuePerCredit)) + ', effective on ' + data.tradeEffectiveDate  
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

const getCreditTradeRespondent = (respondentId) => {
  let fuelSuppliers = store.getState().rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data;
  let respondent = fuelSuppliers.find(function(fuelSupplier) {
    return fuelSupplier.id === respondentId
  })
  return respondent.name
}