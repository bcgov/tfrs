import { getCreditTransferType } from '../../../src/actions/creditTransfersActions'
import { CREDIT_TRANSFER_TYPES } from '../../../src/constants/values'

test('getCreditTransferType should return a display value for Assessment', () => {
  const updateDate = new Date('2024-12-31')
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.validation.id, updateDate)
  expect('Assessment').toEqual(data)
})

test('getCreditTransferType should return a display value for Reduction', () => {
  const updateDate = new Date('2023-12-31')
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.retirement.id, updateDate)

  expect('Reduction').toEqual(data)
})

test('getCreditTransferType should return a display value for Validation', () => {
  const updateDate = new Date('2023-12-31')
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.validation.id, updateDate)
  expect('Validation').toEqual(data)
})

test('getCreditTransferType should return a display value for Initiative Agreement', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.part3Award.id)

  expect('Initiative Agreement').toEqual(data)
})

test('getCreditTransferType should return a display value for Administrative Adjustment', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.adminAdjustment.id)

  expect('Administrative Adjustment').toEqual(data)
})

test('getCreditTransferType should return a display value for Sell', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.sell.id)

  expect('Transfer').toEqual(data)
})

test('getCreditTransferType should return a display value for Buy', () => {
  const data = getCreditTransferType(CREDIT_TRANSFER_TYPES.buy.id)

  expect('Transfer').toEqual(data)
})
