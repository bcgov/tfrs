import React from 'react';
import * as Values from '../constants/values';
import * as ReducerTypes from '../constants/reducerTypes';
import store from '../store/store';

export const plainEnglishPhrase = (data) => {
  const tradeStatus = data.status;
  const tradeRespondent = data.respondent;
  const tradeInitiator = data.initiator;
  const tradeType = data.type;
  const tradeTypePast = getCreditTradeTypePast(data.type);
  const toFrom = getToFrom(tradeType);

  switch (tradeStatus.id) {
    case Values.STATUS_COMPLETED:
      return (
        <PlainEnglishPhrasePast
          tradeInitiator={tradeInitiator}
          tradeTypePast={tradeTypePast}
          numberOfCredits={data.numberOfCredits}
          toFrom={toFrom}
          tradeRespondent={tradeRespondent}
          fairMarketValuePerCredit={data.fairMarketValuePerCredit}
          tradeEffectiveDate={data.tradeEffectiveDate}
        />
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
          tradeEffectiveDate={data.trade_effective_date}
        />
      );
  }
};

export const getCreditTradeStatus = (tradeStatus) => {
  const statuses = store.getState().rootReducer[ReducerTypes.CREDIT_TRADE_STATUSES].data;
  const statusType = statuses.find(status => (status.id === tradeStatus));
  return statusType.status;
};

const getCreditTradeTypePast = (type) => {
  if (type.theType.includes('Sell')) {
    return 'sold';
  } else if (type.theType.includes('Buy')) {
    return 'bought';
  }

  return false;
};

const getToFrom = (tradeType) => {
  if (tradeType === 'sell') {
    return 'credits to';
  } else if (tradeType === 'buy') {
    return 'credits from';
  }

  return false;
};

const PlainEnglishPhrasePast = (item) => {
  const fairMarketValuePerCredit = addCommas(Number(item.fairMarketValuePerCredit));
  const totalValue = addCommas((Number(item.numberOfCredits) *
    Number(item.fairMarketValuePerCredit)));

  return (
    <div className="plain-english-phrase">
      <span className="value">{item.tradeInitiator.name} </span>
      <span className="value">{item.tradeTypePast} </span>
      <span className="value">{item.numberOfCredits} </span>
      {item.toFrom} <span className="value">{item.tradeRespondent.name} </span>
      for <span className="value">${fairMarketValuePerCredit} </span>
      per credit for a total value of <span className="value">${totalValue} </span>
      effective on <span className="value">{item.tradeEffectiveDate}.</span>
    </div>
  );
};

const PlainEnglishPhrase = (item) => {
  const fairMarketValuePerCredit = addCommas(Number(item.fairMarketValuePerCredit));
  const totalValue = addCommas((Number(item.numberOfCredits) *
    Number(item.fairMarketValuePerCredit)));

  return (
    <div className="plain-english-phrase">
      <span className="value">{item.tradeInitiator.name} </span>
      proposes to <span className="value">{item.tradeType.theType.toLowerCase()} </span>
      <span className="value">{item.numberOfCredits} </span>
      {item.toFrom} <span className="value">{item.tradeRespondent.name} </span>
      for <span className="value">${fairMarketValuePerCredit} </span>
      per credit for a total value of <span className="value">${totalValue} </span>
      effective on Director&apos;s approval.
    </div>
  );
};

export const getCreditTransferTitle = (data) => {
  const respondent = data.respondent.name;
  const tradeType = data.type.theType;
  const toFrom = getToFrom(data.type.theType);

  return (
    <CreditTransferTitle
      respondent={respondent}
      tradeType={tradeType}
      tradeEffectiveDate={data.tradeEffectiveDate}
      toFrom={toFrom}
    />
  );
};

const CreditTransferTitle = item => (
  <h1>
    Credit Transfer - {item.tradeType} {item.toFrom} {item.respondent} {item.tradeEffectiveDate && '- proposed '} {item.tradeEffectiveDate}
  </h1>
);

const addCommas = (number) => {
  const parts = number.toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(Values.ADD_COMMAS_REGEX, ',');
  return parts.join('.');
};

export const plainEnglishPhraseString = (data) => {
  const tradeStatus = data.status;
  const tradeRespondent = data.respondent;
  const tradeInitiator = data.initiator;
  const tradeType = data.type;
  const tradeTypePast = getCreditTradeTypePast(data.type);
  const toFrom = getToFrom(tradeType);
  const fairMarketValuePerCredit = addCommas(Number(data.fairMarketValuePerCredit));
  const totalValue = addCommas((Number(data.numberOfCredits) *
    Number(data.fairMarketValuePerCredit)));

  switch (tradeStatus) {
    case Values.STATUS_COMPLETED:
      return (`${tradeInitiator} ${tradeTypePast} ${data.numberOfCredits} ${toFrom} ${tradeRespondent} for $${fairMarketValuePerCredit} per credit for a total value of $${totalValue} effective on ${data.tradeEffectiveDate}.`);
    default:
      return (`${tradeInitiator} proposes to ${tradeType} ${data.numberOfCredits} ${toFrom} ${tradeRespondent} for $${fairMarketValuePerCredit} per credit for a total value of $${totalValue} effective on Director's approval.`);
  }
};
