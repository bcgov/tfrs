import { numericColumn, numericInput, totalViewer } from './Columns';

class ScheduleSummaryDiesel {
  constructor (readOnly = false) {
    return [
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
      [{ // line 12
        className: 'text',
        readOnly: true,
        value: 'Volume of petroleum-based diesel supplied'
      }, {
        readOnly: true,
        value: 'Line 12'
      }, numericColumn], // line 12
      [{ // line 13
        className: 'text',
        readOnly: true,
        value: 'Volume of diesel class renewable fuel supplied'
      }, {
        readOnly: true,
        value: 'Line 13'
      }, numericColumn], // line 13
      [{ // line 14
        className: 'text',
        readOnly: true,
        value: 'Total volume of diesel class fuel supplied (Line 12 + Line 13)'
      }, {
        readOnly: true,
        value: 'Line 14'
      }, numericColumn], // line 14
      [{ // line 15
        className: 'text',
        readOnly: true,
        value: 'Volume of Part 2 diesel class renewable fuel required (4% of Line 14)'
      }, {
        readOnly: true,
        value: 'Line 15'
      }, numericColumn], // line 15
      [{ // line 16
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received ' +
                'from other suppliers as reported in Schedule A'
      }, {
        readOnly: true,
        value: 'Line 16'
      }, numericColumn], // line 16
      [{ // line 17
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 15)'
      }, {
        readOnly: true,
        value: 'Line 17'
      }, {
        ...numericInput,
        readOnly: readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 17
      [{ // line 18
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable credit (from Line 17 of previous compliance report)'
      }, {
        readOnly: true,
        value: 'Line 18'
      }, {
        readOnly: true
      }], // line 18
      [{ // line 19
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 15)'
      }, {
        readOnly: true,
        value: 'Line 19'
      }, {
        ...numericInput,
        readOnly: readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 19
      [{ // line 20
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 19 of previous compliance period)'
      }, {
        readOnly: true,
        value: 'Line 20'
      }, {
        readOnly: true
      }], // line 20
      [{ // line 21
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable Part 2 gasoline class fuel supplied ' +
               '(Total of Line 13 + Line 16 - Line 17 + Line 18 + Line 19 - Line 20)'
      }, {
        readOnly: true,
        value: 'Line 21'
      }, numericColumn], // line 21
      [{ // line 22
        className: 'text total',
        readOnly: true,
        value: 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L'
      }, {
        className: 'total',
        readOnly: true,
        value: 'Line 22'
      }, {
        ...totalViewer,
        className: 'total numeric'
      }]
    ];
  }
}

export default ScheduleSummaryDiesel;
