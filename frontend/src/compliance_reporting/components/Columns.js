import React from 'react';

import Input from './Input';
import { getQuantity } from '../../utils/functions';

const numericColumn = {
  className: 'numeric',
  readOnly: true,
  value: '',
  valueViewer: (cell) => {
    const { value } = cell;

    if (value === '') {
      return '-';
    }

    if (Number(value) < 0) {
      return <span>({Math.round(value * -1).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>;
    }

    return <span>{Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
  }
};

const numericInput = {
  attributes: {
    dataNumberToFixed: 2,
    maxLength: '50',
    step: '1'
  },
  className: 'number',
  dataEditor: Input,
  valueViewer: (cell) => {
    const { value } = cell;

    if (!value) {
      return '';
    }

    return <span>{getQuantity(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
  }
};

const totalViewer = {
  className: 'numeric',
  readOnly: true,
  value: '',
  valueViewer: (cell) => {
    const { value } = cell;

    if (value === '') {
      return '-';
    }

    if (Number(value) < 0) {
      return <span>({Number(value * -1).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}/L)</span>;
    }

    return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}/L</span>;
  }
};

export { numericColumn, numericInput, totalViewer };
