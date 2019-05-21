/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { expectedUses } from '../actions/expectedUses';
import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import Input from './components/Input';
import Select from './components/Select';
import SchedulesPage from './components/SchedulesPage';
import ScheduleTabs from './components/ScheduleTabs';
import { SCHEDULE_C } from '../constants/schedules/scheduleColumns';

class ScheduleCContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          readOnly: true,
          width: 50
        }, {
          colSpan: 4,
          readOnly: true,
          value: 'FUEL IDENTIFICATION AND QUANTITY'
        }, {
          readOnly: true,
          rowSpan: 2,
          value: 'Expected Use'
        }, {
          readOnly: true,
          rowSpan: 2,
          value: 'If other, write in expected use:'
        }], // header
        [{
          readOnly: true
        }, {
          readOnly: true,
          value: 'Fuel Type'
        }, {
          readOnly: true,
          value: 'Fuel Class'
        }, {
          readOnly: true,
          value: 'Quantity of Fuel Supplied'
        }, {
          readOnly: true,
          value: 'Units'
        }]
      ],
      totals: {
        diesel: 0,
        gasoline: 0
      }
    };
  }

  constructor (props) {
    super(props);

    this.state = ScheduleCContainer.addHeaders();
    this.rowNumber = 1;

    if (document.location.pathname.indexOf('/edit/') >= 0) {
      this.edit = true;
    } else {
      this.edit = false;
    }

    this._addRow = this._addRow.bind(this);
    this._getFuelClasses = this._getFuelClasses.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._validateFuelClassColumn = this._validateFuelClassColumn.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
  }

  componentDidMount () {
    this.props.loadExpectedUses();
    this._addRow(2);
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.state;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([
        {
          readOnly: true,
          value: this.rowNumber
        }, {
          className: 'text',
          dataEditor: Select,
          getOptions: () => this.props.referenceData.approvedFuels,
          mapping: {
            key: 'id',
            value: 'name'
          }
        }, {
          className: 'text',
          dataEditor: Select,
          getOptions: this._getFuelClasses,
          mapping: {
            key: 'id',
            value: 'fuelClass'
          }
        }, {
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
        }, {
          readOnly: true
        }, {
          className: 'text',
          dataEditor: Select,
          getOptions: () => !this.props.expectedUses.isFetching && this.props.expectedUses.items,
          mapping: {
            key: 'id',
            value: 'description'
          }
        }, {
          className: 'text',
          readOnly: true
        }
      ]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
    });
  }

  _getFuelClasses (row) {
    const fuelType = this.state.grid[row][SCHEDULE_C.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
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

      if (col === SCHEDULE_C.FUEL_TYPE) { // Fuel Type
        grid[row] = this._validateFuelTypeColumn(grid[row], value);
      }

      if (col === SCHEDULE_C.FUEL_CLASS) { // Fuel Class
        grid[row] = this._validateFuelClassColumn(grid[row], value);
      }

      if (col === SCHEDULE_C.QUANTITY) { // Quantity and Fuel Supplied
        if (Number.isNaN(Number(value))) {
          grid[row][SCHEDULE_C.QUANTITY] = {
            ...grid[row][SCHEDULE_C.QUANTITY],
            value: ''
          };
        } else {
          let roundedValue = Math.round(value * 100) / 100;

          if (roundedValue < 0) {
            roundedValue *= -1;
          }

          grid[row][col] = {
            ...grid[row][col],
            value: roundedValue
          };
        }
      }

      if (col === SCHEDULE_C.EXPECTED_USE) { // Expected Use
        if (value !== 'Other') {
          grid[row][SCHEDULE_C.EXPECTED_USE_OTHER] = {
            ...grid[row][SCHEDULE_C.EXPECTED_USE_OTHER],
            readOnly: true,
            value: ''
          };
        } else {
          grid[row][SCHEDULE_C.EXPECTED_USE_OTHER] = {
            ...grid[row][SCHEDULE_C.EXPECTED_USE_OTHER],
            readOnly: false
          };
        }
      }
    });

    this.setState({
      grid
    });
  }

  _handleSubmit () {
    console.log(this.state.grid);
  }

  _validateFuelClassColumn (currentRow, value) {
    const row = currentRow;
    const fuelType = currentRow[SCHEDULE_C.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (!selectedFuel ||
      selectedFuel.fuelClasses.findIndex(fuelClass => fuelClass.fuelClass === value) < 0) {
      row[SCHEDULE_C.FUEL_CLASS] = {
        ...row[SCHEDULE_C.FUEL_CLASS],
        value: ''
      };
    }

    return row;
  }

  _validateFuelTypeColumn (currentRow, value) {
    const row = currentRow;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel => fuel.name === value);

    if (!selectedFuel) {
      row[SCHEDULE_C.FUEL_TYPE] = {
        value: ''
      };
    }

    row[SCHEDULE_C.FUEL_CLASS] = { // if fuel type is updated, reset fuel class
      ...row[SCHEDULE_C.FUEL_CLASS],
      value: ''
    };

    row[SCHEDULE_C.UNITS] = { // automatically load the unit of measure for this fuel type
      ...row[SCHEDULE_C.UNITS],
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
        active="schedule-c"
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
        title="Compliance Report - Schedule C"
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

ScheduleCContainer.defaultProps = {
};

ScheduleCContainer.propTypes = {
  expectedUses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loadExpectedUses: PropTypes.func.isRequired,
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
  expectedUses: {
    isFetching: state.rootReducer.expectedUses.isFinding,
    items: state.rootReducer.expectedUses.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
  loadExpectedUses: expectedUses.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCContainer);
