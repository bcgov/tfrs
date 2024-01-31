import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { SCHEDULE_SUMMARY } from '../../../constants/schedules/scheduleColumns'
import { tableData } from '../../Part3SummaryContainer'
import ScheduleSummaryPart3 from '../../ScheduleSummaryPart3'
import Tooltip from '../../../app/components/Tooltip'

describe('Part3 Table Data', () => {
  test('displays the correct tooltip for periods on or before Dec 31 2022', () => {
    const summary = {
      lines: {
      }
    }
    const props = {
      period: 2022
    }
    const part3 = new ScheduleSummaryPart3(props.period)
    const result = tableData(part3, summary, { isSupplemental: false })
    expect(result[SCHEDULE_SUMMARY.LINE_28][1].value.props.children).toEqual([
      'Line 28 ',
      <Tooltip // eslint-disable-line react/jsx-key
        className="info"
        show
        title="This line displays the penalty payable based on the information provided and is calculated using the $200 per outstanding debit non-compliance penalty."
      >
        <FontAwesomeIcon icon="info-circle" />
      </Tooltip>
    ])
  })
  test('displays the correct tooltip for periods on and after Jan 01 2023', () => {
    const summary = {
      lines: {
      }
    }
    const props = {
      period: 2023
    }
    const part3 = new ScheduleSummaryPart3(props.period)
    const result = tableData(part3, summary, { isSupplemental: false })
    expect(result[SCHEDULE_SUMMARY.LINE_28][1].value.props.children).toEqual([
      'Line 28 ',
      <Tooltip // eslint-disable-line react/jsx-key
        className="info"
        show
        title="This line displays the penalty payable based on the information provided and is calculated using the $600 per outstanding debit non-compliance penalty."
      >
        <FontAwesomeIcon icon="info-circle" />
      </Tooltip>
    ])
  })
})
