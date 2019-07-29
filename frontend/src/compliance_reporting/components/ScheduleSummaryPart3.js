import { numericColumn, numericInput, totalViewer } from './Columns';

class ScheduleSummaryPart3 {
  constructor () {
    return [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: 'Part 3 - Low Carbon Fuel Requirement Summary'
      }, {
        className: 'line header',
        readOnly: true,
        value: 'Line'
      }, {
        className: 'credits',
        readOnly: true
      }, {
        className: 'units header',
        readOnly: true,
        value: 'Units'
      }], // header
      [{ // line 23
        className: 'text',
        readOnly: true,
        value: 'Total credits from fuel supplied (from Schedule B)'
      }, {
        readOnly: true,
        value: 'Line 23'
      }, numericColumn, {
        readOnly: true,
        value: 'Credits'
      }], // line 23
      [{ // line 24
        className: 'text',
        readOnly: true,
        value: 'Total debits from fuel supplied (from Schedule B)'
      }, {
        readOnly: true,
        value: 'Line 24'
      }, numericColumn, {
        readOnly: true,
        value: '(Debits)'
      }], // line 24
      [{ // line 25
        className: 'text',
        readOnly: true,
        value: 'Net credit or debit balance for compliance period'
      }, {
        readOnly: true,
        value: 'Line 25'
      }, numericColumn, {
        readOnly: true,
        value: 'Credits (Debits)'
      }], // line 25
      [{ // line 26
        className: 'text',
        readOnly: true,
        value: 'Credits used to offset debits (if applicable)'
      }, {
        readOnly: true,
        value: 'Line 26'
      }, {
        ...numericInput,
        attributes: {
          addCommas: true,
          additionalTooltip: 'This cannot be higher than the organization\'s credit nor the net debit.',
          dataNumberToFixed: 0,
          maxLength: '20',
          step: '1'
        },
        readOnly: true
      }, {
        readOnly: true,
        value: 'Credits'
      }], // line 26
      [{ // line 27
        className: 'text total',
        readOnly: true,
        value: 'Outstanding Debit Balance'
      }, {
        className: 'total',
        readOnly: true,
        value: 'Line 27'
      }, numericColumn, {
        className: 'total',
        readOnly: true,
        value: '(Debits)'
      }], // line 27
      [{ // line 28
        className: 'text total',
        readOnly: true,
        value: 'Part 3 non-compliance penalty payable'
      }, {
        className: 'total',
        readOnly: true,
        value: 'Line 28'
      }, {
        ...totalViewer,
        className: 'total numeric'
      }, {
        className: 'total',
        readOnly: true,
        value: '$CAD'
      }] // line 28
    ];
  }
}

export default ScheduleSummaryPart3;
