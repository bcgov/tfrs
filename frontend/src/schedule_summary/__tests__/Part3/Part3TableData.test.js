import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { tableData } from '../../Part3SummaryContainer'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import Tooltip from '../../../app/components/Tooltip'
import FontAwesome from '../../../app/FontAwesome' // eslint-disable-line no-unused-vars

describe('Part3 Table Data', () => {
  test('tableData function with non-supplemental data', () => {
    const part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: 123,
        24: 456,
        25: 789,
        26: 100,
        '26A': 200,
        '26B': 300,
        27: -50,
        28: 600
      }
    }
    const result = tableData(part3, summary, { isSupplemental: false })

    expect(result[SCHEDULE_SUMMARY.LINE_23][2].value).toBe(123)
    expect(result[SCHEDULE_SUMMARY.LINE_24][2].value).toBe(456)
    expect(result[SCHEDULE_SUMMARY.LINE_25][2].value).toBe(789)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(100)

    // Non-supplemental should not have 26_A or 26_B values
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].value).not.toBe(200)
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][0].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][1].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][3].className).toBe('hidden')

    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).not.toBe(300)
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][0].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][1].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].className).toBe('hidden')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe('')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][3].className).toBe('hidden')

    expect(result[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-50)
    expect(result[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(600)

    expect(result[SCHEDULE_SUMMARY.LINE_26][0].value).toBe(
      'Banked credits used to offset outstanding debits (if applicable)'
    )
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].attributes.additionalTooltip).toBe(
      "The value entered here cannot be more than your organization's available credit balance for this compliance period or the net debit balance in Line 25."
    )
    expect(result[SCHEDULE_SUMMARY.LINE_26][1].value.props.children).toEqual([
      'Line 26 ',
      <Tooltip // eslint-disable-line react/jsx-key
        className="info"
        show
        title="Enter the quantity of banked credits used to offset debits accrued in the compliance period. This line is only available if there is a net debit balance in the compliance period, as indicated in Line 25."
      >
        <FontAwesomeIcon icon="info-circle" />
      </Tooltip>
    ])
  })

  test('tableData function with supplemental data', () => {
    const part3 = new ScheduleSummaryPart3()

    const summary = {
      lines: {
        23: 123,
        24: 456,
        25: 789,
        26: 100,
        '26A': 200,
        '26B': 300,
        27: -50,
        28: 600
      }
    }
    const result = tableData(part3, summary, { isSupplemental: true, supplementalNumber: 25 })

    expect(result[SCHEDULE_SUMMARY.LINE_23][2].value).toBe(123)
    expect(result[SCHEDULE_SUMMARY.LINE_24][2].value).toBe(456)
    expect(result[SCHEDULE_SUMMARY.LINE_25][2].value).toBe(789)
    expect(result[SCHEDULE_SUMMARY.LINE_26][2].value).toBe(100)

    // supplemental should have 26_A or 26_B values
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].value).toBe(200)
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][0].className).toBe('text')
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][1].className).toBe('line')
    expect(result[SCHEDULE_SUMMARY.LINE_26_A][2].className).toBe('numeric')

    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(300)
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][0].className).toBe('text')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][1].className).toBe('line')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].className).toBe('numeric')
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][2].value).toBe(300)

    expect(result[SCHEDULE_SUMMARY.LINE_27][2].value).toBe(-50)
    expect(result[SCHEDULE_SUMMARY.LINE_28][2].value).toBe(600)
    expect(result[SCHEDULE_SUMMARY.LINE_26_B][0].value).toBe(
      `Banked credits used to offset outstanding debits - Supplemental Report #${25}`
    )
    expect(result[SCHEDULE_SUMMARY.LINE_26][1].value.props.children).toEqual([
      'Line 26 ',
      <Tooltip // eslint-disable-line react/jsx-key
        className="info"
        show
        title="The quantity of banked credits used to offset debits accrued in the compliance period, if applicable. This value is the total quantity of banked credits used to offset debits and is informed from all compliance reports for this compliance period (i.e. initial report and supplemental reports)."
      >
        <FontAwesomeIcon icon="info-circle" />
      </Tooltip>
    ])
  })
})
