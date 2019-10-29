const EXCLUSION_AGREEMENT = {
  TRANSACTION_TYPE: 1,
  FUEL_TYPE: 2,
  LEGAL_NAME: 3,
  ADDRESS: 4,
  QUANTITY: 5,
  UNITS: 6,
  QUANTITY_NOT_SOLD: 7,
  NOT_SOLD_UNITS: 8
};

const EXCLUSION_AGREEMENT_ERROR_KEYS = {
  legalName: 3,
  address: 4,
  fuelType: 2,
  transactionType: 1,
  quantity: 5,
  quantityNotSold: 7
};

export {
  EXCLUSION_AGREEMENT, EXCLUSION_AGREEMENT_ERROR_KEYS
};
