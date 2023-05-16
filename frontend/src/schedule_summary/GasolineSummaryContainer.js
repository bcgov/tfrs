import React from 'react'
import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { cellFormatNumeric, cellFormatTotal, formatNumeric } from '../utils/functions'

function tableData (gasoline, summary) {
  gasoline[SCHEDULE_SUMMARY.LINE_1][2] = cellFormatNumeric(summary.lines['1'])
  gasoline[SCHEDULE_SUMMARY.LINE_2][2] = cellFormatNumeric(summary.lines['2'])
  gasoline[SCHEDULE_SUMMARY.LINE_3][2] = cellFormatNumeric(summary.lines['3'])
  gasoline[SCHEDULE_SUMMARY.LINE_4][2] = cellFormatNumeric(summary.lines['4'])
  gasoline[SCHEDULE_SUMMARY.LINE_5][2] = cellFormatNumeric(summary.lines['5'])
  gasoline[SCHEDULE_SUMMARY.LINE_6][2] = cellFormatNumeric(summary.lines['6'])
  gasoline[SCHEDULE_SUMMARY.LINE_7][2] = cellFormatNumeric(summary.lines['7'])
  gasoline[SCHEDULE_SUMMARY.LINE_8][2] = cellFormatNumeric(summary.lines['8'])
  gasoline[SCHEDULE_SUMMARY.LINE_9][2] = cellFormatNumeric(summary.lines['9'])
  gasoline[SCHEDULE_SUMMARY.LINE_10][2] = cellFormatNumeric(
    summary.lines['10']
  )
  gasoline[SCHEDULE_SUMMARY.LINE_11][2] = cellFormatTotal(summary.lines['11'])
  return gasoline
}
function lineData (gasoline, summary) {
  const line4percent = gasoline[SCHEDULE_SUMMARY.LINE_4][2].value * 0.05
  gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = summary.gasolineClassRetained

  if (line4percent && line4percent < summary.gasolineClassRetained) {
    gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = 0
  }

  gasoline[SCHEDULE_SUMMARY.LINE_7][2].value = summary.gasolineClassPreviouslyRetained

  gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = summary.gasolineClassDeferred

  if (line4percent && line4percent < summary.gasolineClassDeferred) {
    gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = 0
  }

  gasoline[SCHEDULE_SUMMARY.LINE_9][2].value = summary.gasolineClassObligation

  return gasoline
}
function populateSchedules (props, state, setState) {
  if (props.complianceReport.hasSnapshot && props.snapshot && props.readOnly) {
    return
  }

  if (!props.scheduleState.summary) {
    return
  }

  if (Object.keys(props.recomputedTotals).length === 0) {
    return
  }
  let {
    gasoline
  } = state
  gasoline = _calculateGasoline(props, state)

  gasoline[SCHEDULE_SUMMARY.LINE_6][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_6][2],
    readOnly: gasoline[SCHEDULE_SUMMARY.LINE_2][2].value <=
      gasoline[SCHEDULE_SUMMARY.LINE_4][2].value || props.readOnly
  }

  gasoline[SCHEDULE_SUMMARY.LINE_7][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_7][2],
    readOnly: gasoline[SCHEDULE_SUMMARY.LINE_7][2].readOnly || props.readOnly
  }

  gasoline[SCHEDULE_SUMMARY.LINE_8][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_8][2],
    readOnly: gasoline[SCHEDULE_SUMMARY.LINE_4][2].value <=
    gasoline[SCHEDULE_SUMMARY.LINE_2][2].value || props.readOnly
  }

  gasoline[SCHEDULE_SUMMARY.LINE_9][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_9][2],
    readOnly: gasoline[SCHEDULE_SUMMARY.LINE_9][2].readOnly || props.readOnly
  }

  setState({
    ...state,
    gasoline
  })
}

