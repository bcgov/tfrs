/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import Input from './components/Input';
import Select from './components/Select';
import {calculateCredit, getSelectedFuel} from './components/ScheduleFunctions';
import SchedulesPage from './components/SchedulesPage';
import {SCHEDULE_B} from '../constants/schedules/scheduleColumns';
import {formatNumeric} from '../utils/functions';
import ScheduleBGHGeniusProvisionModal from "./components/ScheduleBGHGeniusProvisionModal";
import ComplianceReportingService from './services/ComplianceReportingService';

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

  static calculateEnergyContent(currentRow) {
    const row = currentRow;
    const energyDensity = row[SCHEDULE_B.ENERGY_DENSITY].value;
    const quantity = row[SCHEDULE_B.QUANTITY].value;
    let value = '';

    if (energyDensity && quantity) {
      value = Number(energyDensity) * Number(String(quantity).replace(/,/g, ''));
    }

    row[SCHEDULE_B.ENERGY_CONTENT] = {
      ...row[SCHEDULE_B.ENERGY_CONTENT],
      value
    };

    return row;
  }

  static calculateCredit(currentRow) {
    const row = currentRow;
    const carbonIntensityFuel = row[SCHEDULE_B.CARBON_INTENSITY_FUEL].value;
    const carbonIntensityLimit = row[SCHEDULE_B.CARBON_INTENSITY_LIMIT].value;
    const energyEffectivenessRatio = row[SCHEDULE_B.EER].value;
    const energyContent = row[SCHEDULE_B.ENERGY_CONTENT].value;

    // Formula (CI class x EER fuel - CI fuel) x EC fuel / 1000000
    if (carbonIntensityFuel && carbonIntensityLimit && energyContent && energyContent) {
      const rawValue = calculateCredit(
        carbonIntensityLimit,
        carbonIntensityFuel,
        energyEffectivenessRatio,
        energyContent
      );

      const credit = {
        value: 0
      };

      const debit = {
        value: 0
      };

      if (rawValue >= 0) {
        credit.value = rawValue;
      } else {
        debit.value = rawValue * -1;
      }

      row[SCHEDULE_B.CREDIT] = {
        ...row[SCHEDULE_B.CREDIT],
        value: credit.value
      };

      row[SCHEDULE_B.DEBIT] = {
        ...row[SCHEDULE_B.DEBIT],
        value: debit.value
      };
    }

    return row;
  }

  constructor(props) {
    super(props);

    this.state = {
      ...ScheduleBContainer.addHeaders(),
      showScheduleDModal: false,
      getCreditCalculationValues: []
    };

    this.rowNumber = 1;

    this.fuelCodes = [];

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleScheduleDSelection = this._handleScheduleDSelection.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);

    this.loadInitialState = this.loadInitialState.bind(this);
  }

  componentDidMount() {
    const compliancePeriodPromise = this.props.getCompliancePeriods();

    if (this.props.create || !this.props.complianceReport.scheduleB) {
      this._addRow(5);
    } else if (this.props.scheduleState.scheduleB) {
      // we already have the state. don't load it. just render it.
    } else {
      compliancePeriodPromise.then(this.loadInitialState);
    }
    this.recomputeDerivedState(this.props, this.state);

  }

  loadInitialState() {
    this.rowNumber = 1;

    let records = [];

    for (let i = 0; i < this.props.complianceReport.scheduleB.records.length; i += 1) {

      records.push({...this.props.complianceReport.scheduleB.records[i]});
      this.props.updateScheduleState({
        scheduleB: {
          records
        }
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {grid} = this.state;
    // const promises = [];

    // if (nextProps.scheduleState.scheduleB && nextProps.scheduleState.scheduleB.records) {
    //
    //   if ((grid.length - 2) < nextProps.scheduleState.scheduleB.records.length) {
    //     this._addRow(nextProps.scheduleState.scheduleB.records.length - (grid.length - 2));
    //   }
    //
    //   for (let i = 0; i < nextProps.scheduleState.scheduleB.records.length; i++) {
    //     const record = nextProps.scheduleState.scheduleB.records[i];
    //     const row = 2 + i;
    //
    //     grid[row][SCHEDULE_B.FUEL_TYPE].value = record.fuelType;
    //     grid[row][SCHEDULE_B.FUEL_CLASS].value = record.fuelClass;
    //     grid[row][SCHEDULE_B.QUANTITY].value = Number(record.quantity ? record.quantity : 0);
    //     const selectedFuel = this._getSelectedFuel(record.fuelType);
    //
    //     if (record.provisionOfTheAct) {
    //       const selectedProvision = selectedFuel.provisions.find(provision =>
    //         `${provision.provision}` === record.provisionOfTheAct);
    //
    //       grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value =
    //         `${selectedProvision.provision} - ${selectedProvision.description}`;
    //     }
    //
    //     grid[row][SCHEDULE_B.UNITS].value = (selectedFuel && selectedFuel.unitOfMeasure)
    //       ? selectedFuel.unitOfMeasure.name : '';
    //
    //     if (record.intensity !== null) {
    //       grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = record.intensity;
    //     } else {
    //       grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = '';
    //     }
    //
    //     if (record.scheduleD_sheetIndex !== null) {
    //       grid[row][SCHEDULE_B.FUEL_CODE].scheduleDIndex = record.scheduleD_sheetIndex;
    //       const fuels = ComplianceReportingService.getAvailableScheduleDFuels(this.props.complianceReport);
    //       const fuel = fuels[record.scheduleD_sheetIndex];
    //
    //       grid[row][SCHEDULE_B.FUEL_CODE].value = `Schedule D: ${fuel.fuelType} ${fuel.intensity ? formatNumeric(fuel.intensity, 2) : ''}`;
    //       grid[row][SCHEDULE_B.FUEL_CODE].scheduleDIndex = fuel.index;
    //       grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = fuel.intensity ? fuel.intensity : '';
    //     }
    //
    //     //   const promise = this._fetchCreditCalculationValues(grid[row], selectedFuel).then(() => {
    //     //     const {fuelCodes} = this._getCreditCalculationValues(selectedFuel.id);
    //     //     const selectedFuelCode = fuelCodes.find(fuelCode => fuelCode.id === record.fuelCode);
    //     //
    //     //     let value = '';
    //     //
    //     //     if (selectedFuelCode) {
    //     //       value = `${selectedFuelCode.fuelCode}${selectedFuelCode.fuelCodeVersion}.${selectedFuelCode.fuelCodeVersionMinor}`;
    //     //     }
    //     //
    //     //     grid[row][SCHEDULE_B.FUEL_CODE] = {
    //     //       ...grid[row][SCHEDULE_B.FUEL_CODE],
    //     //       readOnly: !selectedProvision.determinationType || selectedProvision.determinationType.theType !== 'Fuel Code',
    //     //       value
    //     //     };
    //     //
    //     //     grid[row] = this._getFuelCalculationValues(grid[row]);
    //     //
    //     //     grid[row] = ScheduleBContainer.calculateEnergyContent(grid[row]);
    //     //     grid[row] = ScheduleBContainer.calculateCredit(grid[row]);
    //     //   });
    //     //
    //     //   promises.push(promise);
    //     // }
    //     //
    //     //
    //
    //     this.setState({
    //       grid
    //     });
    //     // Promise.all(promises).then(() => {
    //     //   this._calculateTotal(grid);
    //     // });
    //   }
    // }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const grid = this.state.grid;
    const prevGrid = prevState.grid;

    if (grid.length !== prevGrid.length) {
      this.recomputeDerivedState(this.props, this.state);
      return;
    }
    for (let i = 2; i < grid.length; i++) {
      let row = grid[i];
      let prevRow = prevGrid[i];
      if (row[SCHEDULE_B.FUEL_TYPE].value !== prevRow[SCHEDULE_B.FUEL_TYPE].value ||
        row[SCHEDULE_B.FUEL_CLASS].value !== prevRow[SCHEDULE_B.FUEL_CLASS].value ||
        row[SCHEDULE_B.FUEL_CODE].value !== prevRow[SCHEDULE_B.FUEL_CODE].value ||
        row[SCHEDULE_B.PROVISION_OF_THE_ACT].value !== prevRow[SCHEDULE_B.PROVISION_OF_THE_ACT].value) {
        this.recomputeDerivedState(this.props, this.state);
      }
    }

  }

  recomputeDerivedState(props, state) {
    let {grid} = state;

    for (let i = 2; i < grid.length; i++) {
      const row = i;

      const context = {
        compliancePeriod: props.period
      };

      const values = {
        customIntensity: grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value,
        quantity: grid[row][SCHEDULE_B.QUANTITY].value,
        fuelClass: grid[row][SCHEDULE_B.FUEL_CLASS].value,
        fuelType: grid[row][SCHEDULE_B.FUEL_TYPE].value,
        provisionOfTheAct: grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value
      };

      ComplianceReportingService.computeCredits(context, values).then((response) => {

        grid[row][SCHEDULE_B.CREDIT].value = response.outputs.credits;
        grid[row][SCHEDULE_B.DEBIT].value = response.outputs.debits;

        grid[row][SCHEDULE_B.FUEL_CLASS].getOptions = () => (response.parameters.fuelClasses);
        grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].getOptions = () => (response.parameters.provisions);
        grid[row][SCHEDULE_B.FUEL_CODE].getOptions = () => (response.parameters.fuelCodes);

        grid[row][SCHEDULE_B.UNITS].value = response.parameters.unitOfMeasure.name;


        this.setState({
          grid
        });
      }, (failure) => {
        console.log(failure);
      });
    }
  }

  _addRow(numberOfRows = 1) {
    const {grid} = this.state;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{ // id
        readOnly: true,
        value: this.rowNumber
      }, { // fuel type
        className: 'text',
        dataEditor: Select,
        getOptions: () => this.props.referenceData.approvedFuels,
        mapping: {
          key: 'id',
          value: 'name'
        }
      }, { // fuel class
        className: 'text',
        dataEditor: Select,
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, { // provision of the act
        className: 'text',
        dataEditor: Select,
        getOptions: () => [],
        mapping: {
          key: 'id',
          value: 'description'
        }
      }, { // fuel code
        className: 'text',
        dataEditor: Select,
        getOptions: this._getFuelCodes,
        mapping: {
          key: 'id',
          value: 'value'
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

  _handleScheduleDSelection(row, fuel) {
    const grid = this.state.grid.map(row => [...row]);
    grid[row][SCHEDULE_B.FUEL_CODE].value = `Schedule D: ${fuel.fuelType} ${fuel.intensity ? formatNumeric(fuel.intensity, 2) : ''}`;
    grid[row][SCHEDULE_B.FUEL_CODE].scheduleDIndex = fuel.index;
    grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = fuel.intensity ? fuel.intensity : '';

    this.setState({
      grid
    });
    this._gridStateToPayload({grid});
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


      // if (col === SCHEDULE_B.PROVISION_OF_THE_ACT) {
      //   grid[row] = this._validateProvisionColumn(grid[row], value);
      //   if (value === 'Section 6 (5) (d) (ii) (A) - GHGenius modelled') {
      //     this.setState({
      //       showScheduleDModal: true,
      //       scheduleDModalRow: row,
      //       availableScheduleDFuels: ComplianceReportingService.getAvailableScheduleDFuels(this.props.complianceReport),
      //       scheduleDModalFuelClass: grid[row][SCHEDULE_B.FUEL_CLASS].value,
      //       scheduleDModalFuelType: grid[row][SCHEDULE_B.FUEL_TYPE].value
      //     });
      //
      //   }
      // }

      if (col === SCHEDULE_B.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: value.replace(/,/g, '')
        };
      }
    });

    this.setState({
      grid
    });

    this._gridStateToPayload({
      grid
    });

    this._calculateTotal(grid);
  }

  _gridStateToPayload(state) {
    const startingRow = 2;

    const records = [];

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i];

      const {value} = row[SCHEDULE_B.PROVISION_OF_THE_ACT];
      const fuelType = row[SCHEDULE_B.FUEL_TYPE].value;
      // const selectedFuel = this._getSelectedFuel(fuelType);
      // const selectedProvision = selectedFuel ? ScheduleBContainer.getSelectedProvision(
      //   selectedFuel,
      //   value
      // ) : null;
      //
      // let selectedFuelCode = null;
      //
      // if (selectedProvision && selectedProvision.determinationType.theType === 'Fuel Code') {
      //   const {fuelCodes} = this._getCreditCalculationValues(selectedFuel.id);
      //   const fuelCode = row[SCHEDULE_B.FUEL_CODE].value;
      //
      //   selectedFuelCode = ScheduleBContainer.getFuelCode(fuelCodes, fuelCode);
      // }
      //
      // let scheduleDIndex = null;
      // if (selectedProvision && selectedProvision.determinationType.theType === 'GHGenius') {
      //   scheduleDIndex = row[SCHEDULE_B.FUEL_CODE].scheduleDIndex;
      // }

      let intensity = null;
      // if (selectedProvision && selectedProvision.determinationType.theType === 'Alternative') {
      //   intensity = row[SCHEDULE_B.CARBON_INTENSITY_FUEL].value;
      // }

      const record = {
        fuelCode: null,//selectedFuelCode ? selectedFuelCode.id : null,
        fuelType: row[SCHEDULE_B.FUEL_TYPE].value,
        fuelClass: row[SCHEDULE_B.FUEL_CLASS].value,
        provisionOfTheAct: null,//selectedProvision ? selectedProvision.provision : null,
        quantity: row[SCHEDULE_B.QUANTITY].value,
        intensity: intensity,
        scheduleD_sheetIndex: null//scheduleDIndex
      };

      const rowIsEmpty = !(record.fuelType || record.fuelClass ||
        record.provisionOfTheAct || record.quantity);

      if (!rowIsEmpty) {
        records.push(record);
      }
    }

    this.props.updateScheduleState({
      scheduleB: {
        records
      }
    });
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
      (this.state.showScheduleDModal &&
        <ScheduleBGHGeniusProvisionModal
          key='ghgenius-selection'
          matchFuelClass={this.state.scheduleDModalFuelClass}
          matchFuelType={this.state.scheduleDModalFuelType}
          availableSelections={this.state.availableScheduleDFuels}
          handleSelection={(fuel) => this._handleScheduleDSelection(this.state.scheduleDModalRow, fuel)}
          handleCancel={() => this.setState({showScheduleDModal: false})}
        />)
    ]);
  }
}

ScheduleBContainer.defaultProps = {
  complianceReport: null,
};

ScheduleBContainer.propTypes = {
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
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  complianceReport: PropTypes.shape({
    scheduleB: PropTypes.shape()
  }),
  create: PropTypes.bool.isRequired,
  getCompliancePeriods: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  period: PropTypes.string.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  compliancePeriods: state.rootReducer.compliancePeriods.items,
  creditCalculation: {
    isFetching: state.rootReducer.creditCalculation.isFetching,
    item: state.rootReducer.creditCalculation.item,
    success: state.rootReducer.creditCalculation.success
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = dispatch => ({
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBContainer);
