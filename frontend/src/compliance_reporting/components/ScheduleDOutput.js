import React from 'react';

import Input from '../../app/components/Spreadsheet/Input';

const numericInput = readOnly => ({
  attributes: {
    allowNegative: true,
    dataNumberToFixed: 50,
    maxLength: '100',
    step: '0.01'
  },
  className: 'number',
  readOnly,
  dataEditor: Input,
  valueViewer: (cell) => {
    const { value } = cell;

    if (!value) {
      return '';
    }

    return (
      <span>
        {Number(value) ? Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : ''}
      </span>
    );
  }
});

const totalViewer = (cell) => {
  const { value } = cell;

  if (value === '') {
    return '';
  }

  return (
    <span>
      {Number(value) ? Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : ''}
    </span>
  );
};

const ScheduleDOutput = readOnly => ([
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Dispensing'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Distribution and Storage'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Production'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Transmission'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Recovery'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Feedstock Upgrading'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Land Use Change'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fertilizer Manufacture'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Gas Leaks and Flares'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'CO₂ and H₂S Removed'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Emissions Displaced'
  }, numericInput(readOnly)],
  [{
    className: 'output-label',
    readOnly: true,
    value: 'Fuel Use (High Heating Value)'
  }, numericInput(readOnly)],
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
]);

export default ScheduleDOutput;
