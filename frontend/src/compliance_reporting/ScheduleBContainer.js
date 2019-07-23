/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import getCreditCalculation from '../actions/creditCalculation';
import Input from './components/Input';
import Select from './components/Select';
import {
  calculateCredit,
  getCarbonIntensityLimit,
  getCreditCalculationValues,
  getEnergyEffectivenessRatio,
  getSelectedFuel
} from './components/ScheduleFunctions';
import SchedulesPage from './components/SchedulesPage';
import {SCHEDULE_B, SCHEDULE_C} from '../constants/schedules/scheduleColumns';
import {formatNumeric} from '../utils/functions';
import Modal from "../app/components/Modal";
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

  static clearCreditCalculationValues(currentRow) {
    const row = currentRow;

    row[SCHEDULE_B.CARBON_INTENSITY_LIMIT] = {
      ...row[SCHEDULE_B.CARBON_INTENSITY_LIMIT],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.CARBON_INTENSITY_FUEL] = {
      ...row[SCHEDULE_B.CARBON_INTENSITY_FUEL],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.ENERGY_DENSITY] = {
      ...row[SCHEDULE_B.ENERGY_DENSITY],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.EER] = {
      ...row[SCHEDULE_B.EER],
      readOnly: true,
      value: ''
    };
  }

  static getDefaultCarbonIntensity(row, selectedFuel, values) {
    const provision = row[SCHEDULE_B.PROVISION_OF_THE_ACT];
    const fuelCode = row[SCHEDULE_B.FUEL_CODE];

    let determinationType = {};

    if (provision.value) {
      const selectedProvision = ScheduleBContainer.getSelectedProvision(
        selectedFuel,
        provision.value
      );

      ({determinationType} = selectedProvision);
    }

    if (selectedFuel.provisions.length === 1 ||
      (determinationType.theType === 'Default Carbon Intensity')) {
      return values.defaultCarbonIntensity.toFixed(2);
    }

    if (determinationType.theType === 'Fuel Code' && fuelCode.value && fuelCode.value !== '') {
      const {fuelCodes} = values;
      const selectedFuelCode = ScheduleBContainer.getFuelCode(fuelCodes, fuelCode.value);

      return selectedFuelCode.carbonIntensity;
    }

    if (determinationType.theType === 'Alternative') {
      return '-';
    }

    return '-';
  }

  static getFuelCode(fuelCodes, value) {
    if (!fuelCodes) {
      return [];
    }

    return fuelCodes.find(code => `${code.fuelCode}${code.fuelCodeVersion}.${code.fuelCodeVersionMinor}` === value);
  }

  static getSelectedProvision(selectedFuel, value) {
    return selectedFuel.provisions.find(fuel => `${fuel.provision} - ${fuel.description}` === value);
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
    this._fetchCreditCalculationValues = this._fetchCreditCalculationValues.bind(this);
    this._getFuelClasses = this._getFuelClasses.bind(this);
    this._getFuelCodes = this._getFuelCodes.bind(this);
    this._getProvisions = this._getProvisions.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleScheduleDSelection = this._handleScheduleDSelection.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);
    this._getCreditCalculationValues = this._getCreditCalculationValues.bind(this);
    this._getFuelCalculationValues = this._getFuelCalculationValues.bind(this);
    this._validateFuelClassColumn = this._validateFuelClassColumn.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
    this._validateProvisionColumn = this._validateProvisionColumn.bind(this);
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
    const promises = [];

    if (nextProps.scheduleState.scheduleB && nextProps.scheduleState.scheduleB.records) {

      if ((grid.length - 2) < nextProps.scheduleState.scheduleB.records.length) {
        this._addRow(nextProps.scheduleState.scheduleB.records.length - (grid.length - 2));
      }

      for (let i = 0; i < nextProps.scheduleState.scheduleB.records.length; i++) {
        const record = nextProps.scheduleState.scheduleB.records[i];
        const row = 2 + i;

        grid[row][SCHEDULE_B.FUEL_TYPE].value = record.fuelType;
        grid[row][SCHEDULE_B.FUEL_CLASS].value = record.fuelClass;
        grid[row][SCHEDULE_B.QUANTITY].value = Number(record.quantity ? record.quantity : 0);
        const selectedFuel = this._getSelectedFuel(record.fuelType);

        if (record.provisionOfTheAct) {
          const selectedProvision = selectedFuel.provisions.find(provision =>
            `${provision.provision}` === record.provisionOfTheAct);

          grid[row][SCHEDULE_B.PROVISION_OF_THE_ACT].value =
            `${selectedProvision.provision} - ${selectedProvision.description}`;
        }

        grid[row][SCHEDULE_B.UNITS].value = (selectedFuel && selectedFuel.unitOfMeasure)
          ? selectedFuel.unitOfMeasure.name : '';

        if (record.intensity !== null) {
          grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = record.intensity;
        } else {
          grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = '';
        }

        if (record.scheduleD_sheetIndex !== null) {
          grid[row][SCHEDULE_B.FUEL_CODE].scheduleDIndex = record.scheduleD_sheetIndex;
          const fuels = ComplianceReportingService.getAvailableScheduleDFuels(this.props.complianceReport);
          const fuel = fuels[record.scheduleD_sheetIndex];

          grid[row][SCHEDULE_B.FUEL_CODE].value = `Schedule D: ${fuel.fuelType} ${fuel.intensity ? formatNumeric(fuel.intensity, 2) : ''}`;
          grid[row][SCHEDULE_B.FUEL_CODE].scheduleDIndex = fuel.index;
          grid[row][SCHEDULE_B.CARBON_INTENSITY_FUEL].value = fuel.intensity ? fuel.intensity : '';
        }

        //   const promise = this._fetchCreditCalculationValues(grid[row], selectedFuel).then(() => {
        //     const {fuelCodes} = this._getCreditCalculationValues(selectedFuel.id);
        //     const selectedFuelCode = fuelCodes.find(fuelCode => fuelCode.id === record.fuelCode);
        //
        //     let value = '';
        //
        //     if (selectedFuelCode) {
        //       value = `${selectedFuelCode.fuelCode}${selectedFuelCode.fuelCodeVersion}.${selectedFuelCode.fuelCodeVersionMinor}`;
        //     }
        //
        //     grid[row][SCHEDULE_B.FUEL_CODE] = {
        //       ...grid[row][SCHEDULE_B.FUEL_CODE],
        //       readOnly: !selectedProvision.determinationType || selectedProvision.determinationType.theType !== 'Fuel Code',
        //       value
        //     };
        //
        //     grid[row] = this._getFuelCalculationValues(grid[row]);
        //
        //     grid[row] = ScheduleBContainer.calculateEnergyContent(grid[row]);
        //     grid[row] = ScheduleBContainer.calculateCredit(grid[row]);
        //   });
        //
        //   promises.push(promise);
        // }
        //
        //

        this.setState({
          grid
        });
        Promise.all(promises).then(() => {
          this._calculateTotal(grid);
        });
      }
    }
  }

  static getDerivedStateFromProps(props, state) {

    if (!props.scheduleState.scheduleB) {
      return null;
    }

    let {grid} = state;

    for (let i = 0; i < props.scheduleState.scheduleB.records.length; i++) {
      const record = props.scheduleState.scheduleB.records[i];
      const row = 2 + i;
      grid[row][SCHEDULE_B.CARBON_INTENSITY_LIMIT].value = 400;
    }

    return {
      grid
    };
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
        getOptions: this._getFuelClasses,
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, { // provision of the act
        className: 'text',
        dataEditor: Select,
        getOptions: this._getProvisions,
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

  _fetchCreditCalculationValues(currentRow, selectedFuel) {
    const compliancePeriod = this.props.compliancePeriods.find(period =>
      period.description === this.props.period);

    if (!selectedFuel) {
      ScheduleBContainer.clearCreditCalculationValues(currentRow);
      return false;
    }

    return this.props.getCreditCalculation(selectedFuel.id, {
      compliance_period_id: compliancePeriod.id
    }).then(() => {
      const creditCalculation = this._getCreditCalculationValues(selectedFuel.id);

      if (!creditCalculation) {
        let {creditCalculationValues} = this.state;

        creditCalculationValues.push(this.props.creditCalculation.item);
        this.setState({
          creditCalculationValues
        });
      }

      this._getFuelCalculationValues(currentRow);
    });
  }

  _getCreditCalculationValues(id) {
    return getCreditCalculationValues(this.state.creditCalculationValues, id);
  }

  _getFuelCalculationValues(currentRow) {
    const row = currentRow;
    const fuelClass = row[SCHEDULE_B.FUEL_CLASS];
    const fuelType = row[SCHEDULE_B.FUEL_TYPE];
    const provision = row[SCHEDULE_B.PROVISION_OF_THE_ACT];

    const selectedFuel = this._getSelectedFuel(fuelType.value);
    const values = this._getCreditCalculationValues(selectedFuel.id);

    if (values) {
      row[SCHEDULE_B.CARBON_INTENSITY_LIMIT] = {
        ...row[SCHEDULE_B.CARBON_INTENSITY_LIMIT],
        value: getCarbonIntensityLimit(values, fuelClass.value)
      };

      let determinationType = {};

      if (provision.value) {
        const selectedProvision = ScheduleBContainer.getSelectedProvision(
          selectedFuel,
          provision.value
        );

        ({determinationType} = selectedProvision);
      }

      if (determinationType.theType !== 'Alternative' &&
        determinationType.theType !== 'GHGenius') {
        row[SCHEDULE_B.CARBON_INTENSITY_FUEL] = {
          ...row[SCHEDULE_B.CARBON_INTENSITY_FUEL],
          value: ScheduleBContainer.getDefaultCarbonIntensity(
            row,
            selectedFuel,
            values
          )
        };
      }

      row[SCHEDULE_B.ENERGY_DENSITY] = {
        ...row[SCHEDULE_B.ENERGY_DENSITY],
        value: values.energyDensity.toFixed(2)
      };

      const value = getEnergyEffectivenessRatio(values, fuelClass.value);

      row[SCHEDULE_B.EER] = {
        ...row[SCHEDULE_B.EER],
        value
      };
    }

    return row;
  }

  _getFuelClasses(row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this._getSelectedFuel(fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
    }

    return [];
  }

  _getFuelCodes(row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this._getSelectedFuel(fuelType.value);
    const {fuelCodes} = this._getCreditCalculationValues(selectedFuel.id);

    if (!fuelCodes) {
      return [];
    }

    return fuelCodes.map(fuelCode => ({
      id: fuelCode.id,
      value: `${fuelCode.fuelCode}${fuelCode.fuelCodeVersion}.${fuelCode.fuelCodeVersionMinor}`
    }));
  }

  _getProvisions(row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this._getSelectedFuel(fuelType.value);

    if (selectedFuel) {
      const {provisions} = selectedFuel;
      return provisions.map(provision => ({
        id: provision.id,
        description: `${provision.provision} - ${provision.description}`
      }));
    }

    return [];
  }

  _getSelectedFuel(value) {
    return getSelectedFuel(this.props.referenceData.approvedFuels, value);
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

      if (col === SCHEDULE_B.FUEL_TYPE) {
        grid[row] = this._validateFuelTypeColumn(grid[row], value);
      }

      if (col === SCHEDULE_B.FUEL_CLASS) {
        grid[row] = this._validateFuelClassColumn(grid[row], value);
      }

      if (col === SCHEDULE_B.PROVISION_OF_THE_ACT) {
        grid[row] = this._validateProvisionColumn(grid[row], value);
        if (value === 'Section 6 (5) (d) (ii) (A) - GHGenius modelled') {
          this.setState({
            showScheduleDModal: true,
            scheduleDModalRow: row,
            availableScheduleDFuels: ComplianceReportingService.getAvailableScheduleDFuels(this.props.complianceReport),
            scheduleDModalFuelClass: grid[row][SCHEDULE_B.FUEL_CLASS].value,
            scheduleDModalFuelType: grid[row][SCHEDULE_B.FUEL_TYPE].value
          });

        }
      }

      if (col === SCHEDULE_B.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: value.replace(/,/g, '')
        };
      }

      if ([
        SCHEDULE_B.FUEL_CLASS,
        SCHEDULE_B.FUEL_CODE,
        SCHEDULE_B.PROVISION_OF_THE_ACT
      ].indexOf(col) >= 0) {
        grid[row] = this._getFuelCalculationValues(grid[row]);
      }

      if ([
        SCHEDULE_B.CARBON_INTENSITY_FUEL,
        SCHEDULE_B.ENERGY_DENSITY,
        SCHEDULE_B.FUEL_CODE,
        SCHEDULE_B.QUANTITY,
        SCHEDULE_B.PROVISION_OF_THE_ACT
      ].indexOf(col) >= 0) {
        grid[row] = ScheduleBContainer.calculateEnergyContent(grid[row]);
        grid[row] = ScheduleBContainer.calculateCredit(grid[row]);
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
      const selectedFuel = this._getSelectedFuel(fuelType);
      const selectedProvision = selectedFuel ? ScheduleBContainer.getSelectedProvision(
        selectedFuel,
        value
      ) : null;

      let selectedFuelCode = null;

      if (selectedProvision && selectedProvision.determinationType.theType === 'Fuel Code') {
        const {fuelCodes} = this._getCreditCalculationValues(selectedFuel.id);
        const fuelCode = row[SCHEDULE_B.FUEL_CODE].value;

        selectedFuelCode = ScheduleBContainer.getFuelCode(fuelCodes, fuelCode);
      }

      let scheduleDIndex = null;
      if (selectedProvision && selectedProvision.determinationType.theType === 'GHGenius') {
        scheduleDIndex = row[SCHEDULE_B.FUEL_CODE].scheduleDIndex;
      }

      let intensity = null;
      if (selectedProvision && selectedProvision.determinationType.theType === 'Alternative') {
        intensity = row[SCHEDULE_B.CARBON_INTENSITY_FUEL].value;
      }

      const record = {
        fuelCode: selectedFuelCode ? selectedFuelCode.id : null,
        fuelType: row[SCHEDULE_B.FUEL_TYPE].value,
        fuelClass: row[SCHEDULE_B.FUEL_CLASS].value,
        provisionOfTheAct: selectedProvision ? selectedProvision.provision : null,
        quantity: row[SCHEDULE_B.QUANTITY].value,
        intensity: intensity,
        scheduleD_sheetIndex: scheduleDIndex
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

  _validateFuelClassColumn(currentRow, value) {
    const row = currentRow;
    const fuelType = currentRow[SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this._getSelectedFuel(fuelType.value);

    if (!selectedFuel ||
      selectedFuel.fuelClasses.findIndex(fuelClass => fuelClass.fuelClass === value) < 0) {
      row[SCHEDULE_B.FUEL_CLASS] = {
        ...row[SCHEDULE_B.FUEL_CLASS],
        value: ''
      };
    }

    return row;
  }

  _validateFuelTypeColumn(currentRow, value) {
    const row = currentRow;
    const selectedFuel = this._getSelectedFuel(value);

    if (!selectedFuel) {
      row[SCHEDULE_B.FUEL_TYPE] = {
        ...row[SCHEDULE_B.FUEL_TYPE],
        value: ''
      };
    }

    row[SCHEDULE_B.FUEL_CLASS] = { // pre-select the fuel class, if possible
      ...row[SCHEDULE_B.FUEL_CLASS],
      value: (selectedFuel && selectedFuel.fuelClasses.length === 1)
        ? selectedFuel.fuelClasses[0].fuelClass : ''
    };

    row[SCHEDULE_B.PROVISION_OF_THE_ACT] = { // pre-select the provision of the act, if possible
      ...row[SCHEDULE_B.PROVISION_OF_THE_ACT],
      value: (selectedFuel && selectedFuel.provisions.length === 1)
        ? `${selectedFuel.provisions[0].provision} - ${selectedFuel.provisions[0].description}` : ''
    };

    // reset the following columns
    row[SCHEDULE_B.CREDIT] = {
      ...row[SCHEDULE_B.CREDIT],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.DEBIT] = {
      ...row[SCHEDULE_B.DEBIT],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.FUEL_CODE] = {
      ...row[SCHEDULE_B.FUEL_CODE],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.ENERGY_CONTENT] = {
      ...row[SCHEDULE_B.ENERGY_CONTENT],
      readOnly: true,
      value: ''
    };

    row[SCHEDULE_B.UNITS] = { // automatically load the unit of measure for this fuel type
      ...row[SCHEDULE_B.UNITS],
      value: (selectedFuel && selectedFuel.unitOfMeasure) ? selectedFuel.unitOfMeasure.name : ''
    };

    this._fetchCreditCalculationValues(row, selectedFuel);

    return row;
  }

  _validateProvisionColumn(currentRow, value) {
    const row = currentRow;
    const fuelType = row[SCHEDULE_B.FUEL_TYPE].value;
    const selectedFuel = this._getSelectedFuel(fuelType);
    const selectedProvision = ScheduleBContainer.getSelectedProvision(selectedFuel, value);

    row[SCHEDULE_B.CARBON_INTENSITY_FUEL] = {
      ...row[SCHEDULE_B.CARBON_INTENSITY_FUEL],
      readOnly: !(selectedProvision && selectedProvision.determinationType.theType === 'Alternative'),
      value: ''
    };

    if (selectedProvision && selectedProvision.determinationType.theType === 'Fuel Code') {
      row[SCHEDULE_B.FUEL_CODE] = {
        ...row[SCHEDULE_B.FUEL_CODE],
        readOnly: false
      };
    } else {
      row[SCHEDULE_B.FUEL_CODE] = {
        ...row[SCHEDULE_B.FUEL_CODE],
        readOnly: true,
        value: ''
      };
    }

    return row;
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
  getCreditCalculation: PropTypes.func.isRequired,
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
