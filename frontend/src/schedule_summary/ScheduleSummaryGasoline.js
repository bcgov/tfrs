import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { numericColumn, numericInput, totalViewer } from '../compliance_reporting/components/Columns'
import Tooltip from '../app/components/Tooltip'

class ScheduleSummaryGasoline {
  constructor (readOnly = false) {
    return [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: 'Gasoline Class - 5% Renewable Requirement'
      }, {
        className: 'line header',
        readOnly: true,
        value: 'Line'
      }, {
        className: 'litres header',
        readOnly: true,
        value: 'Litres (L)'
      }], // header
      [{ // line 1
        className: 'text',
        readOnly: true,
        value: 'Volume of gasoline class non-renewable fuel supplied'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 1 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of gasoline class non-renewable Part 2 fuel supplied for the compliance period as reported in Schedule B and Schedule C. For example, petroleum-based gasoline."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 1
      [{ // line 2
        className: 'text',
        readOnly: true,
        value: 'Volume of gasoline class renewable fuel supplied'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 2 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of renewable fuel in the gasoline fuel class for the compliance period as reported in Schedule B.  This is the sum of all renewable fuel that was imported, manufactured, or acquired under an agreement described in section 6 of the Regulation, and then sold or used."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 2
      [{ // line 3
        className: 'text',
        readOnly: true,
        value: 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 3 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of fuel supplied in the gasoline fuel class in the compliance period.  It is the sum of Line 1 + Line 2."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 3
      [{ // line 4
        className: 'text',
        readOnly: true,
        value: 'Volume of Part 2 gasoline class renewable fuel required (5% of Line 3)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 4 '}
            <Tooltip
              className="info"
              show
              title="This line displays the volume of renewable fuel that is required in the gasoline fuel class and amounts to 5% of the total fuel volume reported."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 4
      [{ // line 5
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received ' +
               'from other suppliers as reported in Schedule A'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 5 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net volume of gasoline class renewable fuel notionally transferred to and received from other suppliers under section 5 (1) of the *Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act*, as reported in Schedule A."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 5
      [{ // line 6
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 4)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 6 '}
            <Tooltip
              className="info"
              show
              title="If you exceed your renewable fuel obligation for the compliance period, under section 5 (3) (a) of the Act you may retain records of surplus volumes for up to 5% of your obligations calculated in Line 4.  Report the volume of renewable fuel retained in the gasoline fuel class for the next compliance period (if applicable)."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 6
      [{ // line 7
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 7 '}
            <Tooltip
              className="info"
              show
              title="The amount of renewable class fuel retained in the previous compliance period as described under section 5 (3) (b) of the Act. This value is populated automatically based on the amount reported in Line 6 in the previous compliance period (if applicable)."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 7
      [{ // line 8
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 4)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 8 '}
            <Tooltip
              className="info"
              show
              title="If you do not meet your renewable fuel obligations for the compliance period, under section 5 (4) (a) of the Act you may defer the deficiency for up to 5% of your obligations calculated in Line 4 and add that volume to your obligation for the next compliance period.  Report the volume you are deferring to the next compliance period (if applicable)."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 8
      [{ // line 9
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation added (from Line 8 of previous compliance period)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 9 '}
            <Tooltip
              className="info"
              show
              title="The amount of renewable class fuel deferred from the previous compliance period as described under section 5 (4) (b) of the Act. This value is populated automatically based on the amount reported in Line 8 in the previous compliance period (if applicable)."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...numericInput,
        readOnly,
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '30',
          step: '1'
        }
      }], // line 9
      [{ // line 10
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable Part 2 gasoline class fuel supplied ' +
               '(Total of Line 2 + Line 5 - Line 6 + Line 7 + Line 8 - Line 9)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 10 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net volume of renewable fuel supplied in the gasoline fuel class for this compliance period."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 10
      [{ // line 11
        className: 'text total',
        readOnly: true,
        value: 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L'
      }, {
        className: 'line total',
        readOnly: true,
        value: (
          <div>
            {'Line 11 '}
            <Tooltip
              className="info"
              show
              title="This line displays the Part 2 penalty payable if the volume of renewable fuel supplied does not meet the required volume for the gasoline class, as informed by the information provided in this compliance report. The penalty displayed in this line is calculated at a rate of $0.30 per litre."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, {
        ...totalViewer,
        className: 'total numeric'
      }]
    ]
  }
}


export default ScheduleSummaryGasoline
