import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataSheet from 'react-datasheet'

class ScheduleDeltas extends Component {
  static decimalViewer (digits = 2) {
    return cell => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  static buildSummaryGrid (deltas) {
    const findMatchingDelta = (field) => {
      const found = deltas.find(d => d.field === field)
      if (found) {
        return found
      }
      return {
        newValue: null,
        oldValue: null
      }
    }
    const difference = (delta) => {
      if (delta.newValue == null) {
        return delta.oldValue
      }
      if (delta.oldValue == null) {
        return delta.newValue
      }
      return delta.oldValue - delta.newValue
    }

    const grid = [
      [{ // p2 gasoline
        className: 'header',
        colSpan: 5,
        value: 'Part 2 - Gasoline'
      }], [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Line'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Information'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'New Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Old Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Delta'
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 1'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of gasoline class non-renewable fuel supplied'
      }, {
        readOnly: true,
        value: findMatchingDelta('1').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('1').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('1')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 2'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of gasoline class renewable fuel supplied'
      }, {
        readOnly: true,
        value: findMatchingDelta('2').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('2').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('2')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 3'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)'
      }, {
        readOnly: true,
        value: findMatchingDelta('3').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('3').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('3')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 4'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of Part 2 gasoline class renewable fuel required (5% of Line 3)'
      }, {
        readOnly: true,
        value: findMatchingDelta('4').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('4').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('4')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 5'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received from other suppliers as reported in Schedule A'
      }, {
        readOnly: true,
        value: findMatchingDelta('5').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('5').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('5')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 6'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 4)'
      }, {
        readOnly: true,
        value: findMatchingDelta('6').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('6').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('6')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 7'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)'
      }, {
        readOnly: true,
        value: findMatchingDelta('7').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('7').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('7')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 8'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 4)'
      }, {
        readOnly: true,
        value: findMatchingDelta('8').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('8').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('8')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 9'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable obligation added (from Line 8 of previous compliance period)'
      }, {
        readOnly: true,
        value: findMatchingDelta('9').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('9').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('9')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 10'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of Line 2 + Line 5 - Line 6 + Line 7 + Line 8 - Line 9)'
      }, {
        readOnly: true,
        value: findMatchingDelta('10').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('10').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('10')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 11'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L'
      }, {
        readOnly: true,
        value: findMatchingDelta('11').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('11').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('11')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{ // p2 diesel
        className: 'header',
        colSpan: 5,
        value: 'Part 2 - Diesel'
      }], [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Line'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Information'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'New Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Old Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Delta'
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 12'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of diesel class non-renewable fuel supplied'
      }, {
        readOnly: true,
        value: findMatchingDelta('12').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('12').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('12')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 13'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of diesel class renewable fuel supplied'
      }, {
        readOnly: true,
        value: findMatchingDelta('13').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('13').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('13')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 14'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Total volume of diesel class fuel supplied (Line 12 + Line 13)'
      }, {
        readOnly: true,
        value: findMatchingDelta('14').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('14').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('14')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 15'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of Part 2 diesel class renewable fuel required (4% of Line 14)'
      }, {
        readOnly: true,
        value: findMatchingDelta('15').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('15').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('15')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 16'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received from other suppliers as reported in Schedule A'
      }, {
        readOnly: true,
        value: findMatchingDelta('16').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('16').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('16')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 17'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 15)'
      }, {
        readOnly: true,
        value: findMatchingDelta('17').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('17').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('17')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 18'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable credit (from Line 17 of previous compliance report)'
      }, {
        readOnly: true,
        value: findMatchingDelta('18').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('18').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('18')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 19'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 15)'
      }, {
        readOnly: true,
        value: findMatchingDelta('19').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('19').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('19')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 20'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 19 of previous compliance period)'
      }, {
        readOnly: true,
        value: findMatchingDelta('20').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('20').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('20')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 21'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of Line 13 + Line 16 - Line 17 + Line 18 + Line 19 - Line 20)'
      }, {
        readOnly: true,
        value: findMatchingDelta('21').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('21').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('21')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 22'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L'
      }, {
        readOnly: true,
        value: findMatchingDelta('22').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('22').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('22')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{ // p3
        className: 'header',
        colSpan: 5,
        value: 'Part 3 - Low Carbon Fuel Requirement Summary'
      }], [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Line'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Information'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'New Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Old Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Delta'
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 23'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Total credits from fuel supplied (from Schedule B)'
      }, {
        readOnly: true,
        value: findMatchingDelta('23').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('23').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('23')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 24'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Total debits from fuel supplied (from Schedule B)'
      }, {
        readOnly: true,
        value: findMatchingDelta('24').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('24').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('24')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 25'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Net credit or debit balance for compliance period'
      }, {
        readOnly: true,
        value: findMatchingDelta('25').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('25').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('25')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 26'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Credits used to offset debits (if applicable)'
      }, {
        readOnly: true,
        value: findMatchingDelta('26').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('26').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('26')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 26a'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Banked credits used to offset outstanding debits - Previous Reports'
      }, {
        readOnly: true,
        value: findMatchingDelta('26A').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('26A').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('26A')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 26b'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Banked credits used to offset outstanding debits - Supplemental Report'
      }, {
        readOnly: true,
        value: findMatchingDelta('26B').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('26B').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('26B')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 26c'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Banked credits spent that will be returned due to debit decrease - Supplemental Report'
      }, {
        readOnly: true,
        value: findMatchingDelta('26C').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('26C').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('26C')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 27'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Outstanding Debit Balance'
      }, {
        readOnly: true,
        value: findMatchingDelta('27').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(0)
      }, {
        readOnly: true,
        value: findMatchingDelta('27').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('27')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 28'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Part 3 non-compliance penalty payable'
      }, {
        readOnly: true,
        value: findMatchingDelta('28').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('28').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('28')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{ // penalty
        className: 'header',
        colSpan: 5,
        value: 'Part 2 and Part 3 Non-compliance Penalty Payable Summary'
      }], [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Line'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Information'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'New Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Old Value'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Delta'
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 11'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Part 2 Gasoline class non-compliance payable'
      }, {
        readOnly: true,
        value: findMatchingDelta('11').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('11').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('11')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 22'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Part 2 Diesel class non-compliance payable'
      }, {
        readOnly: true,
        value: findMatchingDelta('22').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('22').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('22')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong center',
        readOnly: true,
        value: 'Line 28'
      }, {
        className: 'left',
        readOnly: true,
        value: 'Part 3 non-compliance penalty payable'
      }, {
        readOnly: true,
        value: findMatchingDelta('28').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('28').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('28')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }], [{
        className: 'strong',
        colSpan: 2,
        readOnly: true,
        value: 'Total non-compliance penalty payable (Line 11 + Line 22 + Line 28)'
      }, {
        readOnly: true,
        value: findMatchingDelta('total_payable').newValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: findMatchingDelta('total_payable').oldValue,
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }, {
        readOnly: true,
        value: difference(findMatchingDelta('total_payable')),
        valueViewer: ScheduleDeltas.decimalViewer(2)
      }]
    ]

    return grid
  }

