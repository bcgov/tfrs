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
    const result = lineData(part3, summary, complianceReport)
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
    const result = lineData(part3, summary, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(20)
  })

  test('is-supplemental ', () => {
    const part3 = new ScheduleSummaryPart3()
    const complianceReport = {
      isSupplemental: false
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
    const result = lineData(part3, summary, complianceReport)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(20)
  })
})
