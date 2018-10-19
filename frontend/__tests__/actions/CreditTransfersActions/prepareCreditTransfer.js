import { prepareCreditTransfer } from '../../../src/actions/creditTransfersActions';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, DEFAULT_ORGANIZATION } from '../../../src/constants/values';

test('prepareCreditTransfer should return the right data for Credit Transfers (Sell)', () => {
  const data = prepareCreditTransfer({
    creditsFrom: {
      id: 2
    },
    creditsTo: {
      id: 5
    },
    numberOfCredits: 100,
    tradeEffectiveDate: '2018-01-01',
    transferType: CREDIT_TRANSFER_TYPES.sell.id,
    zeroDollarReason: ''
  });

  expect({
    compliancePeriod: null,
    initiator: 2,
    numberOfCredits: 100,
    respondent: 5,
    status: CREDIT_TRANSFER_STATUS.recorded.id,
    tradeEffectiveDate: '2018-01-01',
    type: CREDIT_TRANSFER_TYPES.sell.id,
    zeroReason: ''
  }).toEqual(data);
});

test('prepareCreditTransfer should return the right data for Part 3 Award', () => {
  const data = prepareCreditTransfer({
    creditsFrom: {
      id: 0
    },
    creditsTo: {
      id: 5
    },
    numberOfCredits: 100,
    tradeEffectiveDate: '2018-01-01',
    transferType: CREDIT_TRANSFER_TYPES.part3Award.id,
    zeroDollarReason: ''
  });

  expect({
    compliancePeriod: null,
    initiator: DEFAULT_ORGANIZATION.id,
    numberOfCredits: 100,
    respondent: 5,
    status: CREDIT_TRANSFER_STATUS.recorded.id,
    tradeEffectiveDate: '2018-01-01',
    type: CREDIT_TRANSFER_TYPES.part3Award.id,
    zeroReason: ''
  }).toEqual(data);
});

test('prepareCreditTransfer should return the right data for Validation', () => {
  const data = prepareCreditTransfer({
    creditsFrom: {
      id: 0
    },
    creditsTo: {
      id: 5
    },
    numberOfCredits: 100,
    tradeEffectiveDate: '2018-01-01',
    transferType: CREDIT_TRANSFER_TYPES.validation.id,
    zeroDollarReason: ''
  });

  expect({
    compliancePeriod: null,
    initiator: DEFAULT_ORGANIZATION.id,
    numberOfCredits: 100,
    respondent: 5,
    status: CREDIT_TRANSFER_STATUS.recorded.id,
    tradeEffectiveDate: '2018-01-01',
    type: CREDIT_TRANSFER_TYPES.validation.id,
    zeroReason: ''
  }).toEqual(data);
});

test('prepareCreditTransfer should return the right data for Reduction', () => {
  const data = prepareCreditTransfer({
    creditsFrom: {
      id: 5
    },
    creditsTo: {
      id: 0
    },
    numberOfCredits: 100,
    tradeEffectiveDate: '2018-01-01',
    transferType: CREDIT_TRANSFER_TYPES.retirement.id,
    zeroDollarReason: ''
  });

  expect({
    compliancePeriod: null,
    initiator: 5,
    numberOfCredits: 100,
    respondent: DEFAULT_ORGANIZATION.id,
    status: CREDIT_TRANSFER_STATUS.recorded.id,
    tradeEffectiveDate: '2018-01-01',
    type: CREDIT_TRANSFER_TYPES.retirement.id,
    zeroReason: ''
  }).toEqual(data);
});
