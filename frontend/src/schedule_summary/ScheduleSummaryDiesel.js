import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { numericColumn, numericInput, totalViewer } from '../compliance_reporting/components/Columns'
import Tooltip from '../app/components/Tooltip'


class ScheduleSummaryDiesel {
  constructor (readOnly = false) {
    return [
      [{
        className: 'summary-label header',
        readOnly: true,
        value: 'Diesel Class - 4% Renewable Requirement'
      }, {
        className: 'line header',
        readOnly: true,
        value: 'Line'
      }, {
        className: 'litres header',
        readOnly: true,
        value: 'Litres (L)'
      }], // header
      [{ // line 12
        className: 'text',
        readOnly: true,
        value: 'Volume of diesel class non-renewable fuel supplied'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 12 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of diesel class non-renewable Part 2 fuel supplied for the compliance period as reported in Schedule B and Schedule C. For example, petroleum-based diesel."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 12
      [{ // line 13
        className: 'text',
        readOnly: true,
        value: 'Volume of diesel class renewable fuel supplied'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 13 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of renewable fuel in the diesel fuel class for the compliance period as reported in Schedule B and Schedule C with an expected use of heating oil.  This is the sum of all renewable fuel that was imported, manufactured, or acquired under an agreement described in section 6 of the Regulation, and then sold or used."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 13
      [{ // line 14
        className: 'text',
        readOnly: true,
        value: 'Total volume of diesel class fuel supplied (Line 12 + Line 13)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 14 '}
            <Tooltip
              className="info"
              show
              title="This line displays the total volume of fuel supplied in the diesel fuel class in the compliance period.  It is the sum of Line 12 + Line 13."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 14
      [{ // line 15
        className: 'text',
        readOnly: true,
        value: 'Volume of Part 2 diesel class renewable fuel required (4% of Line 14)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 15 '}
            <Tooltip
              className="info"
              show
              title="This line displays the volume of renewable fuel that is required in the diesel fuel class and amounts to 4% of the total fuel volume reported."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 15
      [{ // line 16
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable fuel notionally transferred to and received ' +
                'from other suppliers as reported in Schedule A'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 16 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net volume of diesel class renewable fuel notionally transferred to and received from other suppliers under section 5 (1) of the *Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act*, as reported in Schedule A."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 16
      [{ // line 17
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel retained (up to 5% of Line 15)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 17 '}
            <Tooltip
              className="info"
              show
              title="If you exceed your renewable fuel obligation for the compliance period, under section 5 (3) (a) of the Act you may retain records of surplus volumes for up to 5% of your obligations calculated in Line 15.  Report the volume of renewable fuel retained in the diesel fuel class for the next compliance period (if applicable)."
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
      }], // line 17
      [{ // line 18
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable fuel previously retained (from Line 17 of previous compliance report)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 18 '}
            <Tooltip
              className="info"
              show
              title="The amount of renewable class fuel retained in the previous compliance period as described under section 5 (3) (b) of the Act. This value is populated automatically based on the amount reported in Line 17 in the previous compliance period (if applicable)."
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
          maxLength: '30',
          step: '1'
        }
      }], // line 18
      [{ // line 19
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation deferred (up to 5% of Line 15)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 19 '}
            <Tooltip
              className="info"
              show
              title="If you do not meet your renewable fuel obligations for the compliance period, under section 5 (4) (a) of the Act you may defer the deficiency for up to 5% of your obligations calculated in Line 15 and add that volume to your obligation for the next compliance period.  Report the volume you are deferring to the next compliance period (if applicable)."
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
      }], // line 19
      [{ // line 20
        className: 'text',
        readOnly: true,
        value: 'Volume of renewable obligation added (from Line 19 of previous compliance period)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 20 '}
            <Tooltip
              className="info"
              show
              title="The amount of renewable class fuel deferred from the previous compliance period as described under section 5 (4) (b) of the Act. This value is populated automatically based on the amount reported in Line 19 in the previous compliance period (if applicable)."
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
          maxLength: '30',
          step: '1'
        }
      }], // line 20
      [{ // line 21
        className: 'text',
        readOnly: true,
        value: 'Net volume of renewable Part 2 diesel class fuel supplied ' +
               '(Total of Line 13 + Line 16 - Line 17 + Line 18 + Line 19 - Line 20)'
      }, {
        className: 'line',
        readOnly: true,
        value: (
          <div>
            {'Line 21 '}
            <Tooltip
              className="info"
              show
              title="This line displays the net volume of renewable fuel supplied in the diesel fuel class for this compliance period."
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }, numericColumn], // line 21
      [{ // line 22
        className: 'text total',
        readOnly: true,
        value: 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L'
      }, {
        className: 'line total',
        readOnly: true,
        value: (
          <div>
            {'Line 22 '}
            <Tooltip
              className="info"
              show
              title="This line displays the Part 2 penalty payable if the volume of renewable fuel supplied does not meet the required volume for the diesel class, as informed by the information provided in this compliance report. The penalty displayed in this line is calculated at a rate of $0.45 per litre."
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


export default ScheduleSummaryDiesel
