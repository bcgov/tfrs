import { getCreditTransferType } from '../../../src/actions/creditTransfersActions';
import { CREDIT_TRANSFER_TYPES } from '../../../src/constants/values';

test('getCreditTransferType should return a display value for Validation', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.validation.id);

  expect('Validation').toEqual(data);
});

test('getCreditTransferType should return a display value for Reduction', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.retirement.id);

  expect('Reduction').toEqual(data);
});

test('getCreditTransferType should return a display value for Part 3 Award', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.part3Award.id);

  expect('Part 3 Award').toEqual(data);
});

test('getCreditTransferType should return a display value for Sell', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.sell.id);

  expect('Credit Transfer').toEqual(data);
});

test('getCreditTransferType should return a display value for Buy', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.buy.id);

  expect('Credit Transfer').toEqual(data);
});
