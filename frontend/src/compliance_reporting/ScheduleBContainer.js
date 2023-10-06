/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Modal from '../app/components/Modal'
import Input from '../app/components/Spreadsheet/Input'
import Select from '../app/components/Spreadsheet/Select'
import Tooltip from '../app/components/Tooltip'
import SchedulesPage from './components/SchedulesPage'
import { SCHEDULE_B, SCHEDULE_B_ERROR_KEYS } from '../constants/schedules/scheduleColumns'
import { formatNumeric } from '../utils/functions'
import ComplianceReportingService from './services/ComplianceReportingService'
import { COMPLIANCE_YEAR } from '../constants/values'

class ScheduleBContainer extends Component {
  static addHeaders (props) {
    let creditDebitHeaders
    if (parseInt(props.period) < COMPLIANCE_YEAR) {
      creditDebitHeaders = [
        {
          className: 'credit',
          readOnly: true,
          value: 'Credit'
        },
        {
          className: 'debit',
          readOnly: true,
          value: 'Debit'
        }
      ]
    } else {
      creditDebitHeaders = [{
        className: 'credit',
        readOnly: true,
        value: (
          <div>
            {'Compliance Units '}
            <Tooltip
              className="info"
              show
              title={`The number of compliance units to be issued is determined in accordance 
              with the formula set out in the former Act; that is, section 6 (4) of the 
              Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act.`}
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        )
      }]
    }
    return {
      grid: [
        [{
          readOnly: true
        }, {
          colSpan: 4,
          readOnly: true,
          value: 'FUEL IDENTIFICATION'
        }, {
          colSpan: 7,
          readOnly: true,
          value: 'ENERGY SUPPLIED BY FUEL CALCULATION'
        }, {
          colSpan: 2,
          readOnly: true,
          value: parseInt(props.period) < COMPLIANCE_YEAR
            ? (
            <div>
              {'CREDIT/DEBIT CALCULATION '}
              <Tooltip
                className="info left"
                show
                title={`This value will be calculated based on the information provided using the formula specified in section 6 (4) of the Act.
- Credit or Debit = (CI class x EER fuel – CI fuel) x EC fuel / 1,000,000.
- where,
> - Credit or Debit = The number of credits generated or debits incurred. This value will be displayed in the appropriate column (Credit or Debit).
> - CI class = The prescribed carbon intensity limit for the compliance period for the class of fuel of which the fuel is a part.
> - EER fuel = The prescribed energy effectiveness ratio for that fuel in that class of fuel.
> - CI fuel = The carbon intensity of the fuel.
> - EC fuel = The energy content of the fuel calculated in accordance with section 11.02 (3) of the Regulation.
\nCredits and debits are displayed as whole values; fractional values are accounted for when determining the total credits generated and/or the total debits incurred from all fuel supplied within a compliance period. Conventional rounding is used only after the total credits and total debits are calculated.`}
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
              )
            : ('')
        }],
        [{
          className: 'row-number',
          readOnly: true
        }, {
          className: 'fuel-type',
          readOnly: true,
          value: (
            <div>
              {'Fuel Type '}
              <Tooltip
                className="info"
                show
                title="Select the fuel type from the drop-down list."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'fuel-class',
          readOnly: true,
          value: (
            <div>
              {'Fuel Class '}
              <Tooltip
                className="info"
                show
                title="Select the fuel class in which the fuel was used from the drop-down list."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'provision',
          readOnly: true,
          value: (
            <div>
              {'Provision of the Act Relied Upon to Determine Carbon Intensity '}
              <Tooltip
                className="info left"
                show
                title="Act Relied Upon to Determine Carbon Intensity: Identify the appropriate provision of the Act relied upon to determine the carbon intensity of each Part 3 fuel.
- Section 6 (5) (a): The Regulation-prescribed carbon intensity for petroleum-based gasoline.
- Section 6 (5) (b): The Regulation-prescribed carbon intensity for petroleum-based diesel fuel.
- Section 6 (5) (c) - Approved fuel code: Use this method for fuels that have been assigned an approved BCLCF code. A drop-down list of appropriate fuel codes based on the selected fuel type will be provided.
- Section 6 (5) (d) (i) - Regulation default carbon intensity value: The carbon intensity of this fuel type determined in accordance with the Regulation.
- Section 6 (5) (d) (ii) (A) - Approved version of GHGenius. Users selecting this method are required to provide a record of inputs to the GHGenius model, as defined in section 11.06 (1) of the Regulation, and any additional information necessary to reproduce, using the approved GHGenius, the results submitted.
- Section 6 (5) (d) (ii) (B) - Approved alternative method: Users selecting this method are required to provide a copy of the Director's approval letter of that method and appropriate documentation of the inputs and outputs of the electronic calculation, as appropriate."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'fuel-code',
          readOnly: true,
          value: (
            <div>
              Fuel Code or Schedule D Entry<br />{'(if applicable) '}
              <Tooltip
                className="info left"
                show
                title="
- Fuel Code: If an approved fuel code is relied upon to determine carbon intensity, a drop-down list of the appropriate fuel codes based on the selected fuel type will be provided.
- Schedule D Entry: If GHGenius modelled is relied upon to determine carbon intensity, a drop-down list of the appropriate fuel(s) reported in Schedule D based on the selected fuel type and fuel class will be provided."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'quantity',
          readOnly: true,
          value: 'Quantity of Fuel Supplied'
        }, {
          className: 'units',
          readOnly: true,
          value: (
            <div>
              {'Units '}
              <Tooltip
                className="info"
                show
                title="This value will be provided based on the type of fuel reported."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'density',
          readOnly: true,
          value: (
            <div>
              Carbon Intensity Limit<br />{'(gCO₂e/MJ) '}
              <Tooltip
                className="info"
                show
                title="The prescribed carbon intensity limit for the compliance period for the class of fuel of which the fuel is a part. This value will be provided based on the fuel class reported."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'density',
          readOnly: true,
          value: (
            <div>
              Carbon Intensity of Fuel<br />{'(gCO₂e/MJ) '}
              <Tooltip
                className="info"
                show
                title="The carbon intensity of the fuel. This value will be provided based on the specific fuel and determination method reported."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'density',
          readOnly: true,
          value: (
            <div>
              {'Energy Density '}
              <Tooltip
                className="info"
                show
                title="This value will be provided based on the type of fuel reported as specified in section 11.02 (3) of the Regulation."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'energy-effectiveness-ratio',
          readOnly: true,
          value: (
            <div>
              {'EER '}
              <Tooltip
                className="info"
                show
                title="The Energy Effectiveness Ratio (EER) will be provided based on the type of fuel and fuel class reported as specified in section 11.02 (2) of the Regulation."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        }, {
          className: 'energy-content',
          readOnly: true,
          value: (
            <div>
              {'Energy Content (MJ) '}
              <Tooltip
                className="info"
                show
                title="This value will be calculated using the formula specified in section 11.02 (3) of the Regulation. The formula is Energy Content (megajoules) = Quantity of Fuel Supplied X Energy Density."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          )
        },
        ...creditDebitHeaders
        ]
      ],
      totals: {
        credit: 0,
        debit: 0
      }
    }
  }

  static clearErrorColumns (_row) {
    const row = _row

    row.forEach((cell, col) => {
      const { className } = cell
      if (className && className.indexOf('error') >= 0) {
        row[col] = {
          ...row[col],
          className: className.replace(/error/g, '')
        }
      }
    })

    const hasContent = row[SCHEDULE_B.FUEL_TYPE].value &&
      row[SCHEDULE_B.FUEL_CLASS].value &&
      row[SCHEDULE_B.PROVISION_OF_THE_ACT].value &&
      row[SCHEDULE_B.QUANTITY]

    row[SCHEDULE_B.ROW_NUMBER] = {
      ...row[SCHEDULE_B.ROW_NUMBER],
      valueViewer: data => (
        <div>
          {!hasContent && data.value}
          {hasContent &&
            <FontAwesomeIcon icon="check" />
          }
        </div>
      )
    }

    return row
  }

  static snapshotToGrid (records, _grid, year) {
    const grid = _grid
    for (let i = 0; i < records.length; i += 1) {
      const record = records[i]
      const row = i + 2
      grid[row][SCHEDULE_B.FUEL_TYPE].value = record.fuelType
      grid[row][SCHEDULE_B.FUEL_CLASS].value = record.fuelClass
      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT] = {
        ...grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT],
        value: record.provisionOfTheAct,
        valueViewer: () => (`${record.provisionOfTheAct} - ${record.provisionOfTheActDescription}`)
      }
      grid[row][SCHEDULE_B.QUANTITY].value = record.quantity
      grid[row][SCHEDULE_B.UNITS].value = record.unitOfMeasure
      grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = record.effectiveCarbonIntensity
      grid[row][SCHEDULE_B.CARBON_INTENSITY_LIMIT].value = record.ciLimit
      if (year < COMPLIANCE_YEAR) {
        grid[row][SCHEDULE_B.CREDIT].value = record.credits
        grid[row][SCHEDULE_B.DEBIT].value = record.debits
      } else {
        if (record.credit == null) {
          const creditRecord = '+'.concat(record.credits)
          const debitRecord = '-'.concat(record.debits)
          grid[row][SCHEDULE_B.CREDIT].value = record.credits != null ? creditRecord : debitRecord
        }
      }
      grid[row][SCHEDULE_B.EER].value = record.eer
      grid[row][SCHEDULE_B.ENERGY_CONTENT].value = record.energyContent
      grid[row][SCHEDULE_B.ENERGY_DENSITY].value = record.energyDensity

      if (record.fuelCode != null) {
        grid[row][SCHEDULE_B.FUEL_CODE] = {
          ...grid[row][SCHEDULE_B.FUEL_CODE],
          value: record.fuelCode,
          valueViewer: () => (record.fuelCodeDescription)
        }
      } else if (record.scheduleD_sheetIndex != null) {
        grid[row][SCHEDULE_B.FUEL_CODE].value = 'From Schedule D'
      }
    }

    return grid
  }

  constructor (props) {
    super(props)

    this.state = {
      ...ScheduleBContainer.addHeaders(props),
      warningModal: {
        fuelType: '',
        fuelClass: ''
      }
    }

    this.rowNumber = 1

    this.fuelCodes = []

    this._addRow = this._addRow.bind(this)
    this._calculateTotal = this._calculateTotal.bind(this)
    this._handleCellsChanged = this._handleCellsChanged.bind(this)
    this._gridStateToPayload = this._gridStateToPayload.bind(this)
    this._recordsToGrid = this._recordsToGrid.bind(this)
    this._validate = this._validate.bind(this)

    this.loadInitialState = this.loadInitialState.bind(this)
  }

  componentDidMount () {
    if (this.props.scheduleState.scheduleB || (this.props.snapshot && this.props.readOnly)) {
      // we already have the state. don't load it. just render it.
      this.UNSAFE_componentWillReceiveProps(this.props)
    } else if (!this.props.complianceReport.scheduleB) {
      this._addRow(5)
    } else {
      this.loadInitialState()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    let { grid } = this.state
    const year = parseInt(nextProps.complianceReport.compliancePeriod.description)
    if (nextProps.snapshot && this.props.readOnly) {
      // just use the snapshot
      let source = nextProps.snapshot.scheduleB

      if (!source && this.props.complianceReport && this.props.complianceReport.scheduleB) {
        source = this.props.complianceReport.scheduleB
      }

      if (!source || !source.records) {
        return
      }

      if ((grid.length - 2) < source.records.length) {
        this._addRow(source.records.length - (grid.length - 2))
      }
      grid = ScheduleBContainer.snapshotToGrid(source.records, grid, year)

      this._calculateTotal(grid)
    } else {
      let source = nextProps.scheduleState.scheduleB

      if (!this.props.scheduleState.scheduleB ||
        !this.props.scheduleState.scheduleB.records) {
        source = this.props.complianceReport.scheduleB
      }

      if (!source) {
        return
      }

      const { records } = source

      // in read-write mode
      if ((grid.length - 2) < records.length) {
        this._addRow(records.length - (grid.length - 2))
      }

      grid = this._recordsToGrid(records, grid)

      this.recomputeDerivedState(nextProps, {
        ...this.state,
        grid
      })
    } // end read-write prop load
  }

  loadInitialState () {
    this.rowNumber = 1

    const records = []
    for (let i = 0; i < this.props.complianceReport.scheduleB.records.length; i += 1) {
      records.push({ ...this.props.complianceReport.scheduleB.records[i] })
      this.props.updateScheduleState({
        scheduleB: {
          records
        }
      })
    }
  }

  recomputeDerivedState (props, state) {
    const { grid } = state
    for (let i = 2; i < grid.length; i += 1) {
      const row = i
      const context = {
        compliancePeriod: props.period,
        availableScheduleDFuels: ComplianceReportingService.getAvailableScheduleDFuels(
          props.complianceReport,
          props.scheduleState
        )
      }

      // Check for existing scheduleDSheetIndex from records
      let scheduleDSheetIndex = null
      const scheduleBRecords = props.complianceReport?.scheduleB?.records
      if (scheduleBRecords != null) {
        const record = scheduleBRecords[row - 2]
        scheduleDSheetIndex = record ? record.scheduleDSheetIndex : null
      }

      const values = {
        customIntensity: grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value,
        quantity: grid[row][SCHEDULE_B.QUANTITY].value,
        fuelClass: grid[row][SCHEDULE_B.FUEL_CLASS].value,
        fuelCode: grid[row][SCHEDULE_B.FUEL_CODE].value,
        fuelType: grid[row][SCHEDULE_B.FUEL_TYPE].value,
        provisionOfTheAct: grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value,
        scheduleD_sheetIndex: scheduleDSheetIndex
      }
      const response = ComplianceReportingService.computeCredits(context, values)
      grid[row][SCHEDULE_B.FUEL_TYPE] = {
        ...grid[row][SCHEDULE_B.FUEL_TYPE],
        value: response.parameters.fuelType ? response.parameters.fuelType : ''
      }

      grid[row][SCHEDULE_B.FUEL_CLASS] = {
        ...grid[row][SCHEDULE_B.FUEL_CLASS],
        getOptions: () => (response.parameters.fuelClasses),
        value: response.parameters.fuelClass ? response.parameters.fuelClass : ''
      }

      if (response.parameters.singleFuelClassAvailable) {
        grid[row][SCHEDULE_B.FUEL_CLASS] = {
          ...grid[row][SCHEDULE_B.FUEL_CLASS],
          value: response.inputs.fuelClass,
          readOnly: true
        }
      } else {
        grid[row][SCHEDULE_B.FUEL_CLASS] = {
          ...grid[row][SCHEDULE_B.FUEL_CLASS],
          readOnly: props.readOnly
        }
      }

      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT] = {
        ...grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT],
        getOptions: () => (response.parameters.provisions),
        value: response.parameters.provision
          ? response.parameters.provision.provision
          : ''
      }

      if (response.parameters.singleProvisionAvailable) {
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = response.inputs.provisionOfTheAct
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].readOnly = true
      } else {
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].readOnly = props.readOnly
      }

      if (response.parameters.fuelCodeSelectionRequired) {
        grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () => (response.parameters.fuelCodes)
        grid[row][SCHEDULE_B.FUEL_CODE].readOnly = props.readOnly
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'fuelCode'
        grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (cellProps) => {
          const selectedOption = cellProps.cell.getOptions().find(e =>
            String(e.id) === String(cellProps.value))

          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>
          }

          return <span />
        }

        // if fuel code is no longer valid while this is in draft
        // set the cell to blank so it doesn't pass an invalid value

        const selectedFuelCode = response.parameters.fuelCodes.find(fuelCode =>
          String(fuelCode.id) === String(grid[row][SCHEDULE_B.FUEL_CODE].value))

        if (!selectedFuelCode) {
          grid[row][SCHEDULE_B.FUEL_CODE].value = ''
        }
      } else if (response.parameters.scheduleDSelectionRequired) {
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'scheduleD'
        if (response.parameters.scheduleDSelections.length > 0) {
          grid[row][SCHEDULE_B.FUEL_CODE].readOnly = props.readOnly
          grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () =>
            (response.parameters.scheduleDSelections)
          grid[row][SCHEDULE_B.FUEL_CODE].dataEditor = Select
          grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (cellProps) => {
            const selectedOption = cellProps.cell.getOptions().find(e =>
              String(e.id) === String(response.parameters.scheduleD_sheetIndex))
            if (selectedOption) {
              grid[row][SCHEDULE_B.FUEL_CODE].value = selectedOption.id
              return <span>{selectedOption.descriptiveName}</span>
            }
            return <span>{cellProps.value}</span>
          }
        } else {
          grid[row][SCHEDULE_B.FUEL_CODE].readOnly = true
          grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = () => (
            <button
              className="fuel-code-not-found"
              data-toggle="modal"
              data-target="#GHGeniusWarning"
              onClick={() => {
                this.setState({
                  warningModal: {
                    fuelType: response.inputs.fuelType,
                    fuelClass: response.inputs.fuelClass
                  }
                })
              }}
              type="button"
            >
              Not Found
            </button>
          )
        }
      } else {
        grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () => []
        grid[row][SCHEDULE_B.FUEL_CODE].value = null
        grid[row][SCHEDULE_B.FUEL_CODE].readOnly = true
        grid[row][SCHEDULE_B.FUEL_CODE].mode = null
        grid[row][SCHEDULE_B.FUEL_CODE].dataEditor = Select
        grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (cellProps) => {
          const selectedOption = cellProps.cell.getOptions().find(e =>
            String(e.id) === String(cellProps.value))

          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>
          }

          return <span>{cellProps.value}</span>
        }
      }

      grid[row][SCHEDULE_B.UNITS].value = response.parameters.unitOfMeasure &&
        response.parameters.unitOfMeasure.name

      grid[row][SCHEDULE_B.CARBON_INTENSITY_LIMIT].value = response.outputs.carbonIntensityLimit
      grid[row][SCHEDULE_B.ENERGY_DENSITY].value = response.outputs.energyDensity
      grid[row][SCHEDULE_B.EER].value = response.outputs.energyEffectivenessRatio

      if (response.parameters.intensityInputRequired) {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = response.inputs.customIntensity
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].readOnly = props.readOnly
      } else {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = response.outputs.carbonIntensityFuel
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].readOnly = true
      }

      grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue =
        response.outputs.customIntensityValue

      grid[row][SCHEDULE_B.ENERGY_CONTENT].value = response.outputs.energyContent
      if (context.compliancePeriod < COMPLIANCE_YEAR) {
        grid[row][SCHEDULE_B.CREDIT].value = response.outputs.credits
        grid[row][SCHEDULE_B.DEBIT].value = response.outputs.debits
      } else {
        const complinaceUnits = response.outputs.credits - response.outputs.debits
        grid[row][SCHEDULE_B.COMPLIANCE_UNITS].value = complinaceUnits
      }

      if (!this.props.validating) {
        grid[row] = this._validate(grid[row], row - 2)
      }
    }

    this.setState({
      grid
    })

    this._gridStateToPayload({
      grid
    })

    this._calculateTotal(grid)
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.state
    const { compliancePeriod } = this.props.complianceReport

    for (let x = 0; x < numberOfRows; x += 1) {
      let creditDebitData
      if (parseInt(this.props.complianceReport.compliancePeriod.description) < COMPLIANCE_YEAR) {
        creditDebitData = [
          { // credit
            className: 'number',
            readOnly: true,
            valueViewer: (props) => {
              const { value } = props
              return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>
            }
          },
          { // debit
            className: 'number',
            readOnly: true,
            valueViewer: (props) => {
              const { value } = props
              return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>
            }
          }
        ]
      } else {
        creditDebitData = [{
          className: 'number',
          readOnly: true,
          valueViewer: (props) => {
            const { value, col } = props
            // Check if the column is credit or debit (12 for credit, 13 for debit)
            const complianceUnits = col === 12 ? (value || 0) : col === 13 ? -(value || 0) : 0
            return <span>{complianceUnits ? formatNumeric(Math.round(complianceUnits), 0) : ''}</span>
          }
        }]
      }
      grid.push([{ // id
        className: 'row-number',
        readOnly: true,
        value: this.rowNumber
      }, { // fuel type
        className: 'text dropdown-indicator',
        readOnly: this.props.readOnly,
        dataEditor: Select,
        getOptions: () => this.props.referenceData.data.approvedFuels.filter(fuelType => (fuelType.effectiveDate <= compliancePeriod.effectiveDate)),
        mapping: {
          key: 'id',
          value: 'name'
        }
      }, { // fuel class
        className: 'text dropdown-indicator',
        readOnly: this.props.readOnly,
        dataEditor: Select,
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, { // provision of the act
        className: 'text dropdown-indicator',
        readOnly: this.props.readOnly,
        dataEditor: Select,
        valueViewer: (props) => {
          const selectedOption = props.cell.getOptions().find(e => e.provision === props.value)
          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>
          }
          return <span>{props.cell.value}</span>
        },
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'provision',
          display: 'descriptiveName'
        }
      }, { // fuel code
        className: 'text dropdown-indicator',
        dataEditor: Select,
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'id',
          display: 'descriptiveName'
        },
        valueViewer: (props) => {
          const selectedOption = props.cell.getOptions().find(e =>
            String(e.id) === String(props.value))
          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>
          }
          return <span>{props.value}</span>
        },
        readOnly: true
      }, { // quantity of fuel supplied
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          step: '0.01'
        },
        className: 'number',
        readOnly: this.props.readOnly,
        dataEditor: Input,
        valueViewer: (props) => {
          const { value } = props
          return <span>{value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
        }
      }, { // units
        readOnly: true
      }, { // carbon intensity limit
        className: 'number',
        readOnly: true
      }, { // carbon intensity of fuel
        attributes: {
          allowNegative: true,
          dataNumberToFixed: 2,
          maxLength: '7',
          step: '0.01'
        },
        className: 'number',
        dataEditor: Input,
        readOnly: true,
        valueViewer: (props) => {
          const { value } = props
          return <span>{value && value !== '-' ? formatNumeric(Number(value), 2) : value}</span>
        }
      }, { // energy density
        className: 'number',
        readOnly: true
      }, { // EER
        className: 'number',
        readOnly: true
      }, { // energy content
        className: 'number',
        readOnly: true,
        valueViewer: (props) => {
          const { value } = props
          return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>
        }
      },
      ...creditDebitData
      ])
      this.rowNumber += 1
    }

    this.setState({
      grid
    })
  }

  _calculateTotal (grid) {
    let { totals } = this.state
    totals = {
      credit: 0,
      debit: 0
    }

    for (let x = 2; x < grid.length; x += 1) {
      let credit = Number(grid[x][SCHEDULE_B.CREDIT]?.value)
      let debit = Number(grid[x][SCHEDULE_B.DEBIT]?.value)

      if (Number.isNaN(credit)) {
        credit = 0
      }

      if (Number.isNaN(debit)) {
        debit = 0
      }

      totals.credit += credit
      totals.debit += debit
    }

    this.setState({
      totals
    })
  }

  _handleCellsChanged (changes, addition = null) {
    const grid = this.state.grid.map(row => [...row])

    changes.forEach((change) => {
      const {
        cell, row, col, value
      } = change

      if (cell.component) {
        return
      }

      grid[row][col] = {
        ...grid[row][col],
        value
      }

      if (col === SCHEDULE_B.QUANTITY) {
        const cleanedValue = value.replace(/,/g, '')
        grid[row][col] = {
          ...grid[row][col],
          value: Number.isNaN(Number(cleanedValue)) ? '' : cleanedValue
        }
      }

      if (col === SCHEDULE_B.FUEL_TYPE) {
        grid[row][SCHEDULE_B.FUEL_CLASS].value = null
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = null
        grid[row][SCHEDULE_B.FUEL_CODE].value = null
      }

      if (col === SCHEDULE_B.CARBON_INTENSITY_FUEL) {
        const cleanedValue = value.replace(/,/g, '')
        grid[row][col] = {
          ...grid[row][col],
          value: Number.isNaN(Number(cleanedValue)) ? '' : cleanedValue
        }
      }
    })

    this.recomputeDerivedState(this.props, { grid })
  }

  _gridStateToPayload (state) {
    const startingRow = 2

    const records = []

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i]

      const record = {
        fuelCode: row[SCHEDULE_B.FUEL_CODE].mode === 'fuelCode' ? row[SCHEDULE_B.FUEL_CODE].value : null,
        fuelType: row[SCHEDULE_B.FUEL_TYPE].value,
        fuelClass: row[SCHEDULE_B.FUEL_CLASS].value,
        provisionOfTheAct: row[SCHEDULE_B.PROVISION_OF_THE_ACT].value,
        quantity: row[SCHEDULE_B.QUANTITY].value,
        intensity: row[SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue,
        scheduleD_sheetIndex: row[SCHEDULE_B.FUEL_CODE].mode === 'scheduleD' ? row[SCHEDULE_B.FUEL_CODE].value : null
      }

      const rowIsEmpty = !(record.fuelType || record.fuelClass ||
        record.provisionOfTheAct || record.quantity)

      if (!rowIsEmpty) {
        records.push(record)
      }
    }

    // check if we should update (infinite loop possible if we don't do this)
    let shouldUpdate = false

    if (!this.props.scheduleState.scheduleB || !this.props.scheduleState.scheduleB.records) {
      shouldUpdate = true
    } else if (this.props.scheduleState.scheduleB.records.length !== records.length) {
      shouldUpdate = true
    } else {
      const compareOn = ['fuelCode', 'fuelType', 'fuelClass', 'provisionOfTheAct', 'quantity', 'intensity', 'scheduleD_sheetIndex']
      for (let i = 0; i < records.length; i += 1) {
        const prevRecord = this.props.scheduleState.scheduleB.records[i]
        // eslint-disable-next-line no-restricted-syntax
        for (const field of compareOn) {
          if (prevRecord[field] !== records[i][field]) {
            if (!(prevRecord[field] == null && typeof records[i][field] === typeof undefined)) {
              shouldUpdate = true
              break
            }
          }
        }
      }
    }

    if (shouldUpdate) {
      this.props.updateScheduleState({
        scheduleB: {
          records
        }
      })
    }
  }

  _recordsToGrid (records, _grid) {
    const grid = _grid

    for (let i = 0; i < records.length; i += 1) {
      const record = records[i]
      const row = 2 + i

      grid[row][SCHEDULE_B.FUEL_TYPE].value = record.fuelType
      grid[row][SCHEDULE_B.FUEL_CLASS].value = record.fuelClass
      if (record.fuelCode != null) {
        grid[row][SCHEDULE_B.FUEL_CODE].value = record.fuelCode
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'fuelCode'
      } else if (record.scheduleD_sheetIndex != null) {
        grid[row][SCHEDULE_B.FUEL_CODE].value = record.scheduleD_sheetIndex
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'scheduleD'
      } else {
        grid[row][SCHEDULE_B.FUEL_CODE].mode = null
      }

      grid[row][SCHEDULE_B.QUANTITY].value = Number(record.quantity ? record.quantity : 0)
      if (record.intensity !== null) {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = record.intensity
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue = record.intensity
      }

      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = record.provisionOfTheAct

      if (!this.props.validating) {
        grid[row] = this._validate(grid[row], i)
      }
    }

    // zero any remaining rows
    for (let row = records.length + 2; row < grid.length; row += 1) {
      grid[row][SCHEDULE_B.FUEL_TYPE].value = null
      grid[row][SCHEDULE_B.FUEL_CLASS].value = null
      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = null
      grid[row][SCHEDULE_B.QUANTITY].value = null
      grid[row][SCHEDULE_B.UNITS].value = null
      grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = null
      grid[row][SCHEDULE_B.CARBON_INTENSITY_LIMIT].value = null
      grid[row][SCHEDULE_B.CREDIT].value = null
      if (grid[row][SCHEDULE_B.DEBIT]) {
        grid[row][SCHEDULE_B.DEBIT].value = null
      }
      if (grid[row][SCHEDULE_B.COMPLIANCE_UNITS]) {
        grid[row][SCHEDULE_B.COMPLIANCE_UNITS].value = null
      }
      // grid[row][SCHEDULE_B.DEBIT].value = null
      grid[row][SCHEDULE_B.EER].value = null
      grid[row][SCHEDULE_B.ENERGY_CONTENT].value = null
      grid[row][SCHEDULE_B.ENERGY_DENSITY].value = null
      if (!this.props.validating) {
        grid[row] = this._validate(grid[row], row)
      }
    }

    return grid
  }

  _validate (_row, rowIndex) {
    let row = _row

    if (
      this.props.valid ||
      (this.props.validationMessages && !this.props.validationMessages.scheduleB)
    ) {
      row = ScheduleBContainer.clearErrorColumns(row)
    } else if (
      this.props.validationMessages &&
      this.props.validationMessages.scheduleB &&
      this.props.validationMessages.scheduleB.records &&
      this.props.validationMessages.scheduleB.records.length > (rowIndex)) {
      const errorCells = Object.keys(this.props.validationMessages.scheduleB.records[rowIndex])
      const errorKeys = Object.keys(SCHEDULE_B_ERROR_KEYS)

      errorKeys.forEach((errorKey) => {
        const col = SCHEDULE_B_ERROR_KEYS[errorKey]

        if (errorCells.indexOf(errorKey) < 0) {
          row[col].className = row[col].className.replace(/error/g, '')
        }
      })

      let rowNumberClassName = row[SCHEDULE_B.ROW_NUMBER].className

      if (errorCells.length === 0) {
        rowNumberClassName = rowNumberClassName.replace(/error/g, '')
      }

      row[SCHEDULE_B.ROW_NUMBER] = {
        ...row[SCHEDULE_B.ROW_NUMBER],
        className: rowNumberClassName,
        valueViewer: data => (
          <div><FontAwesomeIcon icon={(errorCells.length > 0) ? 'exclamation-triangle' : 'check'} /></div>
        )
      }

      errorCells.forEach((errorKey) => {
        if (errorKey in SCHEDULE_B_ERROR_KEYS) {
          const col = SCHEDULE_B_ERROR_KEYS[errorKey]
          let { className } = row[col]

          if (row[col].className.indexOf('error') < 0) {
            className += ' error'
          }

          row[col] = {
            ...row[col],
            className
          }
        }
      })
    } else if (
      this.props.validationMessages &&
      this.props.validationMessages.scheduleB &&
      Array.isArray(this.props.validationMessages.scheduleB)
    ) {
      row = ScheduleBContainer.clearErrorColumns(row)

      this.props.validationMessages.scheduleB.forEach((message) => {
        if (message.indexOf('Duplicate entry in row') >= 0) {
          const duplicateRowIndex = message.replace(/Duplicate entry in row /g, '')

          if (Number(rowIndex) === Number(duplicateRowIndex)) {
            let { className } = row[SCHEDULE_B.ROW_NUMBER]

            if (!className) {
              className = 'error'
            } else if (row[SCHEDULE_B.ROW_NUMBER].className.indexOf('error') < 0) {
              className += ' error'
            }

            row[SCHEDULE_B.ROW_NUMBER] = {
              ...row[SCHEDULE_B.ROW_NUMBER],
              className,
              valueViewer: data => (
                <div><FontAwesomeIcon icon="exclamation-triangle" /></div>
              )
            }
          }
        }
      })
    }

    return row
  }

  render () {
    const { grid } = this.state
    return ([
      <SchedulesPage
        addRow={this._addRow}
        addRowEnabled={!this.props.readOnly}
        complianceReport={this.props.complianceReport}
        data={grid}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        readOnly={this.props.readOnly}
        scheduleType="schedule-b"
        title="Schedule B - Part 3 Fuel Supply"
        totals={this.state.totals}
        valid={this.props.valid}
        validating={this.props.validating}
        validationMessages={this.props.validationMessages}
      >
        <p>
          Report the fuel volumes supplied for transportation. Do not include fuel volumes
          supplied for purposes other than transportation in Schedule B; please report those
          fuel quantities in Schedule C.
        </p>
      </SchedulesPage>,
      <Modal
        id="GHGeniusWarning"
        key="ghgeniusWarning"
        showConfirmButton={false}
        cancelLabel="OK"
        title="No Entry Found"
      >
        No Schedule D entry exists for {this.state.warningModal.fuelType}, {this.state.warningModal.fuelClass} class.
        Please complete a record of inputs and outputs within Schedule D of this compliance report.
      </Modal>
    ])
  }
}

ScheduleBContainer.defaultProps = {
  complianceReport: null,
  validationMessages: null,
  snapshot: null
}

ScheduleBContainer.propTypes = {
  compliancePeriods: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFetching: PropTypes.bool
  }).isRequired,
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.shape(),
    scheduleB: PropTypes.shape()
  }),
  // eslint-disable-next-line react/forbid-prop-types
  period: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    data: PropTypes.shape()
  }).isRequired,
  scheduleState: PropTypes.shape({
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  snapshot: PropTypes.shape({
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }),
  updateScheduleState: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
}

const mapStateToProps = state => ({
  creditCalculation: {
    isFetching: state.rootReducer.creditCalculation.isFetching,
    item: state.rootReducer.creditCalculation.item,
    success: state.rootReducer.creditCalculation.success
  }
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBContainer)
