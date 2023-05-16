/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'
import ValidationMessages from './components/ValidationMessages'
import getCreditCalculation from '../actions/creditCalculation'
import ScheduleSummaryDiesel from '../schedule_summary/ScheduleSummaryDiesel'
import ScheduleSummaryGasoline from '../schedule_summary/ScheduleSummaryGasoline'
import ScheduleSummaryPart3 from '../schedule_summary/ScheduleSummaryPart3'
import ScheduleSummaryPenalty from '../schedule_summary/ScheduleSummaryPenalty'
import { SCHEDULE_PENALTY, SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns'
import CallableModal from '../app/components/CallableModal'
import Loading from '../app/components/Loading'
import * as Lang from '../constants/langEnUs'
import * as DieselSummaryContainer from '../schedule_summary/DieselSummaryContainer'
import * as GasolineSummaryConatiner from '../schedule_summary/GasolineSummaryContainer'
import * as Part3SummaryContainer from '../schedule_summary/Part3SummaryContainer'
import * as PenaltySummaryContainer from '../schedule_summary/PenaltySummaryContainer'

class ScheduleSummaryContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      diesel: new ScheduleSummaryDiesel(props.readOnly),
      gasoline: new ScheduleSummaryGasoline(props.readOnly),
      part3: new ScheduleSummaryPart3(props.period),
      penalty: new ScheduleSummaryPenalty(),
      showModal: false,
      totals: {
        diesel: 0,
        gasoline: 0
      },
      alreadyUpdated: false
    }

    this.rowNumber = 1
    this._closeModal = this._closeModal.bind(this)
    this._handleCellsChanged = this._handleCellsChanged.bind(this)
    this._gridStateToPayload = this._gridStateToPayload.bind(this)
    this._calculateNonCompliancePayable = PenaltySummaryContainer._calculateNonCompliancePayable.bind(this)
    this.setStateBound = this.setState.bind(this)
  }

  componentDidMount () {
    if (this.props.complianceReport.hasSnapshot && this.props.snapshot && this.props.readOnly) {
      this.UNSAFE_componentWillReceiveProps(this.props)
    } else {
      if (this.props.complianceReport && !this.props.complianceReport.hasSnapshot) {
        this.props.recomputeRequest()
      }

      if (!this.props.scheduleState.summary) {
        this.loadInitialState()
      }
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    const { diesel, gasoline, alreadyUpdated } = this.state
    let { part3, penalty, showModal } = this.state

    // If snapshot exists then we are not in edit mode and can just return the tabledata
    if (this.props.complianceReport.hasSnapshot && nextProps.snapshot && nextProps.readOnly) {
      const { summary } = nextProps.snapshot
      GasolineSummaryConatiner.tableData(gasoline, summary)
      DieselSummaryContainer.tableData(diesel, summary)
      Part3SummaryContainer.tableData(part3, summary, this.props.complianceReport)
      PenaltySummaryContainer.tableData(penalty, summary)
      this.setState({
        diesel,
        gasoline,
        part3,
        penalty,
        showModal
      })
      return
    }

    // Wait on validating data api call
    if (nextProps.validating || !nextProps.valid) {
      return
    }

    // Recomputing calls the update serializer and recalculates all values
    if (nextProps.recomputing) {
      return
    }

    // populateSchedules initializes the important table fields for each table
    // penalty needs to go last because it uses the other 3 in its calculations
    GasolineSummaryConatiner.populateSchedules(this.props, this.state, this.setStateBound)
    DieselSummaryContainer.populateSchedules(this.props, this.state, this.setStateBound)
    Part3SummaryContainer.populateSchedules(this.props, this.state, this.setStateBound)
    PenaltySummaryContainer.populateSchedules(this.props, this.state, this.setStateBound, gasoline, diesel, part3)

    let { summary } = nextProps.complianceReport
    if (nextProps.scheduleState) {
      ({ summary } = nextProps.scheduleState)
    }
    if (!summary) {
      return
    }

    const {
      isSupplemental,
      lastAcceptedOffset
    } = this.props.complianceReport

    const updateCreditsOffsetA = false
    const skipFurtherUpdateCreditsOffsetA = false

    // Perform all line calculations for each table
    DieselSummaryContainer.lineData(diesel, summary)
    // diesel[SCHEDULE_SUMMARY.LINE_20][2].value = summary.dieselClassObligation
    GasolineSummaryConatiner.lineData(gasoline, summary)
    part3 = Part3SummaryContainer.lineData(part3, summary, this.props.complianceReport, updateCreditsOffsetA, lastAcceptedOffset, skipFurtherUpdateCreditsOffsetA, alreadyUpdated, this.props.period)
    penalty = PenaltySummaryContainer.lineData(penalty, part3, gasoline, diesel)
    penalty = this._calculateNonCompliancePayable(penalty, this.props)

    if (!isSupplemental &&
        (diesel[SCHEDULE_SUMMARY.LINE_17][2].value < summary.dieselClassRetained ||
          diesel[SCHEDULE_SUMMARY.LINE_19][2].value < summary.dieselClassDeferred ||
          gasoline[SCHEDULE_SUMMARY.LINE_6][2].value < summary.gasolineClassRetained ||
          gasoline[SCHEDULE_SUMMARY.LINE_8][2].value < summary.gasolineClassDeferred ||
          part3[SCHEDULE_SUMMARY.LINE_26][2].value < summary.creditsOffset)) {
      showModal = true

      this.props.updateScheduleState({
        summary: {
          ...summary,
          creditsOffset: part3[SCHEDULE_SUMMARY.LINE_26][2].value,
          dieselClassDeferred: diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
          dieselClassRetained: diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
          gasolineClassDeferred: gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
          gasolineClassRetained: gasoline[SCHEDULE_SUMMARY.LINE_6][2].value
        }
      })
    } else if (updateCreditsOffsetA) {
      this.props.updateScheduleState({
        summary: {
          ...summary,
          creditsOffset: part3[SCHEDULE_SUMMARY.LINE_26][2].value,
          creditsOffsetA: part3[SCHEDULE_SUMMARY.LINE_26_A][2].value
        }
      })

      this.setState({
        ...this.state,
        alreadyUpdated: true
      })
    } else if (isSupplemental &&
        (diesel[SCHEDULE_SUMMARY.LINE_17][2].value < summary.dieselClassRetained ||
          diesel[SCHEDULE_SUMMARY.LINE_19][2].value < summary.dieselClassDeferred ||
          gasoline[SCHEDULE_SUMMARY.LINE_6][2].value < summary.gasolineClassRetained ||
          gasoline[SCHEDULE_SUMMARY.LINE_8][2].value < summary.gasolineClassDeferred ||
          (part3[SCHEDULE_SUMMARY.LINE_26_B][2].value > 0 && (part3[SCHEDULE_SUMMARY.LINE_26][2].value + part3[SCHEDULE_SUMMARY.LINE_25][2].value) > 0))) {
      showModal = true

      this.props.updateScheduleState({
        summary: {
          ...summary,
          creditsOffset: part3[SCHEDULE_SUMMARY.LINE_26][2].value,
          creditsOffsetB: part3[SCHEDULE_SUMMARY.LINE_26_B][2].value,
          dieselClassDeferred: diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
          dieselClassRetained: diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
          gasolineClassDeferred: gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
          gasolineClassRetained: gasoline[SCHEDULE_SUMMARY.LINE_6][2].value
        }
      })
    } else if (isSupplemental && part3[SCHEDULE_SUMMARY.LINE_26][2].value !== summary.creditsOffset) {
      this.props.updateScheduleState({
        summary: {
          ...summary,
          creditsOffset: part3[SCHEDULE_SUMMARY.LINE_26][2].value,
          creditsOffsetA: part3[SCHEDULE_SUMMARY.LINE_26_A][2].value
        }
      })
    } else if (isSupplemental && part3[SCHEDULE_SUMMARY.LINE_26_C][2].value !== summary.creditsOffsetC) {
      this._gridStateToPayload({
        ...this.state,
        summary: {
          ...summary,
          creditsOffsetC: part3[SCHEDULE_SUMMARY.LINE_26_C][2].value
        }
      })
    }

    this.setState({
      diesel,
      gasoline,
      part3,
      penalty,
      showModal
    })
  }

  _handleCellsChanged (gridName, changes, addition = null) {
    let grid = this.state[gridName].map(row => [...row])
    let { penalty } = this.state

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

      if (gridName === 'part3' && (row === SCHEDULE_SUMMARY.LINE_26)) {
        const numericValue = Number(String(value).replace(/,/g, ''))
        grid[row][col] = {
          ...grid[row][col],
          value: numericValue
        }

        grid = Part3SummaryContainer.calculatePart3Payable(grid)

        penalty[SCHEDULE_PENALTY.LINE_28][2] = {
          ...penalty[SCHEDULE_PENALTY.LINE_28][2],
          value: grid[SCHEDULE_SUMMARY.LINE_28][2].value
        }

        penalty = this._calculateNonCompliancePayable(penalty, this.props)
      }

      if (gridName === 'part3' && (row === SCHEDULE_SUMMARY.LINE_26_B)) {
        let numericValue = Number(String(value).replace(/,/g, ''))

        const { maxValue } = grid[row][col].attributes

        if (numericValue > maxValue) {
          numericValue = maxValue
        }

        grid[row][col] = {
          ...grid[row][col],
          value: numericValue
        }

        const creditOffsetA = Number(String(grid[SCHEDULE_SUMMARY.LINE_26_A][2].value).replace(/,/g, ''))

        grid[SCHEDULE_SUMMARY.LINE_26][2].value = creditOffsetA + numericValue

        grid = Part3SummaryContainer.calculatePart3Payable(grid)

        penalty[SCHEDULE_PENALTY.LINE_28][2] = {
          ...penalty[SCHEDULE_PENALTY.LINE_28][2],
          value: grid[SCHEDULE_SUMMARY.LINE_28][2].value
        }

        penalty = this._calculateNonCompliancePayable(penalty, this.props)
      }
    })

    if (gridName === 'diesel') {
      grid[SCHEDULE_SUMMARY.LINE_21][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_21][2],
        value: DieselSummaryContainer.calculateDieselTotal(grid)
      }

      grid[SCHEDULE_SUMMARY.LINE_22][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_22][2],
        value: DieselSummaryContainer.calculateDieselPayable(grid)
      }
    }

    if (gridName === 'gasoline') {
      grid[SCHEDULE_SUMMARY.LINE_10][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_10][2],
        value: GasolineSummaryConatiner.calculateGasolineTotal(grid)
      }

      grid[SCHEDULE_SUMMARY.LINE_11][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_11][2],
        value: GasolineSummaryConatiner.calculateGasolinePayable(grid)
      }
    }

    switch (gridName) {
      case 'diesel':
        this._gridStateToPayload({
          [gridName]: grid,
          gasoline: this.state.gasoline,
          part3: this.state.part3
        })
        break
      case 'gasoline':
        this._gridStateToPayload({
          [gridName]: grid,
          diesel: this.state.diesel,
          part3: this.state.part3
        })
        break
      case 'part3':
        this._gridStateToPayload({
          [gridName]: grid,
          diesel: this.state.diesel,
          gasoline: this.state.gasoline
        })
        break
      default:
    }

    this.setState({
      [gridName]: grid,
      penalty
    })
  }

  loadInitialState () {
    if (this.props.complianceReport.summary) {
      const src = this.props.complianceReport.summary
      const initialState = {
        dieselClassDeferred: src.dieselClassDeferred,
        dieselClassObligation: src.dieselClassObligation,
        dieselClassPreviouslyRetained: src.dieselClassPreviouslyRetained,
        dieselClassRetained: src.dieselClassRetained,
        gasolineClassDeferred: src.gasolineClassDeferred,
        gasolineClassObligation: src.gasolineClassObligation,
        gasolineClassPreviouslyRetained: src.gasolineClassPreviouslyRetained,
        gasolineClassRetained: src.gasolineClassRetained,
        creditsOffset: src.creditsOffset,
        creditsOffsetA: src.creditsOffsetA,
        creditsOffsetB: src.creditsOffsetB,
        creditsOffsetC: src.creditsOffsetC
      }
      this.props.updateScheduleState({
        summary: initialState
      })
    } else {
      const initialState = {
        dieselClassDeferred: 0,
        dieselClassObligation: 0,
        dieselClassPreviouslyRetained: 0,
        dieselClassRetained: 0,
        gasolineClassDeferred: 0,
        gasolineClassObligation: 0,
        gasolineClassPreviouslyRetained: 0,
        gasolineClassRetained: 0,
        creditsOffset: 0,
        creditsOffsetA: 0,
        creditsOffsetB: 0,
        creditsOffsetC: 0
      }
      this.props.updateScheduleState({
        summary: initialState
      })
    }
  }

  _closeModal () {
    this.setState({
      ...this.state,
      showModal: false
    })
  }

  _gridStateToPayload (state) {
    let shouldUpdate = false
    const compareOn = [
      'dieselClassDeferred', 'dieselClassRetained',
      'dieselClassPreviouslyRetained', 'dieselClassObligation',
      'gasolineClassDeferred', 'gasolineClassRetained',
      'gasolineClassPreviouslyRetained', 'gasolineClassObligation',
      'creditsOffset', 'creditsOffsetA', 'creditsOffsetB', 'creditsOffsetC'
    ]

    const nextState = {
      summary: {
        dieselClassDeferred: state.diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
        dieselClassObligation: state.diesel[SCHEDULE_SUMMARY.LINE_20][2].value,
        dieselClassPreviouslyRetained: state.diesel[SCHEDULE_SUMMARY.LINE_18][2].value,
        dieselClassRetained: state.diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
        gasolineClassDeferred: state.gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
        gasolineClassObligation: state.gasoline[SCHEDULE_SUMMARY.LINE_9][2].value,
        gasolineClassPreviouslyRetained: state.gasoline[SCHEDULE_SUMMARY.LINE_7][2].value,
        gasolineClassRetained: state.gasoline[SCHEDULE_SUMMARY.LINE_6][2].value,
        creditsOffset: state.part3[SCHEDULE_SUMMARY.LINE_26][2].value,
        creditsOffsetA: state.part3[SCHEDULE_SUMMARY.LINE_26_A][2].value,
        creditsOffsetB: state.part3[SCHEDULE_SUMMARY.LINE_26_B][2].value,
        creditsOffsetC: state.part3[SCHEDULE_SUMMARY.LINE_26_C][2].value
      }
    }

    const prevState = this.props.scheduleState.summary ? this.props.scheduleState.summary : null
    if (prevState == null) {
      shouldUpdate = true
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const field of compareOn) {
        if (prevState[field] !== nextState.summary[field]) {
          if (!(prevState[field] == null && typeof nextState.summary[field] === typeof undefined)) {
            shouldUpdate = true
            break
          }
        }
      }
    }

    if (shouldUpdate) {
      this.props.updateScheduleState({
        summary: nextState.summary
      })
    }
  }

  render () {
    if (!this.props.snapshot &&
      (Object.keys(this.props.recomputedTotals).length === 0 &&
        Object.keys(this.props.validationMessages).length === 0)) {
      return (<Loading />)
    }

    if (this.props.recomputing) {
      return (<Loading />)
    }
    return (

      [<div className="schedule-summary spreadsheet-component" key=''>
      {!this.props.readOnly &&
      <ValidationMessages
        scheduleType="schedule-summary"
        valid={this.props.valid}
        validating={this.props.validating}
        validationMessages={this.props.validationMessages}
      />
      }

      <h1>Part 2 - Renewable Fuel Requirement Summary</h1>

      <div className="row">
        <div className="col-lg-6">
          <ReactDataSheet
            className="spreadsheet"
            data={this.state.gasoline}
            onCellsChanged={(changes, addition = null) => {
              this._handleCellsChanged('gasoline', changes, addition)
            }}
            valueRenderer={cell => cell.value}
          />
        </div>

        <div className="col-lg-6">
          <ReactDataSheet
            className="spreadsheet"
            data={this.state.diesel}
            onCellsChanged={(changes, addition = null) => {
              this._handleCellsChanged('diesel', changes, addition)
            }}
            valueRenderer={cell => cell.value}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <h1>Part 3 - Low Carbon Fuel Requirement Summary</h1>

          <ReactDataSheet
            className="spreadsheet"
            data={this.state.part3}
            onCellsChanged={(changes, addition = null) => {
              this._handleCellsChanged('part3', changes, addition)
            }}
            valueRenderer={cell => cell.value}
          />
        </div>

        <div className="col-lg-6">
          <h1>Part 2 and Part 3 Non-compliance Penalty Payable Summary</h1>

          <ReactDataSheet
            className="spreadsheet"
            data={this.state.penalty}
            valueRenderer={cell => cell.value}
          />
        </div>
      </div>
    </div>,

      <CallableModal
        cancelLabel={Lang.BTN_OK}
        close={() => {
          this._closeModal()
        }}
        id="warning"
        key="warning"
        show={this.state.showModal}
      >
        <p>
          The values you previously entered in the Summary &amp; Declaration tab have been cleared
          as a result of making subsequent changes within the schedules.
        </p>
        <p>
          It is recommended you complete this section after all schedules are complete.
        </p>
      </CallableModal>
      ])
  }
}

