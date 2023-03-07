import {
  calculatePart3Payable,
  Part3SupplementalData
} from '../../Part3SummaryContainer'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { cellFormatNumeric } from '../../../utils/functions'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'

test('updates LINE_26_B and LINE_26_A correctly when we have a positive credit offset', () => {
  let part3 = new ScheduleSummaryPart3()
  part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric('-123') // netBalance
  part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric('')
  part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric('456')
  part3[SCHEDULE_SUMMARY.LINE_26_B][2] = cellFormatNumeric('')

  const updateCreditsOffsetA = false
  const lastAcceptedOffset = 1000 // credits used previously to offset credits
  const summary = {
    creditsOffsetB: '789' // credits to be used from this supplemental report
  }
  const skipFurtherUpdateCreditsOffsetA = false
  const complianceReport = {
    supplementalNumber: 2,
    totalPreviousCreditReductions: 600, // total credits used in previous supplementals/inital report
    previousReportWasCredit: false,
    status: {
      fuelSupplierStatus: 'Draft'
    }
  }
  part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(summary.creditsOffsetB)
  expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(123)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(1000)
})

test('supplemental report submission #1 that increases debit obligation', () => {
  let part3 = new ScheduleSummaryPart3()
  part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric('100') // credits
  part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric('150') // debits
  part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric('-50') // netBalance
  const netBalance = (part3[SCHEDULE_SUMMARY.LINE_23][2].value - part3[SCHEDULE_SUMMARY.LINE_24][2].value) * -1

  const lastAcceptedOffset = 0 // credits used previously to offset credits
  const summary = {
    creditsOffsetB: 5 // credits to be used from this supplemental report
  }
  const complianceReport = {
    supplementalNumber: 1,
    totalPreviousCreditReductions: 45, // total credits used in previous supplementals/inital report
    previousReportWasCredit: false,
    status: {
      fuelSupplierStatus: 'Draft'
    }
  }
  const updateCreditsOffsetA = false
  const skipFurtherUpdateCreditsOffsetA = true

  part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)

  expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(netBalance)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(complianceReport.totalPreviousCreditReductions)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(summary.creditsOffsetB)

  part3 = calculatePart3Payable(part3)

  expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(
    netBalance -
      (part3[SCHEDULE_SUMMARY.LINE_26_A][2].value + part3[SCHEDULE_SUMMARY.LINE_26_B][2].value)
  )
})

test('supplemental report submission #1 that increases debit obligation with no additional credits', () => {
  let part3 = new ScheduleSummaryPart3()
  part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric('100') // credits
  part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric('200') // debits
  part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric('-100') // netBalance

  const lastAcceptedOffset = 50 // credits used previously to offset credits
  const summary = {
    creditsOffsetB: 0 // credits to be used from this supplemental report
  }
  const complianceReport = {
    supplementalNumber: 1,
    totalPreviousCreditReductions: 50, // total credits used in previous supplementals/inital report
    previousReportWasCredit: false,
    status: {
      fuelSupplierStatus: 'Draft'
    }
  }
  const updateCreditsOffsetA = false
  const skipFurtherUpdateCreditsOffsetA = true

  part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)

  expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(50)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(complianceReport.totalPreviousCreditReductions)
  expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)

  part3 = calculatePart3Payable(part3)

  expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-50)
  expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(10000)
})