  render () {
    const { deltas } = this.props

    if (!deltas) {
      return null
    }

    const scheduleADeltas = deltas.filter(d => /^schedule_a/.test(d.path))
    const scheduleBDeltas = deltas.filter(d => /^schedule_b/.test(d.path))
    const scheduleCDeltas = deltas.filter(d => /^schedule_c/.test(d.path))
    const scheduleDDeltas = deltas.filter(d => /^schedule_d/.test(d.path))
    const summaryDeltas = deltas.filter(d => /^summary/.test(d.path))

    return (
      <div className="delta">
        <div>
          {scheduleADeltas.length > 0 &&
          <p><strong>Schedule A</strong> has been modified</p>
          }
          {scheduleBDeltas.length > 0 &&
          <p><strong>Schedule B</strong> has been modified</p>
          }
          {scheduleCDeltas.length > 0 &&
          <p><strong>Schedule C</strong> has been modified</p>
          }
          {scheduleDDeltas.length > 0 &&
          <p><strong>Schedule D</strong> has been modified</p>
          }
        </div>

        <div>
          <h3 className="schedule-header">Summary</h3>
          <hr />
          <ReactDataSheet
            className="spreadsheet summary snapshot_summary"
            data={ScheduleDeltas.buildSummaryGrid(summaryDeltas)}
            valueRenderer={cell => cell.value}
          />
        </div>

      </div>
    )
  }
}

ScheduleDeltas.defaultProps = {
  deltas: []
}

ScheduleDeltas.propTypes = {
  deltas: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string,
    oldValue: PropTypes.any,
    newValue: PropTypes.any
  }))
}

export default ScheduleDeltas
