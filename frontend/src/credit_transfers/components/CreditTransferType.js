import React from 'react';
import PropTypes from 'prop-types';

import { CREDIT_TRANSFER_TYPES } from '../../constants/values';

const CreditTransferType = (props) => {
  let content = '';

  switch (props.type) {
    case CREDIT_TRANSFER_TYPES.validation.id:
      content = 'Validation';
      break;
    case CREDIT_TRANSFER_TYPES.retirement.id:
      content = 'Reduction';
      break;
    case CREDIT_TRANSFER_TYPES.part3Award.id:
      content = 'Part 3 Award';
      break;
    default:
      content = 'Credit Transfer';
  }

  return (
    <span>{content}</span>
  );
};

CreditTransferType.propTypes = {
  type: PropTypes.number.isRequired
};

export default CreditTransferType;
