const EXCLUSION_AGREEMENT = {
  ROW_NUMBER: 0,
  TRANSACTION_TYPE: 1,
  FUEL_TYPE: 2,
  LEGAL_NAME: 3,
  ADDRESS: 4,
  QUANTITY: 5,
  UNITS: 6,
  QUANTITY_NOT_SOLD: 7,
  NOT_SOLD_UNITS: 8
}

const EXCLUSION_AGREEMENT_ERROR_KEYS = {
  fuelType: 2,
  postalAddress: 4,
  quantity: 5,
  quantityNotSold: 7,
  transactionPartner: 3,
  transactionType: 1
}

export {
  EXCLUSION_AGREEMENT,
  EXCLUSION_AGREEMENT_ERROR_KEYS
}
