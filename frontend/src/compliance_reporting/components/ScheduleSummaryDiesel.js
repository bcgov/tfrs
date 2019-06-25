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
    dataNumberToFixed: 50,
    step: '0.01'
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

const ScheduleSummaryDiesel = [
  [{
    className: 'summary-label header',
    readOnly: true,
    value: 'Diesel Class - 4% Renewable Requirement'
  }, {
    className: 'line header',
    readOnly: true,
    value: 'Line'
  }, {
    className: 'litres header',
    readOnly: true,
    value: 'Litres (L)'
  }], // header
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of petroleum-based diesel supplied'
  }, {
    readOnly: true,
    value: 'Line 12'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of diesel class renewable fuel supplied'
  }, {
    readOnly: true,
    value: 'Line 13'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Total volume of diesel class fuel supplied (Line 12 + Line 13)'
  }, {
    readOnly: true,
    value: 'Line 14'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of Part 2 diesel class renewable fuel required'
  }, {
    readOnly: true,
    value: 'Line 15'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Net volume of renewable fuel notionally transferred to and received ' +
            'from other suppliers as reported in Schedule A'
  }, {
    readOnly: true,
    value: 'Line 16'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable fuel retained (up to 5% of Line 15)'
  }, {
    readOnly: true,
    value: 'Line 17'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable credit (from Line 17 of previous compliance report)'
  }, {
    readOnly: true,
    value: 'Line 18'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable obligation deferred (up to 5% of Line 15)'
  }, {
    readOnly: true,
    value: 'Line 19'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable fuel previously retained (from Line 19 of previous compliance period)'
  }, {
    readOnly: true,
    value: 'Line 20'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of lines 13 ' +
            'and 16 to 20)'
  }, {
    readOnly: true,
    value: 'Line 21'
  }, numericColumn],
  [{
    className: 'text total',
    readOnly: true,
    value: 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L'
  }, {
    className: 'total',
    readOnly: true,
    value: 'Line 22'
  }, {
    ...numericColumn,
    className: 'numeric total'
  }]
];

export default ScheduleSummaryDiesel;
