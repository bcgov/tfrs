import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Tooltip from '../app/components/Tooltip'
import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { cellFormatNumeric, cellFormatTotal, cellFormatCurrencyTotal, cellFormatNegativeNumber } from '../utils/functions'
import { COMPLIANCE_YEAR } from '../constants/values'

function tableData (
  part3,
  summary,
  { isSupplemental, supplementalNumber, compliancePeriod }
) {
  const period = Number(compliancePeriod.description)
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
  part3[SCHEDULE_SUMMARY.LINE_26_C][2] = cellFormatNumeric(
    summary.lines['26C']
  )
  part3[SCHEDULE_SUMMARY.LINE_27][2] = cellFormatNumeric(
    summary.lines['27'] < 0 ? summary.lines['27'] : 0
  )
  part3[SCHEDULE_SUMMARY.LINE_28][2] = cellFormatTotal(summary.lines['28'])

  if (!isSupplemental) {
    part3 = Part3NonSupplimentalTableData(part3)
  } else {
    // is supplemental
    part3[
      SCHEDULE_SUMMARY.LINE_26_B
    ][0].value = `Banked credits used to offset outstanding debits - Supplemental Report #${supplementalNumber}`
    part3[
      SCHEDULE_SUMMARY.LINE_26_C
    ][0].value = `Banked credits spent that will be returned due to debit decrease - Supplemental Report #${supplementalNumber}`
  }

  // Compliance Unit Act
  if (period >= COMPLIANCE_YEAR) {
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNegativeNumber(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_29_A][2] = cellFormatNegativeNumber(summary.lines['29A']) // Available compliance Unit on March 31, YYYY
    part3[SCHEDULE_SUMMARY.LINE_29_B][2] = cellFormatNegativeNumber(summary.lines['29B']) // Compliance unit balance change from assessment
    part3[SCHEDULE_SUMMARY.LINE_28_A][2] = cellFormatCurrencyTotal(summary.lines['28']) // Non compliance penalty payable
    part3[SCHEDULE_SUMMARY.LINE_29_C][2] = cellFormatNegativeNumber(summary.lines['29C']) // Available compliance unit balance after assessment

    if (summary.lines['28'] <= 0) {
      // if there is no compliane penalty to pay then hide line 28
      part3[SCHEDULE_SUMMARY.LINE_28_A][0].className = 'hidden'
      part3[SCHEDULE_SUMMARY.LINE_28_A][1].className = 'hidden'
      part3[SCHEDULE_SUMMARY.LINE_28_A][2] = {
        className: 'hidden',
        value: ''
      }
    } else {
      let adjustedBalance = Number(summary.lines['29A']) + Number(summary.lines['25'])
      part3[SCHEDULE_SUMMARY.LINE_28_A][0].value = `Non-compliance penalty payable (${Math.abs(adjustedBalance)} units * $600 CAD per unit)`
    }
    for (let i = SCHEDULE_SUMMARY.LINE_23; i < SCHEDULE_SUMMARY.LINE_28 + 1; i++) {
      if (i != SCHEDULE_SUMMARY.LINE_25) {
        // Hide lines from 23 to 28 excluding line 25
        part3[i][2].className = 'hidden'
      }
    }
  }

  return part3
}

function lineData (
  part3,
  summary,
  complianceReport,
  updateCreditsOffsetA,
  lastAcceptedOffset,
  skipFurtherUpdateCreditsOffsetA,
  alreadyUpdated,
  period
) {
  const { isSupplemental } = complianceReport
  part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset
  if (!isSupplemental) {
    part3 = Part3NonSupplimentalLineData(part3)
  } else {
    // is supplemental
    part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport, alreadyUpdated)
  }
  part3 = (period >= COMPLIANCE_YEAR) ? calculatePart3PayableLCFS(part3, complianceReport) : calculatePart3Payable(part3, period)
  return part3
}

function Part3NonSupplimentalTableData (part3) {
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
  // Line 26A
  part3[SCHEDULE_SUMMARY.LINE_26_A][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_A][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_A][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_A][3].className = 'hidden'
  // Line 26B
  part3[SCHEDULE_SUMMARY.LINE_26_B][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_B][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_B][3].className = 'hidden'
  // Line 26C
  part3[SCHEDULE_SUMMARY.LINE_26_C][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_C][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_C][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_C][3].className = 'hidden'

  return part3
}

