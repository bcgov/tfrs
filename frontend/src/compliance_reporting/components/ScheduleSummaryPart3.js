const ScheduleSummaryPart3 = [
  [{
    className: 'summary-label header',
    readOnly: true,
    value: 'Part 3 - Low Carbon Fuel Requirement Summary'
  }, {
    className: 'line header',
    readOnly: true,
    value: 'Line'
  }, {
    readOnly: true
  }, {
    className: 'units header',
    readOnly: true,
    value: 'Units'
  }], // header
  [{
    className: 'text',
    readOnly: true,
    value: 'Total credits from fuel supplied (from Schedule B)'
  }, {
    readOnly: true,
    value: 'Line 23'
  }, {
    readOnly: true,
    value: '-'
  }, {
    readOnly: true,
    value: 'Credits'
  }],
  [{
    className: 'text',
    readOnly: true,
    value: 'Total debits from fuel supplied (from Schedule B)'
  }, {
    readOnly: true,
    value: 'Line 24'
  }, {
    readOnly: true,
    value: '-'
  }, {
    readOnly: true,
    value: '(Debits)'
  }],
  [{
    className: 'text',
    readOnly: true,
    value: 'Net credit or debit balance for compliance period'
  }, {
    readOnly: true,
    value: 'Line 25'
  }, {
    readOnly: true,
    value: '-'
  }, {
    readOnly: true,
    value: 'Credits (Debits)'
  }],
  [{
    className: 'text',
    readOnly: true,
    value: 'Credits used to offset debits (if applicable)'
  }, {
    readOnly: true,
    value: 'Line 26'
  }, {
    readOnly: true,
    value: '-'
  }, {
    readOnly: true,
    value: 'Credits'
  }],
  [{
    className: 'text total',
    readOnly: true,
    value: 'Outstanding Debit Balance'
  }, {
    className: 'total',
    readOnly: true,
    value: 'Line 27'
  }, {
    className: 'total',
    readOnly: true,
    value: '-'
  }, {
    className: 'total',
    readOnly: true,
    value: '(Debits)'
  }],
  [{
    className: 'text total',
    readOnly: true,
    value: 'Part 3 non-compliance penalty payable'
  }, {
    className: 'total',
    readOnly: true,
    value: 'Line 28'
  }, {
    className: 'total',
    readOnly: true,
    value: '-'
  }, {
    className: 'total',
    readOnly: true,
    value: '$CAD'
  }]
];

export default ScheduleSummaryPart3;
