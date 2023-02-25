import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Tooltip from '../app/components/Tooltip'
import { _calculateNonCompliancePayable } from './PenaltySummaryContainer'
import { SCHEDULE_PENALTY, SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { _handleCellsChanged } from '../compliance_reporting/ScheduleSummaryContainer'
import { cellFormatNumeric, cellFormatTotal } from '../utils/functions'

function tableData (
  part3,
  summary,
  { isSupplemental, supplementalNumber }
) {
  part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23'])
  part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24'])
  part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
  part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26'])
  part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric(
    summary.lines['26A']
  )
  part3[SCHEDULE_SUMMARY.LINE_26_B][2] = cellFormatNumeric(
    summary.lines['26B']
  )
  part3[SCHEDULE_SUMMARY.LINE_27][2] = cellFormatNumeric(
    summary.lines['27'] < 0 ? summary.lines['27'] : 0
  )
  part3[SCHEDULE_SUMMARY.LINE_28][2] = cellFormatTotal(summary.lines['28'])

  if (!isSupplemental) {
    Part3NonSupplimentalData(part3, 'tableData')
  } else {
    // is supplemental
    part3[
      SCHEDULE_SUMMARY.LINE_26_B
    ][0].value = `Banked credits used to offset outstanding debits - Supplemental Report #${supplementalNumber}`
  }
  return part3
}

function lineData (
  part3,
  summary,
  complianceReport,
  updateCreditsOffsetA,
  lastAcceptedOffset,
  skipFurtherUpdateCreditsOffsetA
) {
  const { isSupplemental } = complianceReport
  part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset
  if (!isSupplemental) {
    Part3NonSupplimentalData(part3, 'lineData')
  } else {
    // is supplemental
    Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)
  }

  part3 = calculatePart3Payable(part3)
  return part3
}
function Part3NonSupplimentalData (part3, functionName) {
  if (functionName === 'tableData') {
    part3[SCHEDULE_SUMMARY.LINE_26][0].value =
    'Banked credits used to offset outstanding debits (if applicable)'
    part3[SCHEDULE_SUMMARY.LINE_26][1].value = (
    <div>
      {'Line 26 '}
      <Tooltip
        className="info"
        show
        title="Enter the quantity of banked credits used to offset debits accrued in the compliance period. This line is only available if there is a net debit balance in the compliance period, as indicated in Line 25."
      >
        <FontAwesomeIcon icon="info-circle" />
      </Tooltip>
    </div>
    )

    part3[SCHEDULE_SUMMARY.LINE_26][2].attributes = {
      ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
      additionalTooltip:
      "The value entered here cannot be more than your organization's available credit balance for this compliance period or the net debit balance in Line 25."
    }

    part3[SCHEDULE_SUMMARY.LINE_26_A][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_A][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = {
      className: 'hidden',
      value: ''
    }
    part3[SCHEDULE_SUMMARY.LINE_26_A][3].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
      className: 'hidden',
      value: ''
    }
    part3[SCHEDULE_SUMMARY.LINE_26_B][3].className = 'hidden'
  }

  if (functionName === 'lineData') {
    const line25value = part3[SCHEDULE_SUMMARY.LINE_25][2].value * -1
    if (line25value && line25value < part3[SCHEDULE_SUMMARY.LINE_26][2].value) {
      part3[SCHEDULE_SUMMARY.LINE_26][2].value = 0
    }
    part3[SCHEDULE_SUMMARY.LINE_26][0].value =
      'Banked credits used to offset outstanding debits (if applicable)'
    part3[SCHEDULE_SUMMARY.LINE_26][1].value = (
      <div>
        {'Line 26 '}
        <Tooltip
          className="info"
          show
          title="Enter the quantity of banked credits used to offset debits accrued in the compliance period. This line is only available if there is a net debit balance in the compliance period, as indicated in Line 25."
        >
          <FontAwesomeIcon icon="info-circle" />
        </Tooltip>
      </div>
    )

    part3[SCHEDULE_SUMMARY.LINE_26][2].attributes = {
      ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
      additionalTooltip:
        "The value entered here cannot be more than your organization's available credit balance for this compliance period or the net debit balance in Line 25."
    }

    part3[SCHEDULE_SUMMARY.LINE_26_A][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_A][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = {
      className: 'hidden',
      value: ''
    }
    part3[SCHEDULE_SUMMARY.LINE_26_A][3].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
      className: 'hidden',
      value: ''
    }
    part3[SCHEDULE_SUMMARY.LINE_26_B][3].className = 'hidden'
  }
}

