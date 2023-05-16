import React from 'react'
import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { cellFormatNumeric, cellFormatTotal, formatNumeric } from '../utils/functions'

function tableData (diesel, summary) {
  diesel[SCHEDULE_SUMMARY.LINE_12][2] = cellFormatNumeric(summary.lines['12'])
  diesel[SCHEDULE_SUMMARY.LINE_13][2] = cellFormatNumeric(summary.lines['13'])
  diesel[SCHEDULE_SUMMARY.LINE_14][2] = cellFormatNumeric(summary.lines['14'])
  diesel[SCHEDULE_SUMMARY.LINE_15][2] = cellFormatNumeric(summary.lines['15'])

  diesel[SCHEDULE_SUMMARY.LINE_16][2] = cellFormatNumeric(summary.lines['16'])
  diesel[SCHEDULE_SUMMARY.LINE_17][2] = cellFormatNumeric(summary.lines['17'])
  diesel[SCHEDULE_SUMMARY.LINE_18][2] = cellFormatNumeric(summary.lines['18'])
  diesel[SCHEDULE_SUMMARY.LINE_19][2] = cellFormatNumeric(summary.lines['19'])
  diesel[SCHEDULE_SUMMARY.LINE_20][2] = cellFormatNumeric(summary.lines['20'])
  diesel[SCHEDULE_SUMMARY.LINE_21][2] = cellFormatNumeric(summary.lines['21'])
  diesel[SCHEDULE_SUMMARY.LINE_22][2] = cellFormatTotal(summary.lines['22'])
  return diesel
}
function lineData (diesel, summary) {
  const line15percent = diesel[SCHEDULE_SUMMARY.LINE_15][2].value * 0.05
  diesel[SCHEDULE_SUMMARY.LINE_17][2].value = summary.dieselClassRetained

  if (line15percent && line15percent < summary.dieselClassRetained) {
    diesel[SCHEDULE_SUMMARY.LINE_17][2].value = 0
  }

  diesel[SCHEDULE_SUMMARY.LINE_18][2].value = summary.dieselClassPreviouslyRetained

  diesel[SCHEDULE_SUMMARY.LINE_19][2].value = summary.dieselClassDeferred

  if (line15percent && line15percent < summary.dieselClassDeferred) {
    diesel[SCHEDULE_SUMMARY.LINE_19][2].value = 0
  }

  diesel[SCHEDULE_SUMMARY.LINE_20][2].value = summary.dieselClassObligation
  return diesel
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
    diesel
  } = state

  diesel = _calculateDiesel(props, state)
  diesel[SCHEDULE_SUMMARY.LINE_17][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_17][2],
    readOnly: diesel[SCHEDULE_SUMMARY.LINE_13][2].value <=
        diesel[SCHEDULE_SUMMARY.LINE_15][2].value || props.readOnly
  }

  diesel[SCHEDULE_SUMMARY.LINE_19][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_19][2],
    readOnly: diesel[SCHEDULE_SUMMARY.LINE_15][2].value <=
        diesel[SCHEDULE_SUMMARY.LINE_13][2].value || props.readOnly
  }

  diesel[SCHEDULE_SUMMARY.LINE_18][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_18][2],
    readOnly: diesel[SCHEDULE_SUMMARY.LINE_18][2].readOnly || props.readOnly
  }

  diesel[SCHEDULE_SUMMARY.LINE_20][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_20][2],
    readOnly: diesel[SCHEDULE_SUMMARY.LINE_20][2].readOnly || props.readOnly
  }
  setState({
    ...state,
    diesel
  })
}

