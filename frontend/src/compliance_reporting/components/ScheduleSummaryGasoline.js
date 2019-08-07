import { numericColumn, numericInput, totalViewer } from './Columns';

class ScheduleSummaryGasoline {
  constructor (readOnly = false) {
    return [
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
      [{ // line 1
        className: 'text',
        readOnly: true,
        value: 'Volume of petroleum-based gasoline supplied'
      }, {
        readOnly: true,
        value: 'Line 1'
      }, numericColumn], // line 1
      [{ // line 2
        className: 'text',
        readOnly: true,
        value: 'Volume of gasoline class renewable fuel supplied'
      }, {
        readOnly: true,
        value: 'Line 2'
      }, numericColumn], // line 2
      [{ // line 3
        className: 'text',
        readOnly: true,
        value: 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)'
      }, {
        readOnly: true,
        value: 'Line 3'
      }, numericColumn], // line 3
      [{ // line 4
        className: 'text',
        readOnly: true,
        value: 'Volume of Part 2 gasoline class renewable fuel required (5% of Line 3)'
      }, {
        readOnly: true,
        value: 'Line 4'
      }, numericColumn], // line 4
      [{ // line 5
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received ' +
               'from other suppliers as reported in Schedule A'
      }, {
        readOnly: true,
        value: 'Line 5'
      }, numericColumn], // line 5
      [{ // line 6
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 4)'
      }, {
        readOnly: true,
        value: 'Line 6'
      }, {
        ...numericInput,
        readOnly: readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 6
      [{ // line 7
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)'
      }, {
        readOnly: true,
        value: 'Line 7'
      }, {
        readOnly: true
      }], // line 7
      [{ // line 8
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 4)'
      }, {
        readOnly: true,
        value: 'Line 8'
      }, {
        ...numericInput,
        readOnly: readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 8
      [{ // line 9
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation added (from Line 8 of previous compliance period)'
      }, {
        readOnly: true,
        value: 'Line 9'
      }, {
        readOnly: true
      }], // line 9
      [{ // line 10
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable Part 2 gasoline class fuel supplied ' +
               '(Total of Line 2 + Line 5 - Line 6 + Line 7 + Line 8 - Line 9)'
      }, {
        readOnly: true,
        value: 'Line 10'
      }, numericColumn], // line 10
      [{ // line 11
        className: 'text total',
        readOnly: true,
        value: 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L'
      }, {
        className: 'total',
        readOnly: true,
        value: 'Line 11'
      }, {
        ...totalViewer,
        className: 'total numeric'
      }]
    ];
  }
}

export default ScheduleSummaryGasoline;
