import { _calculatePart3 } from '../../Part3SummaryContainer'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { cellFormatNumeric } from '../../../utils/functions'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import ScheduleSummaryPenalty from '../../ScheduleSummaryPenalty'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('Calculate Part3', () => {
  test('basic credit positive scenarios', () => {
    let part3 = new ScheduleSummaryPart3()
    const penalty = new ScheduleSummaryPenalty()
    const summary = {
      creditsOffset: 0,
      creditsOffsetA: 0,
      creditsOffsetB: 0,
      creditsOffsetC: 0,
      lines: {
        23: '472522',
        24: '467545'
      }
    }
    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 1,
      totalPreviousCreditReductions: 0, // total credits used in previous supplementals/inital report
      supplementalNote: 'Resubmitting due to new Canola coprocessing pathways',
      previousReportWasCredit: false,
      maxCreditOffset: 86661,
      status: {
        fuelSupplierStatus: 'Submitted'
      }
    }
    // const lastAcceptedOffset = 83106
    // const updateCreditsOffsetA = false
    // const skipFurtherUpdateCreditsOffsetA = false

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits

    const props = {
      scheduleState: {
        summary
      },
      complianceReport,
      recomputedTotals: {},
      showPenaltyWarning: jest.fn()
    }
    const state = {
      part3,
      penalty
    }
    const setState = jest.fn()

    part3 = _calculatePart3(props, state, setState)

    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(undefined)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe('')
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe('')
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe('')
  })

  test('is supplementary debit scenario', () => {
    let part3 = new ScheduleSummaryPart3()
    const penalty = new ScheduleSummaryPenalty()
    const summary = {
      creditsOffset: 500,
      creditsOffsetA: 83106,
      creditsOffsetB: 1600,
      creditsOffsetC: 0,
      lines: {
        23: '422522',
        24: '467545',
        25: '-45023'
      }
    }
    const complianceReport = {
      isSupplemental: true,
      supplementalNumber: 3,
      totalPreviousCreditReductions: 0, // total credits used in previous supplementals/inital report
      supplementalNote: 'Resubmitting due to new Canola coprocessing pathways',
      previousReportWasCredit: false,
      maxCreditOffset: 86661,
      status: {
        fuelSupplierStatus: 'Submitted'
      },
      compliancePeriod: {
        description: '2021'
      }
    }
    // const lastAcceptedOffset = 83106
    // const updateCreditsOffsetA = false
    // const skipFurtherUpdateCreditsOffsetA = false

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance

    const props = {
      scheduleState: {
        summary
      },
      complianceReport,
      recomputedTotals: {
        scheduleB: {
          records: [
            {
              credits: 0,
              debits: 500
            }
          ]
        }
      },
      showPenaltyWarning: jest.fn()
    }
    const state = {
      part3,
      penalty
    }
    const setState = jest.fn()

    part3 = _calculatePart3(props, state, setState)

    expect(part3[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(500)
    expect(part3[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe('')
    expect(part3[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(1600)
  })
})
