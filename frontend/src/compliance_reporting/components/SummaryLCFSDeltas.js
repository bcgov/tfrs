import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataSheet from 'react-datasheet'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { COMPLIANCE_YEAR } from '../../constants/values'
import Tooltip from '../../app/components/Tooltip'
import { SCHEDULE_SUMMARY } from '../../constants/schedules/scheduleColumns'

class SummaryLCFSDeltas extends Component {
  static decimalViewer (digits = 2) {
    return cell => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  static currencyViewer (digits = 0) {
    return cell => {
      const value = Number(cell.value)
      const formattedValue = value < 0
        ? `-$${Math.abs(value).toFixed(digits).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
        : `$${value.toFixed(digits).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
      return formattedValue
    }
  }

  static buildSummaryGrid (deltas, part3, period) {
    let adjustedBalance = 0
    if (part3) {
      adjustedBalance = Number(part3[SCHEDULE_SUMMARY.LINE_28_A][2].value) / 600
    }

    const findMatchingDelta = (field) => {
      if (deltas[field]) {
        return deltas[field]
      }
      return null
    }
    const difference = (delta, part3Val) => {
      if (part3Val == null) {
        return delta
      }
      if (delta == null) {
        return part3Val
      }
      return part3Val - delta
    }
    const grid = [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: ''
      }, {
        className: 'line header',
        readOnly: true,
        value: ''
      }, {
        className: 'header',
        value: 'Old',
        readOnly: true
      }, {
        className: 'header',
        value: 'New',
        readOnly: true
      }, {
        className: 'header',
        readOnly: true,
        value: 'Change'
      }], // header
      [{ // line 25
        className: 'text',
        readOnly: true,
        value: 'Net compliance unit balance for compliance period'
      }, {
        className: 'line',
        readOnly: true,
        value: (
                    <div>
                        {'Line 25 '}
                        <Tooltip
                            className="info"
                            show
                            title="This line displays the net balance of compliance units for the compliance period."
                        >
                            <FontAwesomeIcon icon="info-circle" />
                        </Tooltip>
                    </div>
        )
      }, {
        value: findMatchingDelta('25'),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: difference(findMatchingDelta('25'), Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value)),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }], // line 25
      [{ // line 29a
        className: 'text',
        readOnly: true,
        value: `Available compliance unit balance on March 31, ${period + 1}`
      }, {
        className: 'line',
        readOnly: true
      }, {
        value: findMatchingDelta('29A'),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: Number(part3[SCHEDULE_SUMMARY.LINE_29_A][2].value),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: difference(findMatchingDelta('29A'), Number(part3[SCHEDULE_SUMMARY.LINE_29_A][2].value)),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }], // line 29a
      [{ // line 29b
        className: 'text',
        readOnly: true,
        value: 'Compliance unit balance change from assessment'
      }, {
        className: 'line',
        readOnly: true
      }, {
        value: findMatchingDelta('29B'),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: Number(part3[SCHEDULE_SUMMARY.LINE_29_B][2].value),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: '',
        className: 'tooltip-large number',
        readOnly: true
      }], // line 29b
      [{ // line 28
        className: 'text',
        readOnly: true,
        value: `Non-compliance penalty payable (${Math.abs(adjustedBalance)} units * $600 CAD per unit)`
      }, {
        className: 'line',
        value: (
                    <div>
                        {'Line 28 '}
                        <Tooltip
                            className="info"
                            show
                            title={
                                'This line displays the penalty payable based on the information provided' +
                                ' and is calculated using the $600 per outstanding debit non-compliance penalty.'
                            }
                        >
                            <FontAwesomeIcon icon="info-circle" />
                        </Tooltip>
                    </div>
        ),
        readOnly: true
      }, {
        value: findMatchingDelta('28'),
        valueViewer: SummaryLCFSDeltas.currencyViewer(),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: Number(part3[SCHEDULE_SUMMARY.LINE_28_A][2].value),
        valueViewer: SummaryLCFSDeltas.currencyViewer(),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: difference(findMatchingDelta('28'), Number(part3[SCHEDULE_SUMMARY.LINE_28_A][2].value)),
        valueViewer: SummaryLCFSDeltas.currencyViewer(),
        className: 'tooltip-large number',
        readOnly: true
      }], // line 28a
      [{ // line 29c
        className: 'text',
        readOnly: true,
        value: `Available compliance unit balance after assessment on March 31, ${period + 1}`
      }, {
        className: 'line',
        readOnly: true
      }, {
        value: findMatchingDelta('29C'),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: Number(part3[SCHEDULE_SUMMARY.LINE_29_C][2].value),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }, {
        value: difference(findMatchingDelta('29C'), Number(part3[SCHEDULE_SUMMARY.LINE_29_C][2].value)),
        valueViewer: SummaryLCFSDeltas.decimalViewer(0),
        className: 'tooltip-large number',
        readOnly: true
      }] // line 29c
    ]
    // if no penalty then hide the line 28
    if ((grid[4][2].value === null || grid[4][2].value === 0) && (grid[4][3].value === null || grid[4][3].value === 0)) {
      for (let i = 0; i < 5; i++) {
        grid[4][i].className = 'hidden'
      }
    }
    return grid
  }

  render () {
    const { part3, handleCellsChanged } = this.props
    const { deltas } = this.props.complianceData.complianceReport
    const { period } = this.props.complianceData
    let deltaData; let deltaIsAbscent = true
    if (Number(period) >= COMPLIANCE_YEAR && deltas !== undefined && deltas.length > 0) {
      const summaryLines = deltas[0].snapshot.data.summary.lines
      deltaData = SummaryLCFSDeltas.buildSummaryGrid(summaryLines, part3, Number(period))
      deltaIsAbscent = false
    }
    return (<ReactDataSheet
            className="spreadsheet"
            data={deltaIsAbscent ? part3 : deltaData}
            onCellsChanged={(changes, addition = null) => {
              handleCellsChanged('part3', changes, addition)
            }}
            valueRenderer={cell => cell.value}
        />)
  }
}

SummaryLCFSDeltas.defaultProps = {
  complianceData: {},
  part3: [],
  handleCellsChanged: () => { return null }
}

SummaryLCFSDeltas.propTypes = {
  complianceData: PropTypes.object,
  part3: PropTypes.arrayOf(PropTypes.any),
  handleCellsChanged: PropTypes.func
}

export default SummaryLCFSDeltas
