/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Input from '../app/components/Spreadsheet/Input';
import Select from '../app/components/Spreadsheet/Select';
import SchedulesPage from './components/SchedulesPage';
import {SCHEDULE_B} from '../constants/schedules/scheduleColumns';
import {formatNumeric} from '../utils/functions';
import ComplianceReportingService from './services/ComplianceReportingService';
import Modal from "../app/components/Modal";

class ScheduleBContainer extends Component {
  static addHeaders() {
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
          value: 'CREDIT/DEBIT CALCULATION'
        }],
        [{
          className: 'row-number',
          readOnly: true
        }, {
          className: 'fuel-type',
          readOnly: true,
          value: 'Fuel Type'
        }, {
          className: 'fuel-class',
          readOnly: true,
          value: 'Fuel Class'
        }, {
          className: 'provision',
          readOnly: true,
          value: 'Provision of the Act Relied Upon to Determine Carbon Intensity'
        }, {
          className: 'fuel-code',
          readOnly: true,
          value: 'Fuel Code (if applicable)'
        }, {
          className: 'quantity',
          readOnly: true,
          value: 'Quantity of Fuel Supplied'
        }, {
          className: 'units',
          readOnly: true,
          value: 'Units'
        }, {
          className: 'density',
          readOnly: true,
          value: <div>Carbon Intensity Limit<br/>(gCO₂e/MJ)</div>
        }, {
          className: 'density',
          readOnly: true,
          value: <div>Carbon Intensity of Fuel<br/>(gCO₂e/MJ)</div>
        }, {
          className: 'density',
          readOnly: true,
          value: 'Energy Density'
        }, {
          className: 'energy-effectiveness-ratio',
          readOnly: true,
          value: 'EER'
        }, {
          className: 'energy-content',
          readOnly: true,
          value: <div>Energy Content (MJ)</div>
        }, {
          className: 'credit',
          readOnly: true,
          value: 'Credit'
        }, {
          className: 'debit',
          readOnly: true,
          value: 'Debit'
        }]
      ],
      totals: {
        credit: 0,
        debit: 0
      }
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      ...ScheduleBContainer.addHeaders(),
      warningModal: {
        fuelType: '',
        fuelClass: ''
      }
    };

    this.rowNumber = 1;

    this.fuelCodes = [];

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);

    this.loadInitialState = this.loadInitialState.bind(this);
  }

  componentDidMount() {
    if (this.props.scheduleState.scheduleB) {
      // we already have the state. don't load it. just render it.
      this.componentWillReceiveProps(this.props);
    } else if (!this.props.complianceReport.scheduleB) {
      this._addRow(5);
    } else {
      this.loadInitialState();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {grid} = this.state;

    if (!nextProps.scheduleState.scheduleB || !nextProps.scheduleState.scheduleB.records) {
      return;
    }

    if ((grid.length - 2) < nextProps.scheduleState.scheduleB.records.length) {
      this._addRow(nextProps.scheduleState.scheduleB.records.length - (grid.length - 2));
    }

    for (let i = 0; i < nextProps.scheduleState.scheduleB.records.length; i += 1) {
      const record = nextProps.scheduleState.scheduleB.records[i];
      const row = 2 + i;

      grid[row][SCHEDULE_B.FUEL_TYPE].value = record.fuelType;
      grid[row][SCHEDULE_B.FUEL_CLASS].value = record.fuelClass;
      if (record.fuelCode != null) {
        grid[row][SCHEDULE_B.FUEL_CODE].value = record.fuelCode;
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'fuelCode';
      } else if (record.scheduleD_sheetIndex != null) {
        grid[row][SCHEDULE_B.FUEL_CODE].value = record.scheduleD_sheetIndex;
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'scheduleD';
      } else {
        grid[row][SCHEDULE_B.FUEL_CODE].mode = null;
      }

      grid[row][SCHEDULE_B.QUANTITY].value = Number(record.quantity ? record.quantity : 0);
      if (record.intensity !== null) {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = record.intensity;
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue = record.intensity;
      }

      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = record.provisionOfTheAct;
    }
    this.recomputeDerivedState(nextProps, {
      ...this.state,
      grid
    });
  }

  loadInitialState() {
    this.rowNumber = 1;

    const records = [];
    for (let i = 0; i < this.props.complianceReport.scheduleB.records.length; i += 1) {
      records.push({...this.props.complianceReport.scheduleB.records[i]});
      this.props.updateScheduleState({
        scheduleB: {
          records
        }
      });
    }
  }

  recomputeDerivedState(props, state) {
    const {grid} = state;

    for (let i = 2; i < grid.length; i += 1) {
      const row = i;

      const context = {
        compliancePeriod: props.period,
        availableScheduleDFuels: ComplianceReportingService.getAvailableScheduleDFuels(
          props.complianceReport,
          props.scheduleState
        )
      };

      const values = {
        customIntensity: grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value,
        quantity: grid[row][SCHEDULE_B.QUANTITY].value,
        fuelClass: grid[row][SCHEDULE_B.FUEL_CLASS].value,
        fuelCode: grid[row][SCHEDULE_B.FUEL_CODE].value,
        fuelType: grid[row][SCHEDULE_B.FUEL_TYPE].value,
        provisionOfTheAct: grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value
      };

      const response = ComplianceReportingService.computeCredits(context, values);

      grid[row][SCHEDULE_B.FUEL_CLASS].getOptions = () => (response.parameters.fuelClasses);
      if (response.parameters.singleFuelClassAvailable) {
        grid[row][SCHEDULE_B.FUEL_CLASS].value = response.inputs.fuelClass;
        grid[row][SCHEDULE_B.FUEL_CLASS].readOnly = true;
      } else {
        grid[row][SCHEDULE_B.FUEL_CLASS].readOnly = false;
      }

      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].getOptions = () =>
        (response.parameters.provisions);
      grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].selectedProvision =
        response.outputs.selectedProvision;

      if (response.parameters.singleProvisionAvailable) {
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = response.inputs.provisionOfTheAct;
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].readOnly = true;
      } else {
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].readOnly = false;
      }

      if (response.parameters.fuelCodeSelectionRequired) {
        grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () => (response.parameters.fuelCodes);
        grid[row][SCHEDULE_B.FUEL_CODE].readOnly = false;
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'fuelCode';
      } else if (response.parameters.scheduleDSelectionRequired) {
        grid[row][SCHEDULE_B.FUEL_CODE].mode = 'scheduleD';
        if (response.parameters.scheduleDSelections.length > 0) {
          grid[row][SCHEDULE_B.FUEL_CODE].readOnly = false;
          grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () =>
            (response.parameters.scheduleDSelections);
          grid[row][SCHEDULE_B.FUEL_CODE].dataEditor = Select;
          grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (props) => {
            const selectedOption = props.cell.getOptions().find(e =>
              String(e.id) === String(props.value));
            if (selectedOption) {
              return <span>{selectedOption.descriptiveName}</span>;
            }
            return <span>{props.value}</span>;
          }

        } else {
          grid[row][SCHEDULE_B.FUEL_CODE].readOnly = true;

          grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (props) => {
            return <a onClick={() => {
              this.setState({
                warningModal: {
                  fuelType: response.inputs.fuelType,
                  fuelClass: response.inputs.fuelClass
                }
              });
            }
            } data-toggle='modal' data-target='#GHGeniusWarning'>Not Found</a>;
          }

        }
      } else {
        grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () => [];
        grid[row][SCHEDULE_B.FUEL_CODE].readOnly = true;
        grid[row][SCHEDULE_B.FUEL_CODE].mode = null;
        grid[row][SCHEDULE_B.FUEL_CODE].dataEditor = Select;
        grid[row][SCHEDULE_B.FUEL_CODE].valueViewer = (props) => {
          const selectedOption = props.cell.getOptions().find(e =>
            String(e.id) === String(props.value));
          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>;
          }
          return <span>{props.value}</span>;
        }
      }

      grid[row][SCHEDULE_B.UNITS].value = response.parameters.unitOfMeasure.name;

      grid[row][SCHEDULE_B.CARBON_INTENSITY_LIMIT].value = response.outputs.carbonIntensityLimit;
      grid[row][SCHEDULE_B.ENERGY_DENSITY].value = response.outputs.energyDensity;
      grid[row][SCHEDULE_B.EER].value = response.outputs.energyEffectivenessRatio;

      if (response.parameters.intensityInputRequired) {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = response.inputs.customIntensity;
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].readOnly = false;
      } else {
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = response.outputs.carbonIntensityFuel;
        grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].readOnly = true;
      }
      grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue =
        response.outputs.customIntensityValue;

      grid[row][SCHEDULE_B.ENERGY_CONTENT].value = response.outputs.energyContent;
      grid[row][SCHEDULE_B.CREDIT].value = response.outputs.credits;
      grid[row][SCHEDULE_B.DEBIT].value = response.outputs.debits;
    }
    this.setState({
      grid
    });

    this._gridStateToPayload({
      grid
    });

    this._calculateTotal(grid);
  }

  _addRow(numberOfRows = 1) {
    const {grid} = this.state;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{ // id
        readOnly: true,
        value: this.rowNumber
      }, { // fuel type
        className: 'text dropdown-indicator',
        dataEditor: Select,
        getOptions: () => this.props.referenceData.data.approvedFuels,
        mapping: {
          key: 'id',
          value: 'name'
        }
      }, { // fuel class
        className: 'text dropdown-indicator',
        dataEditor: Select,
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, { // provision of the act
        className: 'text dropdown-indicator',
        dataEditor: Select,
        valueViewer: (props) => {
          const selectedOption = props.cell.getOptions().find(e => e.provision === props.value);
          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>;
          }
          return <span>{props.cell.value}</span>;
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
            String(e.id) === String(props.value));
          if (selectedOption) {
            return <span>{selectedOption.descriptiveName}</span>;
          }
          return <span>{props.value}</span>;
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
        dataEditor: Input,
        valueViewer: (props) => {
          const {value} = props;
          return <span>{value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
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
          const {value} = props;
          return <span>{value && value !== '-' ? formatNumeric(Number(value), 2) : value}</span>;
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
          const {value} = props;
          return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>;
        }
      }, { // credit
        className: 'number',
        readOnly: true,
        valueViewer: (props) => {
          const {value} = props;
          return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>;
        }
      }, { // debit
        className: 'number',
        readOnly: true,
        valueViewer: (props) => {
          const {value} = props;
          return <span>{value ? formatNumeric(Math.round(value), 0) : ''}</span>;
        }
      }]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
    });
  }

  _calculateTotal(grid) {
    let {totals} = this.state;
    totals = {
      credit: 0,
      debit: 0
    };

    for (let x = 2; x < grid.length; x += 1) {
      let credit = Number(grid[x][SCHEDULE_B.CREDIT].value);
      let debit = Number(grid[x][SCHEDULE_B.DEBIT].value);

      if (Number.isNaN(credit)) {
        credit = 0;
      }

      if (Number.isNaN(debit)) {
        debit = 0;
      }

      totals.credit += credit;
      totals.debit += debit;
    }

    this.setState({
      totals
    });
  }

  _handleCellsChanged(changes, addition = null) {
    const grid = this.state.grid.map(row => [...row]);

    changes.forEach((change) => {
      const {
        cell, row, col, value
      } = change;

      if (cell.component) {
        return;
      }

      grid[row][col] = {
        ...grid[row][col],
        value
      };

      if (col === SCHEDULE_B.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: value.replace(/,/g, '')
        };
      }

      if (col === SCHEDULE_B.FUEL_TYPE) {
        grid[row][SCHEDULE_B.FUEL_CLASS].value = null;
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value = null;
        grid[row][SCHEDULE_B.FUEL_CODE].value = null;
      }
    });

    this.setState({
      grid
    });

    this.recomputeDerivedState(this.props, {grid});
  }

  _gridStateToPayload(state) {
    const startingRow = 2;

    const records = [];

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i];

      const record = {
        fuelCode: row[SCHEDULE_B.FUEL_CODE].mode === 'fuelCode' ? row[SCHEDULE_B.FUEL_CODE].value : null,
        fuelType: row[SCHEDULE_B.FUEL_TYPE].value,
        fuelClass: row[SCHEDULE_B.FUEL_CLASS].value,
        provisionOfTheAct: row[SCHEDULE_B.PROVISION_OF_THE_ACT].value,
        quantity: row[SCHEDULE_B.QUANTITY].value,
        intensity: row[SCHEDULE_B.CARBON_INTENSITY_FUEL].customIntensityValue,
        scheduleD_sheetIndex: row[SCHEDULE_B.FUEL_CODE].mode === 'scheduleD' ? row[SCHEDULE_B.FUEL_CODE].value : null
      };

      const rowIsEmpty = !(record.fuelType || record.fuelClass ||
        record.provisionOfTheAct || record.quantity);

      if (!rowIsEmpty) {
        records.push(record);
      }
    }

    // check if we should update (infinite loop possible if we don't do this)
    let shouldUpdate = false;

    if (!this.props.scheduleState.scheduleB || !this.props.scheduleState.scheduleB.records) {
      shouldUpdate = true;
    } else if (this.props.scheduleState.scheduleB.records.length != records.length) {
      shouldUpdate = true;
    } else {
      const compareOn = ['fuelCode', 'fuelType', 'fuelClass', 'provisionOfTheAct', 'quantity', 'intensity', 'scheduleD_sheetIndex'];
      for (let i = 0; i < records.length; i += 1) {
        const prevRecord = this.props.scheduleState.scheduleB.records[i];
        for (const field of compareOn) {
          if (prevRecord[field] !== records[i][field]) {
            if (!(prevRecord[field] == null && typeof records[i][field] === typeof undefined)) {
              shouldUpdate = true;
              break;
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
      });
    }
  }

  render() {
    return ([
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        scheduleType="schedule-b"
        title="Schedule B - Part 3 Fuel Supply"
        totals={this.state.totals}
      />,
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
    ]);
  }
}

ScheduleBContainer.defaultProps = {
  complianceReport: null
};

ScheduleBContainer.propTypes = {
  compliancePeriods: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFetching: PropTypes.bool
  }).isRequired,
  complianceReport: PropTypes.shape({
    scheduleB: PropTypes.shape()
  }),
  // eslint-disable-next-line react/forbid-prop-types
  period: PropTypes.string.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  scheduleState: PropTypes.shape({
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  creditCalculation: {
    isFetching: state.rootReducer.creditCalculation.isFetching,
    item: state.rootReducer.creditCalculation.item,
    success: state.rootReducer.creditCalculation.success
  }
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBContainer);