function Part3NonSupplimentalLineData (part3) {
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
  // Line 26A
  part3[SCHEDULE_SUMMARY.LINE_26_A][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_A][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_A][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_A][3].className = 'hidden'
  // Line 26B
  part3[SCHEDULE_SUMMARY.LINE_26_B][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_B][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_B][3].className = 'hidden'
  // Line 26C
  part3[SCHEDULE_SUMMARY.LINE_26_C][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_C][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_26_C][2] = {
    className: 'hidden',
    value: ''
  }
  part3[SCHEDULE_SUMMARY.LINE_26_C][3].className = 'hidden'

  return part3
}

function Part3SupplementalData (
  part3,
  summary,
  updateCreditsOffsetA,
  lastAcceptedOffset,
  skipFurtherUpdateCreditsOffsetA,
  complianceReport,
  alreadyUpdated
) {
  const {
    supplementalNumber,
    totalPreviousCreditReductions,
    previousReportWasCredit,
    history,
    status
  } = complianceReport

  part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = summary.creditsOffsetB

  part3[
    SCHEDULE_SUMMARY.LINE_26_B
  ][0].value = `Banked credits used to offset outstanding debits - Supplemental Report #${supplementalNumber}`

  part3[
    SCHEDULE_SUMMARY.LINE_26_C
  ][0].value = `Banked credits spent that will be returned due to debit decrease - Supplemental Report #${supplementalNumber}`

  const netBalance =
    Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value) !== 0
      ? Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value) * -1
      : 0

  // if we result in a positive credit offset
  if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset > netBalance &&
    netBalance > 0 &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value !== lastAcceptedOffset && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = netBalance
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // if after adjustments we still end up in a debit position
  if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset <= netBalance &&
    netBalance > 0 &&
    totalPreviousCreditReductions - netBalance <= 0 &&
    [totalPreviousCreditReductions, lastAcceptedOffset].indexOf(
      part3[SCHEDULE_SUMMARY.LINE_26_A][2].value
    ) <= 0 && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = netBalance
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = totalPreviousCreditReductions
  } else if (
    lastAcceptedOffset !== null &&
    lastAcceptedOffset > netBalance &&
    netBalance > 0 && !alreadyUpdated &&
    lastAcceptedOffset - netBalance > 0 &&
    (part3[SCHEDULE_SUMMARY.LINE_26_A][2].value !== lastAcceptedOffset ||
      part3[SCHEDULE_SUMMARY.LINE_26][2].value !== netBalance)
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = netBalance
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // was the previous supplemental, submitted and hasnt been accepted/rejected yet?
  if (
    status.fuelSupplierStatus === 'Draft' &&
    history &&
    history[0].status.fuelSupplierStatus === 'Submitted' &&
    !history[0].status.directorStatus && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = totalPreviousCreditReductions
    skipFurtherUpdateCreditsOffsetA = true
  }

  if (
    previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value > 0 && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = 0
    skipFurtherUpdateCreditsOffsetA = true
  }

  if (
    lastAcceptedOffset !== null &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 &&
    !skipFurtherUpdateCreditsOffsetA && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value = lastAcceptedOffset
  }

  // if we still dont have LINE26A at this point, let's use the total credit reductions so far
  if (
    !previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 && !alreadyUpdated
  ) {
    updateCreditsOffsetA = true
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value =
      totalPreviousCreditReductions || summary.creditsOffsetA
  }

  if (
    !previousReportWasCredit &&
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value <= 0 &&
    summary.creditsOffsetA > 0 && !alreadyUpdated
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

  let creditsOffsetC = Number(part3[SCHEDULE_SUMMARY.LINE_26_C][2].value)
  if (isNaN(creditsOffsetC)) {
    creditsOffsetC = 0
  }

  const creditsOffset = creditsOffsetA + creditsOffsetB
  part3[SCHEDULE_SUMMARY.LINE_26][2].value = creditsOffset

  if (creditsOffset > 0 && netBalance > 0 && creditsOffset > netBalance) {
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = netBalance
  }

  const max26BValue =
    part3[SCHEDULE_SUMMARY.LINE_26_A][2].value +
    part3[SCHEDULE_SUMMARY.LINE_25][2].value

  if (max26BValue > 0) {
    part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = 0
  }

  const line25 = Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value)
  const line26A = Number(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value)

  // If previously accepted reports have spent credits that are larger
  // than the current debits scenario, then we need to give the difference
  // back to the supplier
  if (line25 <= 0 && (line26A > (line25 * -1))) {
    part3[SCHEDULE_SUMMARY.LINE_26_C][2].value = line26A + line25
  }

  // If the supplier is in a credits positive scenario then
  // there will be no credits used
  if (line25 > 0) {
    part3[SCHEDULE_SUMMARY.LINE_26][2].value = 0
    part3[SCHEDULE_SUMMARY.LINE_26_C][2].value = 0
  }

  // console.log('LINE_23', part3[SCHEDULE_SUMMARY.LINE_23][2].value)
  // console.log('LINE_24', part3[SCHEDULE_SUMMARY.LINE_24][2].value)
  // console.log('LINE_25', part3[SCHEDULE_SUMMARY.LINE_25][2].value)
  // console.log('LINE_26', part3[SCHEDULE_SUMMARY.LINE_26][2].value)
  // console.log('LINE_26_A', part3[SCHEDULE_SUMMARY.LINE_26_A][2].value)
  // console.log('LINE_26_B', part3[SCHEDULE_SUMMARY.LINE_26_B][2].value)
  // console.log('LINE_26_C', part3[SCHEDULE_SUMMARY.LINE_26_C][2].value)
  // console.log('LINE_27', part3[SCHEDULE_SUMMARY.LINE_27][2].value)
  // console.log('LINE_28', part3[SCHEDULE_SUMMARY.LINE_28][2].value)

  return part3
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

function calculatePart3PayableLCFS (part3, complianceReport) {
  // Available compliance unit balance on March 31, YYYY - Line 29A
  const availableBalance = Number(Math.min(complianceReport.maxCreditOffsetExcludeReserved, complianceReport.maxCreditOffset))
  part3[SCHEDULE_SUMMARY.LINE_29_A][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_29_A][2],
    value: availableBalance
  }
  part3[SCHEDULE_SUMMARY.LINE_28_A][0].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_28_A][1].className = 'hidden'
  part3[SCHEDULE_SUMMARY.LINE_28_A][2] = {
    className: 'hidden',
    value: '0'
  }
  // Net compliance unit balance for compliance period - Line 25
  let netBalance = Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value)
  const netCreditBalanceChange = Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value)
  if (complianceReport.isSupplemental) {
    let totalPreviousReduction = 0
    let totalPreviousValidation = 0
    for (const transaction of complianceReport.creditTransactions) {
      if (transaction.type === "Credit Validation") {
        totalPreviousValidation += Number(transaction.credits)
      }
      if (transaction.type === "Credit Reduction") {
        totalPreviousReduction += Number(transaction.credits)
      }
    }
    netBalance = netCreditBalanceChange - (totalPreviousValidation - totalPreviousReduction)
  }

  const adjustedBalance = availableBalance + netBalance
  if (availableBalance <= 0 && netBalance < 0) {
    part3[SCHEDULE_SUMMARY.LINE_28_A][0].className = 'text total'
    part3[SCHEDULE_SUMMARY.LINE_28_A][0].value = `Non-compliance penalty payable (${Math.abs(adjustedBalance)} units * $600 CAD per unit)`
    part3[SCHEDULE_SUMMARY.LINE_28_A][1].className = 'line total'
    part3[SCHEDULE_SUMMARY.LINE_28_A][2] = cellFormatCurrencyTotal(adjustedBalance * -600)
    part3[SCHEDULE_SUMMARY.LINE_29_A][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_29_A][2],
      value: 0
    }
    let totalPreviousComplianceUnits = 0
    for (const delta of complianceReport.deltas) {
      if (delta.snapshot.data.summary.lines['25']) {
        totalPreviousComplianceUnits += Number(delta.snapshot.data.summary.lines['25'])
      }
    }
    part3[SCHEDULE_SUMMARY.LINE_29_B][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_29_B][2],
      value: (Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value) - totalPreviousComplianceUnits) 
    } // reduce previous deductions if any
    part3[SCHEDULE_SUMMARY.LINE_29_C][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_29_C][2],
      value: 0
    }
  } else {
    part3[SCHEDULE_SUMMARY.LINE_29_A][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_29_A][2],
      value: availableBalance
    }
    if ((netBalance < 0 && adjustedBalance >= 0) || (netBalance >= 0)) {
      part3[SCHEDULE_SUMMARY.LINE_29_B][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_29_B][2],
        value: netBalance
      }
    } else if ((netBalance < 0) && (adjustedBalance < 0)) {
      part3[SCHEDULE_SUMMARY.LINE_29_B][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_29_B][2],
        value: (adjustedBalance > 0) ? netBalance : (-1 * availableBalance)
      }
      part3[SCHEDULE_SUMMARY.LINE_28_A][0].className = 'text total'
      part3[SCHEDULE_SUMMARY.LINE_28_A][0].value = `Non-compliance penalty payable (${Math.abs(adjustedBalance)} units * $600 CAD per unit)`
      part3[SCHEDULE_SUMMARY.LINE_28_A][1].className = 'line total'
      part3[SCHEDULE_SUMMARY.LINE_28_A][2] = cellFormatCurrencyTotal(adjustedBalance * -600)
    }
    part3[SCHEDULE_SUMMARY.LINE_29_C][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_29_C][2],
      value: Number(part3[SCHEDULE_SUMMARY.LINE_29_A][2].value) + Number(part3[SCHEDULE_SUMMARY.LINE_29_B][2].value)
    }
  }

  part3[SCHEDULE_SUMMARY.LINE_28][2].value = part3[SCHEDULE_SUMMARY.LINE_28_A][2].value
  return part3
}

