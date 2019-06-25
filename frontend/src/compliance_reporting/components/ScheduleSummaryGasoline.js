import React from 'react';

import Input from './Input';
import { getQuantity } from '../../utils/functions';

const numericColumn = {
  readOnly: true,
  value: '',
  valueViewer: (cell) => {
    const { value } = cell;

    if (value === '') {
      return '-';
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

const ScheduleSummaryGasoline = [
  [{
    className: 'summary-label header',
    readOnly: true,
    value: 'Gasoline Class - 5% Renewable Requirement'
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
    value: 'Volume of petroleum-based gasoline supplied'
  }, {
    readOnly: true,
    value: 'Line 1'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of gasoline class renewable fuel supplied'
  }, {
    readOnly: true,
    value: 'Line 2'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)'
  }, {
    readOnly: true,
    value: 'Line 3'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of Part 2 gasoline class renewable fuel required'
  }, {
    readOnly: true,
    value: 'Line 4'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Net volume of renewable fuel notionally transferred to and received ' +
            'from other suppliers as reported in Schedule A'
  }, {
    readOnly: true,
    value: 'Line 5'
  }, numericColumn],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable fuel retained (up to 5% of Line 4)'
  }, {
    readOnly: true,
    value: 'Line 6'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)'
  }, {
    readOnly: true,
    value: 'Line 7'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable obligation deferred (up to 5% of Line 4)'
  }, {
    readOnly: true,
    value: 'Line 8'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Volume of renewable obligation added (from Line 8 of previous compliance period)'
  }, {
    readOnly: true,
    value: 'Line 9'
  }, numericInput],
  [{
    className: 'text',
    readOnly: true,
    value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of lines 2 ' +
            'and 5 to 9)'
  }, {
    readOnly: true,
    value: 'Line 10'
  }, numericColumn],
  [{
    className: 'text total',
    readOnly: true,
    value: 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L'
  }, {
    className: 'total',
    readOnly: true,
    value: 'Line 11'
  }, {
    ...numericColumn,
    className: 'total'
  }]
];

export default ScheduleSummaryGasoline;
