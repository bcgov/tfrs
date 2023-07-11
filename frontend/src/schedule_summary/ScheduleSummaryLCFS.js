import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { numericColumn, numericInput, numericCurrency } from '../compliance_reporting/components/Columns'
import Tooltip from '../app/components/Tooltip'

class ScheduleSummaryLCFS {
  constructor(period) {
    period = Number(period)
    return [
      [{ // line 25
        className: 'text',
        readOnly: true,
        value: 'Net compliance unit balance for compliance period'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 25 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net balance of compliance units for the compliance period."
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
      }], // line 25
      [{ // line 29a
        className: 'text',
        readOnly: true,
        value: `Available compliance unit balance on March 31, ${period + 1}`
      }, {
        className: 'line',
        readOnly: true
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
      }], // line 29a
      [{ // line 29b
        className: 'text',
        readOnly: true,
        value: 'Compliance unit balance change from assessment'
      }, {
        className: 'line',
        readOnly: true
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
      }], // line 29b
      [{ // line 28
        className: 'text total',
        readOnly: true,
        value: 'Non-compliance penalty payable (CAD)'
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
                'This line displays the penalty payable based on the information provided' +
                ' and is calculated using the $600 per outstanding debit non-compliance penalty.'
              }
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericCurrency,
        ttributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          placement: 'right',
          step: '1'
        },
        className: 'total numeric'
      }], // line 28
      [{ // line 29c
        className: 'text',
        readOnly: true,
        value: `Available compliance unit balance after assessment on March 31, ${period + 1}`
      }, {
        className: 'line',
        readOnly: true
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
      }] // line 29c
    ]
  }
}

export default ScheduleSummaryLCFS