ScheduleSummaryContainer.defaultProps = {
  complianceReport: null,
  period: null,
  recomputedTotals: {},
  snapshot: null
}

ScheduleSummaryContainer.propTypes = {
  recomputedTotals: PropTypes.shape(),
  recomputeRequest: PropTypes.func.isRequired,
  recomputing: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.string
    ]),
    hasSnapshot: PropTypes.bool,
    history: PropTypes.arrayOf(PropTypes.shape()),
    lastAcceptedOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    scheduleA: PropTypes.shape(),
    scheduleB: PropTypes.shape(),
    scheduleC: PropTypes.shape(),
    summary: PropTypes.shape({
      totalPetroleumDiesel: PropTypes.number,
      totalPetroleumGasoline: PropTypes.number,
      totalRenewableDiesel: PropTypes.number,
      totalRenewableGasoline: PropTypes.number,
      dieselClassDeferred: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      dieselClassRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      dieselClassObligation: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      dieselClassPreviouslyRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassDeferred: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassObligation: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassPreviouslyRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      creditsOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      creditsOffsetA: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      creditsOffsetB: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      creditsOffsetC: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ])
    }),
    maxCreditOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    totalPreviousCreditReduction: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    totalPreviousCreditReductions: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    isSupplemental: PropTypes.bool,
    supplementalNumber: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }),
  creditCalculation: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape({
      carbonIntensityLimit: PropTypes.shape({
        diesel: PropTypes.number,
        gasoline: PropTypes.number
      }),
      defaultCarbonIntensity: PropTypes.number,
      energyDensity: PropTypes.number,
      energyEffectivenessRatio: PropTypes.shape({
        diesel: PropTypes.number,
        gasoline: PropTypes.number
      }),
      fuelCodes: PropTypes.arrayOf(PropTypes.shape({
        fuelCode: PropTypes.string,
        fuelCodeVersion: PropTypes.number,
        fuelCodeVersionMinor: PropTypes.number,
        id: PropTypes.number
      }))
    }),
    success: PropTypes.bool
  }).isRequired,
  getCreditCalculation: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  scheduleState: PropTypes.shape({
    scheduleA: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleC: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleD: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    summary: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  showPenaltyWarning: PropTypes.func.isRequired,
  snapshot: PropTypes.shape({
    scheduleA: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleC: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleD: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    summary: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }),
  updateScheduleState: PropTypes.func.isRequired,
  validationMessages: PropTypes.shape().isRequired
}

const mapStateToProps = state => ({
  creditCalculation: {
    isFetching: state.rootReducer.creditCalculation.isFetching,
    item: state.rootReducer.creditCalculation.item,
    success: state.rootReducer.creditCalculation.success
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
})

const mapDispatchToProps = dispatch => ({
  getCreditCalculation: bindActionCreators(getCreditCalculation, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSummaryContainer)
