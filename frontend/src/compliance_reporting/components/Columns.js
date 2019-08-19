import React from 'react';

import Input from '../../app/components/Spreadsheet/Input';
import {getQuantity} from '../../utils/functions';

const numericColumn = {
  className: 'numeric',
  readOnly: true,
  value: '',
  valueViewer: (data) => {
    const {value} = data;

    if (value === '') {
      return '';
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
  valueViewer: (data) => {
    const {attributes} = data.cell;
    let {value} = data;

    if (!value) {
      return '';
    }

    value = String(value).replace(/,/g, '');
    value = Number(value);
    let qty = getQuantity(value);
    if (qty !== '') {
      return <span>{qty.toFixed(attributes.dataNumberToFixed).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
    }
    return <span></span>;
  }

};

const totalViewer = {
  className: 'numeric',
  readOnly: true,
  value: '',
  valueViewer: (data) => {
    const {value} = data;

    if (value === '') {
      return '';
    }

    if (Number(value) < 0) {
      return <span>({Number(value * -1).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>;
    }

    return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
  }
};

export {numericColumn, numericInput, totalViewer};
