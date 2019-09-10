import { totalViewer } from './Columns';

class ScheduleSummaryPenalty {
  constructor () {
    return [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: 'Non-compliance Penalty Payable'
      }, {
        className: 'line header',
        readOnly: true,
        value: 'Line'
      }, {
        className: 'cad header',
        readOnly: true,
        value: '$CAD'
      }], // header
      [{
        className: 'text',
        readOnly: true,
        value: 'Part 2 Gasoline class non-compliance payable'
      }, {
        readOnly: true,
        value: 'Line 11'
      }, totalViewer],
      [{
        className: 'text',
        readOnly: true,
        value: 'Part 2 Diesel class non-compliance payable'
      }, {
        readOnly: true,
        value: 'Line 22'
      }, totalViewer],
      [{
        className: 'text',
        readOnly: true,
        value: 'Part 3 non-compliance penalty payable'
      }, {
        readOnly: true,
        value: 'Line 28'
      }, totalViewer],
      [{
        className: 'text total',
        readOnly: true,
        value: 'Total non-compliance penalty payable (Line 11 + Line 22 + Line 28)'
      }, {
        readOnly: true
      }, {
        ...totalViewer,
        className: 'total numeric'
      }]
    ];
  }
}

export default ScheduleSummaryPenalty;
