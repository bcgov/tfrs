import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { numericColumn, numericInput, totalViewer } from '../compliance_reporting/components/Columns'
import Tooltip from '../app/components/Tooltip'

class ScheduleSummaryPart3 {
  constructor (period) {
    period = Number(period)
    return [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: 'Part 3 - Low Carbon Fuel Requirement Summary'
      }, {
        className: 'line header',
        readOnly: true,
        value: 'Line'
      }, {
        className: 'credits',
        readOnly: true
      }, {
        className: 'units header',
        readOnly: true,
        value: 'Units'
      }], // header
      [{ // line 23
        className: 'text',
        readOnly: true,
        value: 'Total credits from fuel supplied (from Schedule B)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 23 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total number of credits for the compliance period and is informed from reporting in Schedule B."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn, {
        readOnly: true,
        value: 'Credits'
      }], // line 23
      [{ // line 24
        className: 'text',
        readOnly: true,
        value: 'Total debits from fuel supplied (from Schedule B)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 24 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total number of debits for the compliance period and is informed from reporting in Schedule B."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn, {
        readOnly: true,
        value: '(Debits)'
      }], // line 24
      [{ // line 25
        className: 'text',
        readOnly: true,
        value: 'Net credit or debit balance for compliance period'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 25 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net balance of credits or debits for the compliance period."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn, {
        readOnly: true,
        value: 'Credits (Debits)'
      }], // line 25
      [{ // line 26
        className: 'text',
        readOnly: true,
        value: 'Total banked credits used to offset outstanding debits (if applicable)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 26 '}
            <Tooltip
              className="info"
              show
              title="The quantity of banked credits used to offset debits accrued in the compliance period, if applicable. This value is the total quantity of banked credits used to offset debits and is informed from all compliance reports for this compliance period (i.e. initial report and supplemental reports)."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        attributes: {
          addCommas: true,
          additionalTooltip: '',
          dataNumberToFixed: 0,
          maxLength: '20',
          placement: 'right',
          step: '1'
        },
        className: 'tooltip-large number',
        readOnly: true
      }, {
        readOnly: true,
        value: 'Credits'
      }], // line 26
      [{ // line 26a
        className: 'text',
        readOnly: true,
        value: 'Banked credits used to offset outstanding debits - Previous Reports'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 26a '}
            <Tooltip
              className="info"
              show
              title="The quantity of banked credits used to offset debits from previously submitted compliance report(s) for this compliance period."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn, {
        readOnly: true,
        value: 'Credits'
      }], // line 26a
      [{ // line 26b
        className: 'text',
        readOnly: true,
        value: 'Banked credits used to offset outstanding debits - Supplemental Report'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 26b '}
            <Tooltip
              className="info"
              show
              title="Enter the quantity of banked credits used to offset debits accrued in the compliance period. This line is only available if the net debit balance has increased as a result of changes to Schedule B in this supplemental report."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          placement: 'right',
          step: '1'
        },
        className: 'tooltip-large number',
        readOnly: true
      }, {
        readOnly: true,
        value: 'Credits'
      }], // line 26b
      [{ // line 26c
        className: 'text',
        readOnly: true,
        value: 'Banked credits spent that will be returned due to debit decrease - Supplemental Report'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 26c '}
            <Tooltip
              className="info"
              show
              title="If a previous supplemental report used more credits to cover a debit position than is now required, the difference is returned."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          placement: 'right',
          step: '1'
        },
        className: 'tooltip-large number',
        readOnly: true
      }, {
        readOnly: true,
        value: 'Credits'
      }], // line 26c
      [{ // line 27
        className: 'text total',
        readOnly: true,
        value: 'Outstanding debit balance'
      }, {
        className: 'line total',
        readOnly: true,
        value: (
          <div>
            {'Line 27 '}
            <Tooltip
              className="info"
              show
              title="This line displays the outstanding debit balance (if any) based on the information provided."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn, {
        className: 'total',
        readOnly: true,
        value: '(Debits)'
      }], // line 27
      [{ // line 28
        className: 'text total',
        readOnly: true,
        value: 'Part 3 non-compliance penalty payable'
      }, {
        className: 'line total',
        readOnly: true,
        value: (
          <div>
            {'Line 28 '}
            <Tooltip
              className="info"
              show
              title={
                period < 2023
                  ? 'This line displays the penalty payable based on the ' +
                  'information provided and is calculated using the $200 per outstanding ' +
                  'debit non-compliance penalty.'
                  : 'This line displays the penalty payable based on the information provided' +
                  ' and is calculated using the $600 per outstanding debit non-compliance penalty.'
              }
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...totalViewer,
        className: 'total numeric'
      }, {
        className: 'total',
        readOnly: true,
        value: '$CAD'
      }] // line 28
    ]
  }
}

export default ScheduleSummaryPart3
