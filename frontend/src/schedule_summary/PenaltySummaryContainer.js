import { SCHEDULE_PENALTY, SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { calculateDieselPayable } from './DieselSummaryContainer'
import { calculateGasolinePayable } from './GasolineSummaryContainer'
import { cellFormatTotal } from '../utils/functions'

function tableData (penalty, summary) {
  penalty[SCHEDULE_PENALTY.LINE_11][2] = cellFormatTotal(summary.lines['11'])
  penalty[SCHEDULE_PENALTY.LINE_22][2] = cellFormatTotal(summary.lines['22'])
  penalty[SCHEDULE_PENALTY.LINE_28][2] = cellFormatTotal(summary.lines['28'])
  penalty[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2] = cellFormatTotal(
    summary.totalPayable
  )

  return penalty
}
function lineData (penalty, part3, gasoline, diesel) {
  penalty[SCHEDULE_PENALTY.LINE_11][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_11][2],
    value: calculateGasolinePayable(gasoline)
  }

  penalty[SCHEDULE_PENALTY.LINE_22][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_22][2],
    value: calculateDieselPayable(diesel)
  }

  penalty[SCHEDULE_PENALTY.LINE_28][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_28][2],
    value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
  }

  return penalty
}
function populateSchedules (props, state, setState, gasoline, diesel, part3) {
  if (props.complianceReport.hasSnapshot && props.snapshot && props.readOnly) {
    return
  }

  if (!props.scheduleState.summary) {
    return
  }

  if (Object.keys(props.recomputedTotals).length === 0) {
    return
  }

  let { penalty } = state

  penalty[SCHEDULE_PENALTY.LINE_11][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_11][2],
    value: calculateGasolinePayable(gasoline)
  }

  penalty[SCHEDULE_PENALTY.LINE_22][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_22][2],
    value: calculateDieselPayable(diesel)
  }

  penalty[SCHEDULE_PENALTY.LINE_28][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_28][2],
    value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
  }
  penalty = _calculateNonCompliancePayable(penalty, props)
  setState({
    ...state,
    penalty
  })
}

function _calculateNonCompliancePayable (penalty, props) {
  const grid = penalty
  let total = 0

  if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_11][2].value)) {
    total += Number(grid[SCHEDULE_PENALTY.LINE_11][2].value)
  }

  if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_22][2].value)) {
    total += Number(grid[SCHEDULE_PENALTY.LINE_22][2].value)
  }

  if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_28][2].value)) {
    total += Number(grid[SCHEDULE_PENALTY.LINE_28][2].value)
  }

  grid[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2] = {
    ...grid[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2],
    value: total
  }

  if (total > 0) {
    props.showPenaltyWarning(true)
  } else {
    props.showPenaltyWarning(false)
  }

  return grid
}

export {
  _calculateNonCompliancePayable,
  tableData,
  populateSchedules,
  lineData
}
