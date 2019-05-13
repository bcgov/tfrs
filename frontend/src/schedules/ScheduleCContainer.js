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

class ScheduleCContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          className: 'no-top-border',
          colSpan: 4,
          readOnly: true,
          value: 'FUEL IDENTIFICATION AND QUANTITY'
        }, {
          className: 'no-top-border',
          readOnly: true,
          rowSpan: 2,
          value: 'Expected Use'
        }, {
          className: 'no-top-border',
          readOnly: true,
          rowSpan: 2,
          value: 'If other, write in expected use:'
        }], // header
        [{
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
      ]
    };
  }

  constructor (props) {
    super(props);

    this.state = ScheduleCContainer.addHeaders();

    this._addRow = this._addRow.bind(this);
    this._getExpectedUse = this._getExpectedUse.bind(this);
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
          readOnly: true
        }
      ]);
    }

    this.setState({
      grid
    });
  }

  _getFuelClasses (row) {
    const fuelType = this.state.grid[row][0];

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

      if (col === 0) { // Fuel Type
        grid[row] = this._validateFuelTypeColumn(grid[row], value);
      }

      if (col === 1) { // Fuel Class
        grid[row] = this._validateFuelClassColumn(grid[row], value);
      }

      if (col === 2) { // Quantity and Fuel Supplied
        if (Number.isNaN(Number(value))) {
          grid[row][2] = {
            ...grid[row][2],
            value: ''
          };
        }
      }

      if (col === 4) { // Expected Use
        if (value === 'Other') {
          grid[row][5].readOnly = false;
        } else {
          grid[row][5].readOnly = true;
        }
      }

      this.setState({
        grid
      });
    });
  }

  _handleSubmit () {
    console.log(this.state.grid);
    debugger;
  }

  _validateFuelClassColumn (currentRow, value) {
    const row = currentRow;
    const fuelType = currentRow[0];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (!selectedFuel ||
      selectedFuel.fuelClasses.findIndex(fuelClass => fuelClass.fuelClass === value) < 0) {
      row[1] = {
        ...row[1],
        value: ''
      };
    }

    return row;
  }

  _validateFuelTypeColumn (currentRow, value) {
    const row = currentRow;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel => fuel.name === value);

    if (!selectedFuel) {
      row[0] = {
        value: ''
      };
    }

    row[1] = { // if fuel type is updated, reset fuel class
      ...row[1],
      value: ''
    };

    row[3] = { // automatically load the unit of measure for this fuel type
      ...row[3],
      value: (selectedFuel && selectedFuel.unitOfMeasure) ? selectedFuel.unitOfMeasure.name : ''
    };

    return row;
  }

  render () {
    if (!this.props.referenceData ||
    !this.props.referenceData.approvedFuels) {
      return <Loading />;
    }

    return ([
      <ScheduleTabs
        active="schedule-c"
        key="nav"
      />,
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        title="Schedules"
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
