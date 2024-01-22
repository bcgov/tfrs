import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { cellFormatNumeric } from '../../../utils/functions'
import { lineData } from '../../Part3SummaryContainer'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('Part3 Line Data', () => {
  test('non-supplemental line 26 is 0 when line 25 is > 0', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: false
    }
    const summary = {
      lines: {
        25: 789,
        26: 100
      },
      creditsOffset: 20
    }
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26'])
    const result = lineData(part3, summary, 2021, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(0)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].className).toBe('numeric')
  })

  test('non-supplemental line 26 equals creditsOffset by default', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: false
    }
    const summary = {
      lines: {
        25: -1000,
        26: 100
      },
      creditsOffset: 20
    }
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26'])
    const result = lineData(part3, summary, 2021, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(20)
  })

  test('is-supplemental ', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: false,
      compliancePeriod: {
        description: '2023'
      }
    }
    const summary = {
      lines: {
        25: -1000,
        26: 100
      },
      creditsOffset: 20,
      creditsOffsetB: 10
    }
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26'])
    const result = lineData(part3, summary, 2021, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(20)
  })

  test('is-supplemental with excess spent credits', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: true,
      status: {
        fuelSupplierStatus: 'Draft'
      },
      compliancePeriod: {
        description: '2021'
      }
    }
    const summary = {
      lines: {
        25: -1000,
        '26A': 2000
      },
      creditsOffset: 500,
      creditsOffsetB: 0,
      creditsOffsetC: 0
    }
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric(summary.lines['26A'])
    const result = lineData(part3, summary, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(1000)
  })

  test('is-supplemental with credit give back scenario', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: true,
      status: {
        fuelSupplierStatus: 'Draft'
      },
      compliancePeriod: {
        description: '2021'
      }
    }
    const summary = {
      lines: {
        23: 1000,
        24: 900,
        25: -100,
        '26A': 200
      },
      creditsOffset: 200,
      creditsOffsetB: 0,
      creditsOffsetC: 0
    }
    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23'])
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24'])
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric(summary.lines['26A'])

    const result = lineData(part3, summary, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_25][2].value).toBe(-100)
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(200)
    expect(result[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(100)
  })

  test('supplemental debit scenario with previously spent credits less than debits', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: true,
      status: {
        fuelSupplierStatus: 'Draft'
      },
      compliancePeriod: {
        description: '2021'
      }
    }
    const summary = {
      lines: {
        23: 2519,
        24: 6933,
        25: -4414,
        '26A': 1087
      },
      creditsOffset: 1087,
      creditsOffsetB: 0,
      creditsOffsetC: 0
    }
    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23'])
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24'])
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric(summary.lines['26A'])

    const result = lineData(part3, summary, complianceReport, false, false, false, false, 2021)
    expect(result[SCHEDULE_SUMMARY.LINE_25][2].value).toBe(-4414)
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(1087)
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(result[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(undefined)
    expect(result[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-3327)
    expect(result[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(665400)
  })

  test('supplemental debit scenario with previously spent credits more than debits', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: true,
      status: {
        fuelSupplierStatus: 'Draft'
      },
      compliancePeriod: {
        description: '2021'
      }
    }
    const summary = {
      lines: {
        23: 2519,
        24: 6933,
        25: -4414,
        '26A': 5000
      },
      creditsOffset: 5000,
      creditsOffsetB: 0,
      creditsOffsetC: 0
    }
    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23'])
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24'])
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25'])
    part3[SCHEDULE_SUMMARY.LINE_26_A][2] = cellFormatNumeric(summary.lines['26A'])

    const result = lineData(part3, summary, complianceReport, false, false, false, false, 2021)
    expect(result[SCHEDULE_SUMMARY.LINE_25][2].value).toBe(-4414)
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(5000)
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(0)
    expect(result[SCHEDULE_SUMMARY.LINE_26_C][2].value).toBe(586)
    expect(result[SCHEDULE_SUMMARY.LINE_27][2].value).toBe('')
    expect(result[SCHEDULE_SUMMARY.LINE_28][2].value).toBe('')
  })
})
