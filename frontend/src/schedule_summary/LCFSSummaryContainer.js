import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import { cellFormatCurrencyTotal, cellFormatNegativeNumber } from '../utils/functions'

function tableData (
  part3,
  summary,
  complianceReport
) {
  part3[SCHEDULE_SUMMARY.LCFS_LINE_25][2] = cellFormatNegativeNumber(summary.lines['25'])
  part3[SCHEDULE_SUMMARY.LCFS_LINE_29_A][2] = cellFormatNegativeNumber(summary.lines['29A']) // Available compliance Unit on March 31, YYYY
  part3[SCHEDULE_SUMMARY.LCFS_LINE_29_B][2] = cellFormatNegativeNumber(summary.lines['29B']) // Compliance unit balance change from assessment
  part3[SCHEDULE_SUMMARY.LCFS_LINE_28][2] = cellFormatCurrencyTotal(summary.lines['28']) // Non compliance penalty payable
  part3[SCHEDULE_SUMMARY.LCFS_LINE_29_C][2] = cellFormatNegativeNumber(summary.lines['29C']) // Available compliance unit balance after assessment

  if (summary.lines['28'] <= 0) {
    // if there is no compliane penalty to pay then hide line 28
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][0].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][1].className = 'hidden'
    part3[SCHEDULE_SUMMARY.LCFS_LINE_28][2] = {
      className: 'hidden',
      value: ''
    }
  }
  return part3
}

export {
  tableData
}
