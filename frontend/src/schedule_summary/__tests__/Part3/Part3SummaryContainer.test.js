import {
  calculatePart3Payable,
  Part3SupplementalData
} from '../../Part3SummaryContainer'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { cellFormatNumeric } from '../../../utils/functions'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('Part3 Summary Container', () => {
  test('updates LINE_26_B and LINE_26_A correctly when we have a negative credit offset', () => {
    let part3 = new ScheduleSummaryPart3()
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric('-123') // netBalance
    const updateCreditsOffsetA = false
    const lastAcceptedOffset = 0 // credits used previously to offset credits 26A by default
    const summary = {
      creditsOffsetB: 123 // credits to be used from this supplemental report
    }
    const skipFurtherUpdateCreditsOffsetA = false
    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 2,
      totalPreviousCreditReductions: 0, // total credits used in previous supplementals/inital report
      previousReportWasCredit: false,
      status: {
        fuelSupplierStatus: 'Draft'
      }
    }
    part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(summary.creditsOffsetB)
    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(123)
  })

  test('updates LINE_26_B and LINE_26_A correctly when we have a positive credit offset', () => {
    let part3 = new ScheduleSummaryPart3()
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric('123') // netBalance
    const updateCreditsOffsetA = false
    const lastAcceptedOffset = 100 // credits used previously to offset credits 26A by default
    const summary = {
      creditsOffsetB: 0 // credits to be used from this supplemental report
    }
    const skipFurtherUpdateCreditsOffsetA = false
    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 2,
      totalPreviousCreditReductions: 0, // total credits used in previous supplementals/inital report
      previousReportWasCredit: false,
      status: {
        fuelSupplierStatus: 'Draft'
      }
    }
    part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(0)
  })

  test('supplemental report submission #3 that returns credits in order to offset credits that were already applied', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      creditsOffset: 0,
      creditsOffsetA: 83106,
      creditsOffsetB: 0,
      dieselClassDeferred: '0.00',
      dieselClassObligation: '0.00',
      dieselClassPreviouslyRetained: '1449774.00',
      dieselClassRetained: '1306364.00',
      gasolineClassDeferred: '0.00',
      gasolineClassObligation: '0.00',
      gasolineClassPreviouslyRetained: '3087774.00',
      gasolineClassRetained: '2831153.00',
      lines: {
        1: '1014140271.00',
        2: '118321094.00',
        3: '1132461365.00',
        4: '56623068',
        5: '0',
        6: '2831153.00',
        7: '3087774.00',
        8: '0.00',
        9: '0.00',
        10: '118577715.00',
        11: '0.00',
        12: '570717346.00',
        13: '82465070.00',
        14: '653182416.00',
        15: '26127297',
        16: '-508871.00',
        17: '1306364.00',
        18: '1449774.00',
        19: '0.00',
        20: '0.00',
        21: '82099609.00',
        22: '0.00',
        23: '422522',
        24: '467545',
        25: '-45023'
        // 26: 0,
        // '26A': 83106,
        // '26B': 0
        // 27: '-45023'
        // 28: '9004600.00'
      },
      netDieselClassTransferred: '-508871.00',
      netGasolineClassTransferred: '0',
      totalPayable: '9004600.00',
      totalPetroleumDiesel: '570717346.00',
      totalPetroleumGasoline: '1014140271.00',
      totalRenewableDiesel: '82465070.00',
      totalRenewableGasoline: '118321094.00'
    }

    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 3,
      totalPreviousCreditReductions: 0, // total credits used in previous supplementals/inital report
      supplementalNote: 'Resubmitting due to new Canola coprocessing pathways',
      previousReportWasCredit: false,
      status: {
        fuelSupplierStatus: 'Submitted'
      }
    }
    const lastAcceptedOffset = 83106
    const updateCreditsOffsetA = false
    const skipFurtherUpdateCreditsOffsetA = false

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance

    part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)

    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(45023)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(83106)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(38083)

    part3 = calculatePart3Payable(part3)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe('')
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe('')
  })

  test('supplemental report submission #2 that returns no credits', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      creditsOffset: 0,
      creditsOffsetA: 68399,
      creditsOffsetB: 0,
      lines: {
        23: '466239',
        24: '535893',
        25: '-69654'
        // 26: 68399,
        // '26A': 68399,
        // '26B': 0
        // '26C': 0
        // 27: '0'
        // 28: '0'
      }
    }

    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 2,
      totalPreviousCreditReductions: 68399, // total credits used in previous supplementals/inital report
      supplementalNote: 'Resubmitting due to new Canola coprocessing pathways',
      previousReportWasCredit: false,
      status: {
        fuelSupplierStatus: 'Submitted'
      }
    }
    const lastAcceptedOffset = 68399
    const updateCreditsOffsetA = false
    const skipFurtherUpdateCreditsOffsetA = false

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance

    part3 = Part3SupplementalData(part3, summary, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, complianceReport)

    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(68399)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(68399)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(undefined)

    part3 = calculatePart3Payable(part3, 2021)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-1255)
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(251000)
  })
})
