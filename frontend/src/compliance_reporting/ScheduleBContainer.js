/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import getCompliancePeriods from '../actions/compliancePeriodsActions';
import getCreditCalculation from '../actions/creditCalculation';
import Input from './components/Input';
import Select from './components/Select';
import SchedulesPage from './components/SchedulesPage';
import { SCHEDULE_B } from '../constants/schedules/scheduleColumns';
import { formatNumeric } from '../utils/functions';

class ScheduleBContainer extends Component {
  static addHeaders () {
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
          value: 'Provision of the Act relied upon to determine carbon intensity'
        }, {
          className: 'fuel-code',
          readOnly: true,
          value: 'Fuel Code or Determination Method'
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
          value: <div>Carbon Intensity Limit<br />(gCO₂e/MJ)</div>
        }, {
          className: 'density',
          readOnly: true,
          value: <div>Carbon Intensity of Fuel<br />(gCO₂e/MJ)</div>
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
          value: <div>Energy content (MJ)</div>
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

  static calculateEnergyContent (currentRow) {
    const row = currentRow;
    const energyDensity = row[SCHEDULE_B.ENERGY_DENSITY].value;
    const quantity = row[SCHEDULE_B.QUANTITY].value;
    let value = '';

    if (energyDensity && quantity) {
      value = Number(energyDensity) * Number(quantity.replace(/\D/g, ''));
    }

    row[SCHEDULE_B.ENERGY_CONTENT] = {
      ...row[SCHEDULE_B.ENERGY_CONTENT],
      value
    };

    return row;
  }

  static calculateCredit (currentRow) {
    const row = currentRow;
    const carbonIntensityFuel = row[SCHEDULE_B.CARBON_INTENSITY_FUEL].value;
    const carbonIntensityLimit = row[SCHEDULE_B.CARBON_INTENSITY_LIMIT].value;
    const energyEffectivenessRatio = row[SCHEDULE_B.EER].value;
    const energyContent = row[SCHEDULE_B.ENERGY_CONTENT].value;

    // Formula (CI class x EER fuel - CI fuel) x EC fuel / 1000000
    if (carbonIntensityFuel && carbonIntensityLimit && energyContent && energyContent) {
      let rawValue = Number(carbonIntensityLimit) * Number(energyEffectivenessRatio);
      rawValue -= Number(carbonIntensityFuel);
      rawValue *= Number(energyContent);
      rawValue /= 1000000;

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

  static getCarbonIntensityLimit (fuelClass, values) {
    if (fuelClass === 'Diesel') {
      return values.carbonIntensityLimit.diesel.toFixed(2);
    }

    if (fuelClass === 'Gasoline') {
      return values.carbonIntensityLimit.gasoline.toFixed(2);
    }

    return '-';
  }

  static getDefaultCarbonIntensity (row, selectedFuel, values) {
    const provision = row[SCHEDULE_B.PROVISION_OF_THE_ACT];
    const fuelCode = row[SCHEDULE_B.FUEL_CODE];

    let determinationType = {};

    if (provision.value) {
      const selectedProvision = selectedFuel.provisions.find(item =>
        `${item.provision} - ${item.description}` === provision.value);

      ({ determinationType } = selectedProvision);
    }

    if (selectedFuel.provisions.length === 1 ||
      (determinationType.theType === 'Default Carbon Intensity')) {
      return values.defaultCarbonIntensity.toFixed(2);
    }

    if (determinationType.theType === 'Fuel Code' && fuelCode.value !== '') {
      const { fuelCodes } = values;

      const selectedFuelCode = fuelCodes.find(code =>
        `${code.fuelCode}${code.fuelCodeVersion}.${code.fuelCodeVersionMinor}` === fuelCode.value);

      return selectedFuelCode.carbonIntensity;
    }

    if (determinationType.theType === 'Alternative') {
      return '';
    }

    return '-';
  }

  constructor (props) {
    super(props);

    this.state = ScheduleBContainer.addHeaders();
    this.rowNumber = 1;

    this.fuelCodes = [];
    this.creditCalculationValues = [];

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._fetchCreditCalculationValues = this._fetchCreditCalculationValues.bind(this);
    this._getFuelClasses = this._getFuelClasses.bind(this);
    this._getFuelCodes = this._getFuelCodes.bind(this);
    this._getProvisions = this._getProvisions.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._populateFuelCalculationValues = this._populateFuelCalculationValues.bind(this);
    this._validateFuelClassColumn = this._validateFuelClassColumn.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
    this._validateProvisionColumn = this._validateProvisionColumn.bind(this);
  }

  componentDidMount () {
    this.props.getCompliancePeriods();
    this._addRow(5);
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.state;

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
          dataNumberToFixed: 2,
          maxLength: '20',
          step: '0.01'
        },
        className: 'number',
        dataEditor: Input,
        valueViewer: (props) => {
          const { value } = props;
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
          const { value } = props;
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
          const { value } = props;
          return <span>{value ? formatNumeric(Number(value), 2) : ''}</span>;
        }
      }, { // credit
        className: 'number',
        readOnly: true,
        valueViewer: (props) => {
          const { value } = props;
          return <span>{value ? formatNumeric(Number(value), 2) : ''}</span>;
        }
      }, { // debit
        className: 'number',
        readOnly: true,
        valueViewer: (props) => {
          const { value } = props;
          return <span>{value ? formatNumeric(Number(value), 2) : ''}</span>;
        }
      }]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
    });
  }

  _calculateTotal (grid) {
    let { totals } = this.state;
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

  _fetchCreditCalculationValues (row, selectedFuel) {
    const compliancePeriod = this.props.compliancePeriods.find(period =>
      period.description === this.props.period);

    this.props.getCreditCalculation(selectedFuel.id, {
      compliance_period_id: compliancePeriod.id
    }).then(() => {
      const index = this.creditCalculationValues.findIndex(creditCalculationValue =>
        creditCalculationValue.id === selectedFuel.id);

      if (index < 0) {
        this.creditCalculationValues.push(this.props.creditCalculation.item);
      }

      this._populateFuelCalculationValues(row);
    });
  }

  _getFuelClasses (row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
    }

    return [];
  }

  _getFuelCodes (row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    const { fuelCodes } = this.creditCalculationValues.find(value => value.id === selectedFuel.id);

    return fuelCodes.map(fuelCode => ({
      id: fuelCode.id,
      value: `${fuelCode.fuelCode}${fuelCode.fuelCodeVersion}.${fuelCode.fuelCodeVersionMinor}`
    }));
  }

  _getProvisions (row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      const { provisions } = selectedFuel;
      return provisions.map(provision => ({
        id: provision.id,
        description: `${provision.provision} - ${provision.description}`
      }));
    }

    return [];
  }

  _handleCellsChanged (changes, addition = null) {
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
      }

      if ([
        SCHEDULE_B.FUEL_CLASS,
        SCHEDULE_B.FUEL_CODE,
        SCHEDULE_B.FUEL_TYPE,
        SCHEDULE_B.PROVISION_OF_THE_ACT
      ].indexOf(col) >= 0) {
        this._populateFuelCalculationValues(grid[row]);
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

    this._calculateTotal(grid);
  }

  _handleSubmit () {
    console.log(this.state.grid);
  }

  _populateFuelCalculationValues (currentRow) {
    const { grid } = this.state;
    const row = currentRow;
    const fuelClass = currentRow[SCHEDULE_B.FUEL_CLASS];
    const fuelType = currentRow[SCHEDULE_B.FUEL_TYPE];
    const provision = row[SCHEDULE_B.PROVISION_OF_THE_ACT];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    const values = this.creditCalculationValues.find(value => value.id === selectedFuel.id);

    if (values) {
      row[SCHEDULE_B.CARBON_INTENSITY_LIMIT] = {
        ...row[SCHEDULE_B.CARBON_INTENSITY_LIMIT],
        value: ScheduleBContainer.getCarbonIntensityLimit(fuelClass.value, values)
      };

      let determinationType = {};

      if (provision.value) {
        const selectedProvision = selectedFuel.provisions.find(item =>
          `${item.provision} - ${item.description}` === provision.value);

        ({ determinationType } = selectedProvision);
      }

      if (determinationType.theType !== 'Alternative') {
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

      row[SCHEDULE_B.EER] = {
        ...row[SCHEDULE_B.EER],
        value: (fuelClass.value === 'Diesel')
          ? values.energyEffectivenessRatio.diesel.toFixed(1)
          : values.energyEffectivenessRatio.gasoline.toFixed(1)
      };

      grid[row] = {
        ...grid[row],
        row
      };
    }

    this.setState({
      grid
    });
  }

  _validateFuelClassColumn (currentRow, value) {
    const row = currentRow;
    const fuelType = currentRow[SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (!selectedFuel ||
      selectedFuel.fuelClasses.findIndex(fuelClass => fuelClass.fuelClass === value) < 0) {
      row[SCHEDULE_B.FUEL_CLASS] = {
        ...row[SCHEDULE_B.FUEL_CLASS],
        value: ''
      };
    }

    return row;
  }

  _validateFuelTypeColumn (currentRow, value) {
    const row = currentRow;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel => fuel.name === value);

    if (!selectedFuel) {
      row[SCHEDULE_B.FUEL_TYPE] = {
        value: ''
      };
    }

    row[SCHEDULE_B.FUEL_CLASS] = { // pre-select the fuel class, if possible
      ...row[SCHEDULE_B.FUEL_CLASS],
      value: (selectedFuel.fuelClasses.length === 1) ? selectedFuel.fuelClasses[0].fuelClass : ''
    };

    row[SCHEDULE_B.PROVISION_OF_THE_ACT] = { // pre-select the provision of the act, if possible
      ...row[SCHEDULE_B.PROVISION_OF_THE_ACT],
      value: (selectedFuel.provisions.length === 1)
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

  _validateProvisionColumn (currentRow, value) {
    const row = currentRow;
    const fuelType = row[SCHEDULE_B.FUEL_TYPE].value;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel =>
      fuel.name === fuelType);

    const selectedProvision = selectedFuel.provisions.find(provision =>
      `${provision.provision} - ${provision.description}` === value);

    if (selectedProvision && selectedProvision.determinationType.theType === 'Alternative') {
      row[SCHEDULE_B.CARBON_INTENSITY_FUEL] = {
        ...row[SCHEDULE_B.CARBON_INTENSITY_FUEL],
        readOnly: false,
        value: ''
      };
    } else {
      row[SCHEDULE_B.CARBON_INTENSITY_FUEL] = {
        ...row[SCHEDULE_B.CARBON_INTENSITY_FUEL],
        readOnly: true,
        value: ''
      };
    }

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

  render () {
    return ([
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        edit={this.props.edit}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        scheduleType="schedule-b"
        title="Schedule B - Part 3 Fuel Supply"
        totals={this.state.totals}
        saving={this.props.saving}
      />
    ]);
  }
}

ScheduleBContainer.defaultProps = {
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
  getCompliancePeriods: PropTypes.func.isRequired,
  getCreditCalculation: PropTypes.func.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  period: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired
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
  getCompliancePeriods: bindActionCreators(getCompliancePeriods, dispatch),
  getCreditCalculation: bindActionCreators(getCreditCalculation, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBContainer);