function calculatePart3Payable (part3, period) {
  let credits = Number(part3[SCHEDULE_SUMMARY.LINE_26][2].value)
  const balance = Number(part3[SCHEDULE_SUMMARY.LINE_25][2].value)

  let outstandingBalance = 0
  let payable = 0

  if (Number.isNaN(credits)) {
    credits = 0
  }

  // Default value for oustanding balance is credits - debits
  outstandingBalance = balance + Number(credits)

  // If we have a positive balance, or there are credits that need to be given back to the supplier,
  // then there is no outstanding balance or penalty payable
  if (balance > 0 || part3[SCHEDULE_SUMMARY.LINE_26_C][2].value > 0) {
    outstandingBalance = 0
  }

  // If the supplier has previously spent credits more than this current supplementary balance
  // then there is no oustanding balance or penalty payable
  if (balance <= 0 && part3[SCHEDULE_SUMMARY.LINE_26_A][2].value + balance >= 0) {
    outstandingBalance = 0
  }

  // Calculate amount payable penalty
  if (Number(period) <= 2022) {
    payable = outstandingBalance * -200 // negative symbol so that the product is positive
  } else {
    payable = outstandingBalance * -600 // negative symbol so that the product is positive
  }

  if (payable === 0) {
    outstandingBalance = ''
    payable = ''
  }

  part3[SCHEDULE_SUMMARY.LINE_27][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_27][2],
    value: outstandingBalance
  }

  part3[SCHEDULE_SUMMARY.LINE_28][2] = {
    ...part3[SCHEDULE_SUMMARY.LINE_28][2],
    value: payable
  }

  // console.log('LINE_23', part3[SCHEDULE_SUMMARY.LINE_23][2].value)
  // console.log('LINE_24', part3[SCHEDULE_SUMMARY.LINE_24][2].value)
  // console.log('LINE_25', part3[SCHEDULE_SUMMARY.LINE_25][2].value)
  // console.log('LINE_26', part3[SCHEDULE_SUMMARY.LINE_26][2].value)
  // console.log('LINE_26_A', part3[SCHEDULE_SUMMARY.LINE_26_A][2].value)
  // console.log('LINE_26_B', part3[SCHEDULE_SUMMARY.LINE_26_B][2].value)
  // console.log('LINE_26_C', part3[SCHEDULE_SUMMARY.LINE_26_C][2].value)
  // console.log('LINE_27', part3[SCHEDULE_SUMMARY.LINE_27][2].value)
  // console.log('LINE_28', part3[SCHEDULE_SUMMARY.LINE_28][2].value)

  return part3
}

function _calculatePart3 (props, state, setState) {
  const { part3 } = state
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

  if (summary.creditsOffsetC) {
    part3[SCHEDULE_SUMMARY.LINE_26_C][2].value = summary.creditsOffsetC
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
    readOnly: netTotal >= 0 || props.readOnly || isSupplemental,
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
      readOnly: netTotal >= 0 || props.readOnly || maxValue <= 0,
      attributes: {
        ...part3[SCHEDULE_SUMMARY.LINE_26_B][2].attributes,
        maxValue
      },
      value: maxValue <= 0 ? 0 : part3[SCHEDULE_SUMMARY.LINE_26_B][2].value
    }
  }

  setState({
    ...state,
    part3
  })

  return part3
}

export {
  calculatePart3Payable,
  calculatePart3PayableLCFS,
  _calculatePart3,
  tableData,
  lineData,
  populateSchedules,
  Part3SupplementalData
}
