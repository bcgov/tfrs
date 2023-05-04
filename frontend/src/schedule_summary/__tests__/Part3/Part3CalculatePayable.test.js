import {
  calculatePart3Payable
} from '../../Part3SummaryContainer'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { cellFormatNumeric } from '../../../utils/functions'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('Calculate Part3 Payable', () => {
  test('with initial report and line 26 no input value', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: '2000',
        24: '4000',
        25: '-2000',
        26: '0'
      }
    }

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26']) // inputted offset

    part3 = calculatePart3Payable(part3)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-2000)
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(1200000)
  })

  test('with initial report and line 26 half input value', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: '2000',
        24: '4000',
        25: '-2000',
        26: '1000'
      }
    }

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26']) // inputted offset

    part3 = calculatePart3Payable(part3)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-1000)
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(600000)
  })

  test('with initial report and line 26 half input value and period < 2022', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: '2000',
        24: '4000',
        25: '-2000',
        26: '1000'
      }
    }

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26']) // inputted offset

    part3 = calculatePart3Payable(part3, 2021)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-1000)
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(200000)
  })

  test('with initial report and line 26 full input value', () => {
    let part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: '2000',
        24: '4000',
        25: '-2000',
        26: '2000'
      }
    }

    part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']) // credits
    part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']) // debits
    part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']) // netBalance
    part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26']) // inputted offset

    part3 = calculatePart3Payable(part3)
    expect(part3[SCHEDULE_SUMMARY.LINE_27][2].value).toBe('')
    expect(part3[SCHEDULE_SUMMARY.LINE_28][2].value).toBe('')
  })
})
