import { SCHEDULE_SUMMARY } from '../../../src/constants/schedules/scheduleColumns'
import {
  lineData
} from '../../../src/schedule_summary/Part3SummaryContainer'
// import Tooltip from '../../../src/app/components/Tooltip'
// import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ScheduleSummaryPart3 from '../../../src/schedule_summary/ScheduleSummaryPart3'
import { cellFormatNumeric } from '../../../src/utils/functions'

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
