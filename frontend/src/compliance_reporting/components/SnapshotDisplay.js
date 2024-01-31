/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ReactDataSheet from 'react-datasheet'
import moment from 'moment-timezone'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class SnapshotDisplay extends Component {
  static decimalViewer (digits = 2) {
    return cell => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  static buildScheduleAGrid (snapshot) {
    const grid = [
      [{
        value: 'Legal Name of Trading Partner',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Postal Address',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Fuel Class',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Received OR Transferred',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Quantity (L)',
        className: 'header underlined',
        disableEvents: true
      }]
    ]

    if (snapshot.scheduleA) {
      snapshot.scheduleA.records.forEach(row => (
        grid.push([{
          className: 'left',
          readOnly: true,
          value: row.tradingPartner
        }, {
          className: 'left',
          readOnly: true,
          value: row.postalAddress
        }, {
          className: 'left',
          readOnly: true,
          value: row.fuelClass
        }, {
          className: 'left',
          readOnly: true,
          value: row.transferType
        }, {
          readOnly: true,
          value: row.quantity,
          valueViewer: SnapshotDisplay.decimalViewer(0)
        }])
      ))
    }

    return grid
  }

  static buildScheduleBGrid (snapshot) {
    const grid = [
      [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Type'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Class'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Provision Of The Act'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Code'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Quantity Supplied'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Units'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'CI Limit'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'CI Fuel'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Energy Density'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'EER'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Energy'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Credits'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Debits'
      }]
    ]

    if (snapshot.scheduleB) {
      snapshot.scheduleB.records.forEach(row => (
        grid.push([{
          className: 'left',
          readOnly: true,
          value: row.fuelType
        }, {
          className: 'left',
          readOnly: true,
          value: row.fuelClass
        }, {
          className: 'left',
          readOnly: true,
          value: `${row.provisionOfTheAct} - ${row.provisionOfTheActDescription}`
        }, {
          className: 'left',
          readOnly: true,
          value: row.fuelCode != null
            ? row.fuelCodeDescription
            : (row.scheduleD_sheetIndex != null ? 'From Schedule D' : '')
        }, {
          readOnly: true,
          value: row.quantity,
          valueViewer: SnapshotDisplay.decimalViewer(0)
        }, {
          className: 'left',
          readOnly: true,
          value: row.unitOfMeasure
        }, {
          readOnly: true,
          value: row.ciLimit,
          valueViewer: SnapshotDisplay.decimalViewer()
        }, {
          readOnly: true,
          value: row.effectiveCarbonIntensity,
          valueViewer: SnapshotDisplay.decimalViewer()
        }, {
          readOnly: true,
          value: row.energyDensity,
          valueViewer: SnapshotDisplay.decimalViewer()
        }, {
          readOnly: true,
          value: row.eer,
          valueViewer: SnapshotDisplay.decimalViewer()
        }, {
          readOnly: true,
          value: row.energyContent,
          valueViewer: SnapshotDisplay.decimalViewer()
        }, {
          readOnly: true,
          value: row.credits,
          valueViewer: SnapshotDisplay.decimalViewer(2)
        }, {
          readOnly: true,
          value: row.debits,
          valueViewer: SnapshotDisplay.decimalViewer(2)
        }])
      ))

      grid.push([{
        className: 'strong',
        colSpan: 11,
        readOnly: true,
        value: 'Totals'
      }, {
        readOnly: true,
        value: snapshot.scheduleB.totalCredits,
        valueViewer: SnapshotDisplay.decimalViewer(0)
      }, {
        readOnly: true,
        value: snapshot.scheduleB.totalDebits,
        valueViewer: SnapshotDisplay.decimalViewer(0)
      }])
    }

    return grid
  }

  static buildScheduleCGrid (snapshot) {
    const grid = [
      [{
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Type'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Fuel Class'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Quantity'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Expected Use'
      }, {
        className: 'header underlined',
        disableEvents: true,
        value: 'Rationale'
      }]
    ]

    if (snapshot.scheduleC) {
      snapshot.scheduleC.records.forEach(row => (
        grid.push([{
          className: 'left',
          readOnly: true,
          value: row.fuelType
        }, {
          className: 'left',
          readOnly: true,
          value: row.fuelClass
        }, {
          readOnly: true,
          value: row.quantity,
          valueViewer: SnapshotDisplay.decimalViewer(0)
        }, {
          className: 'left',
          readOnly: true,
          value: row.expectedUse
        }, {
          className: 'left',
          readOnly: true,
          value: row.rationale
        }])
      ))
    }

    return grid
  }

  static buildScheduleDGrid (snapshot, i) {
    const grid = []
    const sheet = snapshot.scheduleD.sheets[i]

    grid.push([{
      className: 'header underlined',
      colSpan: 5,
      disableEvents: true,
      value: 'Parameters'
    }])

    grid.push([{
      className: 'strong left',
      colSpan: 3,
      disableEvents: true,
      readOnly: true,
      value: 'Fuel Class'
    }, {
      className: 'left',
      colSpan: 2,
      readOnly: true,
      value: sheet.fuelClass
    }], [{
      className: 'strong left',
      colSpan: 3,
      disableEvents: true,
      readOnly: true,
      value: 'Fuel Type'
    }, {
      className: 'left',
      colSpan: 2,
      readOnly: true,
      value: sheet.fuelType
    }], [{
      className: 'strong left',
      colSpan: 3,
      disableEvents: true,
      readOnly: true,
      value: 'Feedstock'
    }, {
      className: 'left',
      colSpan: 2,
      readOnly: true,
      value: sheet.feedstock
    }])

    grid.push([{
      className: 'header',
      colSpan: 5,
      disableEvents: true,
      value: 'Inputs'
    }], [{
      className: 'header center underlined',
      disableEvents: true,
      readOnly: true,
      value: 'Worksheet'
    }, {
      className: 'header center underlined',
      disableEvents: true,
      readOnly: true,
      value: 'Cell'
    }, {
      className: 'header center underlined',
      disableEvents: true,
      readOnly: true,
      value: 'Value'
    }, {
      className: 'header center underlined',
      disableEvents: true,
      readOnly: true,
      value: 'Units'
    }, {
      className: 'header center underlined',
      disableEvents: true,
      readOnly: true,
      value: 'Description'
    }])

    sheet.inputs.forEach(row => (
      grid.push([{
        className: 'left',
        readOnly: true,
        value: row.worksheetName
      }, {
        className: 'left',
        readOnly: true,
        value: row.cell
      }, {
        className: 'left',
        readOnly: true,
        value: row.value
      }, {
        className: 'left',
        readOnly: true,
        value: row.units
      }, {
        className: 'left',
        readOnly: true,
        value: row.description
      }])
    ))

    grid.push([{
      className: 'header',
      colSpan: 5,
      disableEvents: true,
      value: 'Outputs'
    }], [{
      className: 'header underlined',
      colSpan: 3,
      disableEvents: true,
      value: 'Output'
    }, {
      className: 'header underlined',
      colSpan: 2,
      disableEvents: true,
      value: 'Value'
    }])

    sheet.outputs.forEach(row => (
      grid.push([{
        className: 'strong left',
        colSpan: 3,
        readOnly: true,
        value: row.description
      }, {
        colSpan: 2,
        readOnly: true,
        value: row.intensity,
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }])
    ))

    return grid
  }

  static buildSummaryGrid (snapshot) {
    const grid = [
      [{ // p2 gasoline
        className: 'header',
        colSpan: 3,
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
        value: 'Value'
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
        value: snapshot.summary.lines['1'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['2'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['3'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['4'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['5'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['6'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['7'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['8'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['9'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['10'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['11'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }], [{ // p2 diesel
        className: 'header',
        colSpan: 3,
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
        value: 'Value'
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
        value: snapshot.summary.lines['12'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['13'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['14'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['15'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['16'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['17'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['18'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['19'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['20'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['21'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['22'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }], [{ // p3
        className: 'header',
        colSpan: 3,
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
        value: 'Value'
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
        value: snapshot.summary.lines['23'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['24'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['25'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['26'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['26A'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['26B'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['26C'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['27'],
        valueViewer: SnapshotDisplay.decimalViewer(0)
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
        value: snapshot.summary.lines['28'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }], [{ // penalty
        className: 'header',
        colSpan: 3,
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
        value: 'Value'
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
        value: snapshot.summary.lines['11'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
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
        value: snapshot.summary.lines['22'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
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
        value: snapshot.summary.lines['28'],
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }], [{
        className: 'strong',
        colSpan: 2,
        readOnly: true,
        value: 'Total non-compliance penalty payable (Line 11 + Line 22 + Line 28)'
      }, {
        readOnly: true,
        value: snapshot.summary.totalPayable,
        valueViewer: SnapshotDisplay.decimalViewer(2)
      }]
    ]

    return grid
  }

  render () {
    const { snapshot } = this.props

    if (!snapshot) {
      return (<p>???</p>)
    }

    return (
      <div className="snapshot">
        {this.props.showHeaders &&
        <div>
          <h1>Compliance Report for {this.props.snapshot.compliancePeriod.description}</h1>
          <h3>{this.props.snapshot.organization.name}</h3>
          <h3>Submitted: {moment(this.props.snapshot.timestamp).format('YYYY-MM-DD')}</h3>
          <hr />
        </div>
        }
        {this.props.computedWarning &&
        <div className="panel panel-warning">
          <FontAwesomeIcon icon="exclamation-triangle" />Showing a live view of this report.
        </div>
        }
        <div>
          {(snapshot.supplementalNote && snapshot.supplementalNote.length > 0) &&
          <div className="panel panel-default">
            <div className="panel-heading">
              Supplemental Submission Explanation
            </div>
            <div
              key="supplemental-note"
              className="panel-body"
            >
              <span>{snapshot.supplementalNote}</span>
            </div>
          </div>
          }
          {snapshot.scheduleA &&
          <div>
            <h1 className="schedule-header">Schedule A</h1>
            <hr />
            <ReactDataSheet
              key="snapshot-a"
              className="spreadsheet snapshot_a"
              data={SnapshotDisplay.buildScheduleAGrid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleB &&
          <div key="snapshot-b">
            <h1 className="schedule-header">Schedule B</h1>
            <hr />
            <ReactDataSheet
              className="spreadsheet snapshot_b"
              data={SnapshotDisplay.buildScheduleBGrid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleC &&
          <div key="snapshot-c">
            <h1 className="schedule-header">Schedule C</h1>
            <hr />
            <ReactDataSheet
              className="spreadsheet snapshot_c"
              data={SnapshotDisplay.buildScheduleCGrid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleD &&
          <div key="snapshot-d">
            <h1 className="schedule-header">Schedule D</h1>
            <hr />
            {snapshot.scheduleD.sheets.map((s, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={`snapshot-d-${i}`}>
                <h2>Fuel {i + 1}</h2>
                <ReactDataSheet
                  className="spreadsheet snapshot_d"
                  data={SnapshotDisplay.buildScheduleDGrid(snapshot, i)}
                  valueRenderer={cell => cell.value}
                />
              </div>
            ))
            }
          </div>
          }
          {(snapshot.summary && snapshot.summary.lines) &&
          <div key="snapshot-summary">
            <h1 className="schedule-header">Summary</h1>
            <hr />
            <ReactDataSheet
              className="spreadsheet summary snapshot_summary"
              data={SnapshotDisplay.buildSummaryGrid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
        </div>
      </div>
    )
  }
}

SnapshotDisplay.defaultProps = {
  snapshot: null,
  computedWarning: false,
  showHeaders: true
}

SnapshotDisplay.propTypes = {
  snapshot: PropTypes.shape(),
  showHeaders: PropTypes.bool,
  computedWarning: PropTypes.bool
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotDisplay)