function _calculateGasoline (props, state) {
  const { gasoline } = state
  const { summary } = props.scheduleState

  const totals = props.recomputedTotals

  let totalPetroleumGasoline = 0
  let totalRenewableGasoline = 0
  let netGasolineClassTransferred = 0

  if (totals.summary) {
    ({
      totalPetroleumGasoline,
      totalRenewableGasoline,
      netGasolineClassTransferred
    } = totals.summary)
  }

  let totalGasoline = 0

  gasoline[SCHEDULE_SUMMARY.LINE_1][2] = {
    // line 1, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_1][2],
    value: totalPetroleumGasoline
  }

  if (totalPetroleumGasoline) {
    totalGasoline += totalPetroleumGasoline
  }

  gasoline[SCHEDULE_SUMMARY.LINE_2][2] = {
    // line 2, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_2][2],
    value: totalRenewableGasoline
  }

  if (totalRenewableGasoline) {
    totalGasoline += totalRenewableGasoline
  }

  gasoline[SCHEDULE_SUMMARY.LINE_3][2] = {
    // line 3, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_3][2],
    value: totalGasoline === 0 ? '' : totalGasoline
  }

  const line4Value = Math.round(totalGasoline * 0.05)

  gasoline[SCHEDULE_SUMMARY.LINE_4][2] = {
    // line 4, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_4][2],
    value: line4Value // Line 3 x 5%
  }

  const line6Value = Math.floor(line4Value * 0.05) // Line 4 x 5%
  let line6Label = gasoline[SCHEDULE_SUMMARY.LINE_6][0].value
  if (line6Value > 0) {
    line6Label = line6Label.replace(
      'Line 4)',
      `Line 4 is ${formatNumeric(line6Value, 0)} L)`
    )
  }

  gasoline[SCHEDULE_SUMMARY.LINE_6][0] = {
    // line 6, 1st column
    ...gasoline[SCHEDULE_SUMMARY.LINE_6][0],
    valueViewer: () => <span>{line6Label}</span>
  }

  gasoline[SCHEDULE_SUMMARY.LINE_6][2] = {
    // line 6, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_6][2],
    attributes: {
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][2].attributes,
      maxValue: line6Value
    }
  }

  let line8Label = gasoline[SCHEDULE_SUMMARY.LINE_8][0].value
  if (line6Value > 0) {
    line8Label = line8Label.replace(
      'Line 4)',
      `Line 4 is ${formatNumeric(line6Value, 0)} L)`
    )
  }

  gasoline[SCHEDULE_SUMMARY.LINE_8][0] = {
    // line 8, 1st column
    ...gasoline[SCHEDULE_SUMMARY.LINE_8][0],
    valueViewer: () => <span>{line8Label}</span>
  }

  gasoline[SCHEDULE_SUMMARY.LINE_8][2] = {
    // line 8, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_8][2],
    attributes: {
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][2].attributes,
      maxValue: line6Value
    }
  }

  gasoline[SCHEDULE_SUMMARY.LINE_5][2] = {
    // line 5, 3rd column
    ...gasoline[SCHEDULE_SUMMARY.LINE_5][2],
    value: netGasolineClassTransferred
  }

  if (summary.gasolineClassDeferred) {
    gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = summary.gasolineClassDeferred
  }

  if (summary.gasolineClassPreviouslyRetained) {
    gasoline[SCHEDULE_SUMMARY.LINE_7][2].value =
      summary.gasolineClassPreviouslyRetained
  }

  if (summary.gasolineClassRetained) {
    gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = summary.gasolineClassRetained
  }

  if (summary.gasolineClassObligation) {
    gasoline[SCHEDULE_SUMMARY.LINE_9][2].value =
      summary.gasolineClassObligation
  }

  gasoline[SCHEDULE_SUMMARY.LINE_10][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_10][2],
    value: calculateGasolineTotal(gasoline)
  }

  gasoline[SCHEDULE_SUMMARY.LINE_11][2] = {
    ...gasoline[SCHEDULE_SUMMARY.LINE_11][2],
    value: calculateGasolinePayable(gasoline)
  }
  return gasoline
}

function calculateGasolinePayable (grid) {
  let totals = 0

  let payable = grid[SCHEDULE_SUMMARY.LINE_4][2].value
  if (payable && !Number.isNaN(payable)) {
    totals += parseFloat(payable)
  }

  payable = grid[SCHEDULE_SUMMARY.LINE_10][2].value
  if (payable && !Number.isNaN(payable)) {
    totals -= parseFloat(payable)
  }

  if (totals <= 0) {
    return ''
  }

  totals *= 0.3

  return totals
}

function calculateGasolineTotal (grid) {
  let totals = 0

  let volume = grid[SCHEDULE_SUMMARY.LINE_2][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_5][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_6][2].value
  if (volume && !Number.isNaN(volume)) {
    totals -= parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_7][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_8][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_9][2].value
  if (volume && !Number.isNaN(volume)) {
    totals -= parseFloat(volume)
  }

  return totals
}

export {
  _calculateGasoline,
  calculateGasolinePayable,
  calculateGasolineTotal,
  tableData,
  lineData,
  populateSchedules
}
