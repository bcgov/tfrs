/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fuelClasses } from '../actions/fuelClasses';
import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import Input from './components/Input';
import Select from './components/Select';
import SchedulesPage from './components/SchedulesPage';
import ScheduleTabs from './components/ScheduleTabs';
import { getQuantity } from '../utils/functions';
import { SCHEDULE_B } from '../constants/schedules/scheduleColumns';

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
          className: 'density',
          readOnly: true,
          value: 'EER'
        }, {
          className: 'density',
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

  constructor (props) {
    super(props);

    this.state = ScheduleBContainer.addHeaders();
    this.rowNumber = 1;

    if (document.location.pathname.indexOf('/edit/') >= 0) {
      this.edit = true;
    } else {
      this.edit = false;
    }

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._getFuelClasses = this._getFuelClasses.bind(this);
    this._getProvisions = this._getProvisions.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._validateFuelClassColumn = this._validateFuelClassColumn.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
  }

  componentDidMount () {
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
        className: 'text'
      }, { // quantity of fuel supplied
        attributes: {
          dataNumberToFixed: 2,
          maxLength: '12',
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
        readOnly: true
      }, { // carbon intensity of fuel
        readOnly: true
      }, { // energy density
        readOnly: true
      }, { // EER
        readOnly: true
      }, { // energy content
        readOnly: true
      }, { // credit
        readOnly: true
      }, { // debit
        readOnly: true
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

    for (let x = 1; x < grid.length; x += 1) {
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

  _getFuelClasses (row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
    }

    return [];
  }

  _getProvisions (row) {
    const fuelType = this.state.grid[row][SCHEDULE_B.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.provisions;
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

      if (col === SCHEDULE_B.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: getQuantity(value)
        };
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

    row[SCHEDULE_B.FUEL_CLASS] = { // if fuel type is updated, reset fuel class
      ...row[SCHEDULE_B.FUEL_CLASS],
      value: ''
    };

    row[SCHEDULE_B.PROVISION_OF_THE_ACT] = { // also reset the provision of the act
      ...row[SCHEDULE_B.PROVISION_OF_THE_ACT],
      value: ''
    };

    row[SCHEDULE_B.UNITS] = { // automatically load the unit of measure for this fuel type
      ...row[SCHEDULE_B.UNITS],
      value: (selectedFuel && selectedFuel.unitOfMeasure) ? selectedFuel.unitOfMeasure.name : ''
    };

    return row;
  }

  render () {
    if (!this.props.referenceData ||
    !this.props.referenceData.approvedFuels) {
      return <Loading />;
    }

    const { id } = this.props.match.params;
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return ([
      <ScheduleTabs
        active="schedule-b"
        compliancePeriod={period}
        edit={this.edit}
        id={id}
        key="nav"
      />,
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        edit={this.edit}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        scheduleType="schedule-b"
        title="Schedule B - Part 3 Fuel Supply"
        totals={this.state.totals}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this schedule?
      </Modal>
    ]);
  }
}

ScheduleBContainer.defaultProps = {
};

ScheduleBContainer.propTypes = {
  fuelClasses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loadFuelClasses: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string
    }).isRequired
  }).isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

const mapStateToProps = state => ({
  fuelClasses: {
    isFetching: state.rootReducer.fuelClasses.isFinding,
    items: state.rootReducer.fuelClasses.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
  loadFuelClasses: fuelClasses.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBContainer);