function calculateDieselPayable (grid) {
  let totals = 0

  let payable = grid[SCHEDULE_SUMMARY.LINE_15][2].value
  if (payable && !Number.isNaN(payable)) {
    totals += parseFloat(payable)
  }

  payable = grid[SCHEDULE_SUMMARY.LINE_21][2].value
  if (payable && !Number.isNaN(payable)) {
    totals -= parseFloat(payable)
  }

  if (totals <= 0) {
    return ''
  }

  totals *= 0.45

  return totals
}
function calculateDieselTotal (grid) {
  let totals = 0

  let volume = grid[SCHEDULE_SUMMARY.LINE_13][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_16][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_17][2].value
  if (volume && !Number.isNaN(volume)) {
    totals -= parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_18][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_19][2].value
  if (volume && !Number.isNaN(volume)) {
    totals += parseFloat(volume)
  }

  volume = grid[SCHEDULE_SUMMARY.LINE_20][2].value
  if (volume && !Number.isNaN(volume)) {
    totals -= parseFloat(volume)
  }

  return totals
}
function _calculateDiesel (props, state) {
  const { diesel } = state

  const { summary } = props.scheduleState

  const totals = props.recomputedTotals

  let totalPetroleumDiesel = 0
  let totalRenewableDiesel = 0
  let netDieselClassTransferred = 0

  if (totals.summary) {
    ({ totalPetroleumDiesel, totalRenewableDiesel, netDieselClassTransferred } = totals.summary)
  }

  let totalDiesel = 0

  diesel[SCHEDULE_SUMMARY.LINE_12][2] = { // line 12, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_12][2],
    value: totalPetroleumDiesel
  }

  if (totalPetroleumDiesel) {
    totalDiesel += totalPetroleumDiesel
  }

  diesel[SCHEDULE_SUMMARY.LINE_13][2] = { // line 13, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_13][2],
    value: totalRenewableDiesel
  }

  if (totalRenewableDiesel) {
    totalDiesel += totalRenewableDiesel
  }

  diesel[SCHEDULE_SUMMARY.LINE_14][2] = { // line 14, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_14][2],
    value: totalDiesel === 0 ? '' : totalDiesel
  }

  const line15Value = Math.round(totalDiesel * 0.04)

  diesel[SCHEDULE_SUMMARY.LINE_15][2] = { // line 15, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_15][2],
    value: line15Value // Line 14 x 4%
  }

  const line17Value = Math.floor(line15Value * 0.05) // Line 15 x 5%
  let line17Label = diesel[SCHEDULE_SUMMARY.LINE_17][0].value
  if (line17Value > 0) {
    line17Label = line17Label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 0)} L)`)
  }

  diesel[SCHEDULE_SUMMARY.LINE_17][0] = { // line 17, 1st column
    ...diesel[SCHEDULE_SUMMARY.LINE_17][0],
    valueViewer: () => (
        <span>{line17Label}</span>
    )
  }

  diesel[SCHEDULE_SUMMARY.LINE_17][2] = { // line 17, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_17][2],
    attributes: {
      ...diesel[SCHEDULE_SUMMARY.LINE_17][2].attributes,
      maxValue: line17Value
    }
  }

  let line19label = diesel[SCHEDULE_SUMMARY.LINE_19][0].value
  if (line17Value > 0) {
    line19label = line19label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 0)} L)`)
  }

  diesel[SCHEDULE_SUMMARY.LINE_19][0] = { // line 19, 1st column
    ...diesel[SCHEDULE_SUMMARY.LINE_19][0],
    valueViewer: () => (
        <span>{line19label}</span>
    )
  }

  diesel[SCHEDULE_SUMMARY.LINE_19][2] = { // line 19, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_19][2],
    attributes: {
      ...diesel[SCHEDULE_SUMMARY.LINE_19][2].attributes,
      maxValue: line17Value
    }
  }

  diesel[SCHEDULE_SUMMARY.LINE_16][2] = { // line 5, 3rd column
    ...diesel[SCHEDULE_SUMMARY.LINE_16][2],
    value: netDieselClassTransferred
  }

  if (summary.dieselClassRetained) {
    diesel[SCHEDULE_SUMMARY.LINE_17][2].value = summary.dieselClassRetained
  }

  if (summary.dieselClassPreviouslyRetained) {
    diesel[SCHEDULE_SUMMARY.LINE_18][2].value = summary.dieselClassPreviouslyRetained
  }

  if (summary.dieselClassDeferred) {
    diesel[SCHEDULE_SUMMARY.LINE_19][2].value = summary.dieselClassDeferred
  }

  if (summary.dieselClassObligation) {
    diesel[SCHEDULE_SUMMARY.LINE_20][2].value = summary.dieselClassObligation
  }

  diesel[SCHEDULE_SUMMARY.LINE_21][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_21][2],
    value: calculateDieselTotal(diesel)
  }

  diesel[SCHEDULE_SUMMARY.LINE_22][2] = {
    ...diesel[SCHEDULE_SUMMARY.LINE_22][2],
    value: calculateDieselPayable(diesel)
  }

  return diesel
}

export {
  calculateDieselPayable,
  calculateDieselTotal,
  _calculateDiesel,
  tableData,
  lineData,
  populateSchedules
}