function Part3SupplementalData (part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport) {
  const {
    supplementalNumber,
    totalPreviousCreditReductions,
    previousReportWasCredit
  } = complianceReport

  part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = summary.creditsOffsetB

  part3[
    SCHEDULE_SUMMARY.LINE_26_B
  ][0].value = `Banked credits used to offset outstanding debits - Supplemental Report #${supplementalNumber}`
  const debits =
    Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value) !== 0
      ? Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value) * -1
      : 0

  // if we result in a positive credit offset
  if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset > debits &&
    debits > 0 &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value !== lastAcceptedOffset &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = debits
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // if after adjustments we still end up in a debit position
  if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset <= debits &&
    debits > 0 &&
    totalPreviousCreditReductions - debits <= 0 &&
    [totalPreviousCreditReductions, lastAcceptedOffset].indexOf(
      part3[SCHEDULE_SUMMARY.LINE_26_A][2].value
    ) <= 0 &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = debits
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = totalPreviousCreditReductions
  } else if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset > debits &&
    debits > 0 &&
    !this.state.alreadyUpdated &&
    lastAcceptedOffset - debits > 0 &&
    (part3[SCHEDULE_SUMMARY.LINE_26_A][2].value !== lastAcceptedOffset ||
      part3[SCHEDULE_SUMMARY.LINE_26][2].value !== debits)
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = debits
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // was the previous supplemental, submitted and hasnt been accepted/rejected yet?
  if (
    status.fuelSupplierStatus === 'Draft' &&
    history &&
    history[0].status.fuelSupplierStatus === 'Submitted' &&
    !history[0].status.directorStatus &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true

    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = totalPreviousCreditReductions
    skipFurtherUpdateCreditsOffsetA = true
  }

  if (
    previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value > 0 &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = 0
    skipFurtherUpdateCreditsOffsetA = true
  }

  if (
    lastAcceptedOffset !== null &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 &&
    !skipFurtherUpdateCreditsOffsetA &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // if we still dont have LINE26A at this point, let's use the total credit reductions so far
  if (
    !previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value =
      totalPreviousCreditReductions || summary.creditsOffsetA
  }

  if (
    !previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 &&
    summary.creditsOffsetA > 0 &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = summary.creditsOffsetA
  }

  let creditsOffsetA = Number(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value)
  if (isNaN(creditsOffsetA)) {
    creditsOffsetA = 0
  }

  let creditsOffsetB = Number(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value)
  if (isNaN(creditsOffsetB)) {
    creditsOffsetB = 0
  }

  const previousLine26 = part3[SCHEDULE_SUMMARY.LINE_26][2].value

  part3[SCHEDULE_SUMMARY.LINE_26][2].value = creditsOffsetA + creditsOffsetB

  const creditsOffset = part3[SCHEDULE_SUMMARY.LINE_26][2].value

  if (creditsOffset > 0 && debits > 0 && creditsOffset > debits) {
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = debits
  }

  // if (debits < 0 && creditsOffset > 0 && lastAcceptedOffset <= debits) {
  const netTotal =
    Number(part3[SCHEDULE_SUMMARY.LINE_23][2].value) +
    Number(part3[SCHEDULE_SUMMARY.LINE_24][2].value)
  if (netTotal > 0 && creditsOffset > 0 && !skipFurtherUpdateCreditsOffsetA) {
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = 0
  }

  if (
    Number(previousLine26) !==
      Number(part3[SCHEDULE_SUMMARY.LINE_26][2].value) &&
    !this.state.alreadyUpdated
  ) {
    updateCreditsOffsetA = true
  }

  const max26BValue =
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value +
    part3[SCHEDULE_SUMMARY.LINE_25][2].value

  if (max26BValue > 0) {
    part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = 0
  }
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

  let { part3 } = state

  part3 = _calculatePart3(props, state, setState)
  setState({
    ...state,
    part3
  })
}
function calculatePart3Payable (part3) {
  const grid = part3
  let credits = Number(grid[SCHEDULE_SUMMARY.LINE_26][2].value)

  const balance = Number(grid[SCHEDULE_SUMMARY.LINE_25][2].value)

  let outstandingBalance = 0
  let payable = 0

  if (Number.isNaN(credits)) {
    credits = 0
  }

  outstandingBalance = balance + Number(credits)
  payable = outstandingBalance * -200 // negative symbol so that the product is positive

  if (balance > 0) {
    outstandingBalance = ''
    payable = ''
  }

  grid[SCHEDULE_SUMMARY.LINE_27][2] = {
    ...grid[SCHEDULE_SUMMARY.LINE_27][2],
    value: outstandingBalance
  }

  grid[SCHEDULE_SUMMARY.LINE_28][2] = {
    ...grid[SCHEDULE_SUMMARY.LINE_28][2],
    value: payable
  }

  return grid
}
function _calculatePart3 (props, state, setState) {
  const { part3 } = state
  let { penalty } = state
  const { summary } = props.scheduleState
  const { maxCreditOffset, isSupplemental } = props.complianceReport

  let totalCredits = 0
  let totalDebits = 0
  if (props.recomputedTotals.scheduleB) {
    ({ totalCredits, totalDebits } = props.recomputedTotals.scheduleB)
  }

  if (summary.creditsOffset) {
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset
  }

  if (summary.creditsOffsetB) {
    part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = summary.creditsOffsetB
  }

  part3[SCHEDULE_SUMMARY.LINE_23][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_23][2],
    value: Math.round(totalCredits)
  }

  part3[SCHEDULE_SUMMARY.LINE_24][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_24][2],
    value: -1 * Math.round(totalDebits)
  }

  const netTotal = totalCredits - totalDebits

  part3[SCHEDULE_SUMMARY.LINE_25][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_25][2],
    value: Math.round(netTotal)
  }

  let maxValue = ''

  if (netTotal < 0) {
    maxValue = Math.round(netTotal * -1)

    if (maxCreditOffset < maxValue) {
      maxValue = maxCreditOffset
    }
  }

  part3[SCHEDULE_SUMMARY.LINE_26][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_26][2],
    readOnly: netTotal >= 0 || this.props.readOnly || isSupplemental,
    attributes: {
      ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
      maxValue
    }
  }

  if (isSupplemental) {
    if (
      part3[SCHEDULE_SUMMARY.LINE_26][2].value +
        part3[SCHEDULE_SUMMARY.LINE_25][2].value >
      0
    ) {
      part3[SCHEDULE_SUMMARY.LINE_26][2].value =
        part3[SCHEDULE_SUMMARY.LINE_25][2].value * -1
    }

    let max26BValue = 0

    // we only have a max value for LINE 26 B if we're in a deficit, if it's positive
    // that means we're getting a credit and there's no point in enabling LINE_26_B
    if (part3[SCHEDULE_SUMMARY.LINE_25][2].value < 0) {
      max26BValue =
        (part3[SCHEDULE_SUMMARY.LINE_25][2].value +
          part3[SCHEDULE_SUMMARY.LINE_26_A][2].value) *
        -1
    }

    if (max26BValue < maxValue) {
      maxValue = max26BValue
    }

    part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_26_B][2],
      readOnly: netTotal >= 0 || this.props.readOnly || maxValue <= 0,
      attributes: {
        ...part3[SCHEDULE_SUMMARY.LINE_26_B][2].attributes,
        maxValue
      },
      value: maxValue <= 0 ? 0 : part3[SCHEDULE_SUMMARY.LINE_26_B][2].value
    }
  }

  penalty[SCHEDULE_PENALTY.LINE_28][2] = {
    ...penalty[SCHEDULE_PENALTY.LINE_28][2],
    value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
  }

  penalty = _calculateNonCompliancePayable(penalty)
  setState({
    ...state,
    part3,
    penalty
  })

  return part3
}
function _handlePart3Changed (changes, addition = null) {
  _handleCellsChanged('part3', changes, addition)
}

export {
  calculatePart3Payable,
  _calculatePart3,
  _handlePart3Changed,
  tableData,
  lineData,
  populateSchedules
}
