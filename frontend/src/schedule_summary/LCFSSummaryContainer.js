import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { cellFormatNumeric, cellFormatTotal } from '../utils/functions'

function tableData(
  part3,
  summary,
  complianceReport
) {
  let complianceUnitBalance = Number(Math.min(complianceReport.maxCreditOffsetExcludeReserved, complianceReport.maxCreditOffset))
  let netComplianceBalance = Number(summary.lines['25'])
  let changeAssessmentBalance = complianceUnitBalance + netComplianceBalance
  part3[SCHEDULE_SUMMARY.LCFS_LINE_25][2] = cellFormatNumeric(netComplianceBalance)
  part3[SCHEDULE_SUMMARY.LCFS_LINE_29_A][2] = cellFormatNumeric(complianceUnitBalance) // Available compliance Unit on March 31, YYYY
  part3[SCHEDULE_SUMMARY.LCFS_LINE_29_B][2] = cellFormatNumeric(changeAssessmentBalance) // Compliance unit balance change from assessment
  let nonCompliancePayment = Number(summary.lines['28'])
  if (nonCompliancePayment > 0) {
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][2] = cellFormatTotal(nonCompliancePayment) // Non-compliance penalty payable
    part3[SCHEDULE_SUMMARY.LCFS_LINE_29_C][2] = cellFormatNumeric(0) // available compliance unit balance after assessment
  } else {
    // if there is no compliane penalty to pay then hide line 28
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][2] = {
      className: 'hidden',
      value: ''
    }
    part3[SCHEDULE_SUMMARY.LCFS_LINE_29_C][2] = cellFormatNumeric(changeAssessmentBalance)
  }
  return part3
}

function lineData(
  part3,
  summary,
  complianceReport,
  updateCreditsOffsetA,
  lastAcceptedOffset,
  skipFurtherUpdateCreditsOffsetA,
  alreadyUpdated,
  period
) {
  debugger
  // const { isSupplemental } = complianceReport
  // part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset
  // if (!isSupplemental) {
  //   part3 = Part3NonSupplimentalLineData(part3)
  // } else {
  //   // is supplemental
  //   part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport, alreadyUpdated)
  // }
  // part3 = calculatePart3Payable(part3, period)
  return part3
}

function populateSchedules(props, state, setState) {
  debugger
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

function calculatePart3Payable(part3, period) {
  debugger
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

  return part3
}

function _calculatePart3 (props, state, setState) {
  debugger
  const { part3 } = state
  const { summary } = props.scheduleState
  const { maxCreditOffset, isSupplemental } = props.complianceReport

  let totalCredits = 0
  let totalDebits = 0
  if (props.recomputedTotals.scheduleB) {
    ({ totalCredits, totalDebits } = props.recomputedTotals.scheduleB)
  }

  // if (summary.creditsOffset) {
  //   part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset
  // }

  // if (summary.creditsOffsetB) {
  //   part3[SCHEDULE_SUMMARY.LINE_26_B][2].value = summary.creditsOffsetB
  // }

  // if (summary.creditsOffsetC) {
  //   part3[SCHEDULE_SUMMARY.LINE_26_C][2].value = summary.creditsOffsetC
  // }

  // part3[SCHEDULE_SUMMARY.LINE_23][2] = {
  //   ...part3[SCHEDULE_SUMMARY.LINE_23][2],
  //   value: Math.round(totalCredits)
  // }

  // part3[SCHEDULE_SUMMARY.LINE_24][2] = {
  //   ...part3[SCHEDULE_SUMMARY.LINE_24][2],
  //   value: -1 * Math.round(totalDebits)
  // }

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

  // part3[SCHEDULE_SUMMARY.LINE_26][2] = {
  //   ...part3[SCHEDULE_SUMMARY.LINE_26][2],
  //   readOnly: netTotal >= 0 || props.readOnly || isSupplemental,
  //   attributes: {
  //     ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
  //     maxValue
  //   }
  // }

  // if (isSupplemental) {
  //   if (
  //     part3[SCHEDULE_SUMMARY.LINE_26][2].value +
  //       part3[SCHEDULE_SUMMARY.LINE_25][2].value >
  //     0
  //   ) {
  //     part3[SCHEDULE_SUMMARY.LINE_26][2].value =
  //       part3[SCHEDULE_SUMMARY.LINE_25][2].value * -1
  //   }

  //   let max26BValue = 0

  //   // we only have a max value for LINE 26 B if we're in a deficit, if it's positive
  //   // that means we're getting a credit and there's no point in enabling LINE_26_B
  //   if (part3[SCHEDULE_SUMMARY.LINE_25][2].value < 0) {
  //     max26BValue =
  //       (part3[SCHEDULE_SUMMARY.LINE_25][2].value +
  //         part3[SCHEDULE_SUMMARY.LINE_26_A][2].value) *
  //       -1
  //   }

  //   if (max26BValue < maxValue) {
  //     maxValue = max26BValue
  //   }

  //   part3[SCHEDULE_SUMMARY.LINE_26_B][2] = {
  //     ...part3[SCHEDULE_SUMMARY.LINE_26_B][2],
  //     readOnly: netTotal >= 0 || props.readOnly || maxValue <= 0,
  //     attributes: {
  //       ...part3[SCHEDULE_SUMMARY.LINE_26_B][2].attributes,
  //       maxValue
  //     },
  //     value: maxValue <= 0 ? 0 : part3[SCHEDULE_SUMMARY.LINE_26_B][2].value
  //   }
  // }

  setState({
    ...state,
    part3
  })

  return part3
}

export {
  calculatePart3Payable,
  _calculatePart3,
  tableData,
  lineData,
  populateSchedules
}
