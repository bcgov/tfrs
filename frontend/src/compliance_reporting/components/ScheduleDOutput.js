import React from 'react';

import Input from './Input';

const numericInput = {
  attributes: {
    allowNegative: true,
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

    return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
  }
};

const totalViewer = (cell) => {
  const { value } = cell;

  if (value === '') {
    return '';
  }

  return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
};

const ScheduleDOutput = [
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Dispensing'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Distribution and Storage'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Production'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Transmission'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Recovery'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Upgrading'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Land Use Change'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fertilizer Manufacture'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Gas Leaks and Flares'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'CO₂ and H₂S Removed'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Emissions Displaced'
  }, numericInput],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Use (High Heating Value)'
  }, numericInput],
  [{
    className: 'output-label total',
    readOnly: true,
    value: 'Total (gCO₂e/GJ)'
  }, {
    className: 'number total',
    readOnly: true,
    valueViewer: totalViewer
  }],
  [{
    className: 'output-label total',
    readOnly: true,
    value: 'Carbon Intensity (gCO₂e/MJ)'
  }, {
    ...numericInput,
    className: 'number total',
    readOnly: true,
    valueViewer: totalViewer
  }]
];

export default ScheduleDOutput;
