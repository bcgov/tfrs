import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-datasheet/lib/react-datasheet.css';

import ScheduleDPage from './ScheduleDPage';
import { SCHEDULE_D, SCHEDULE_D_INPUT } from '../../constants/schedules/scheduleColumns';

class ScheduleDSheet extends Component {
  constructor (props) {
    super(props);

    this.rowNumber = 1;

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
  }

  componentDidMount () {
    this._addRow(10);
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.props.sheet;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{
        readOnly: true,
        value: this.rowNumber
      }, {
        className: 'text'
      }, {
        className: 'text'
      }, {
        className: 'text'
      }, {
        className: 'text'
      }, {
        className: 'text'
      }]);

      this.rowNumber += 1;
    }

    this.props.handleSheetChanged(grid, this.props.id);
  }

  _calculateTotal (grid) {
  }

  _handleCellsChanged (grid, changes, addition = null) {
    const input = this.props.sheet[grid].map(row => [...row]);

    changes.forEach((change) => {
      const {
        cell, row, col, value
      } = change;

      if (cell.component) {
        return;
      }

      input[row][col] = {
        ...input[row][col],
        value
      };

      if (grid === 'input' && col === SCHEDULE_D_INPUT.FUEL_TYPE) {
        input[row] = this._validateFuelTypeColumn(input[row], value);
      }
    });

    this.props.handleSheetChanged({ [grid]: input }, this.props.id);
  }

  _validateFuelTypeColumn (currentRow, value) {
    const row = currentRow;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel => fuel.name === value);

    if (!selectedFuel) {
      row[SCHEDULE_D_INPUT.FUEL_TYPE] = {
        value: ''
      };
    }

    row[SCHEDULE_D_INPUT.FUEL_CLASS] = { // pre-select the fuel class, if possible
      ...row[SCHEDULE_D_INPUT.FUEL_CLASS],
      value: (selectedFuel.fuelClasses.length === 1) ? selectedFuel.fuelClasses[0].fuelClass : ''
    };

    return row;
  }

  render () {
    return (
      <ScheduleDPage
        addRow={this._addRow}
        edit={this.props.edit}
        handleCellsChanged={this._handleCellsChanged}
        scheduleType="schedule-d"
        sheet={this.props.sheet}
      />
    );
  }
}

ScheduleDSheet.defaultProps = {
  edit: false
};

ScheduleDSheet.propTypes = {
  edit: PropTypes.bool,
  handleSheetChanged: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string
    }).isRequired
  }).isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  sheet: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    input: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    output: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape()))
  }).isRequired
};

export default ScheduleDSheet;
