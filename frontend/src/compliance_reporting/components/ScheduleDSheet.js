import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-datasheet/lib/react-datasheet.css';

import ScheduleDPage from './ScheduleDPage';
import { SCHEDULE_D_INPUT, SCHEDULE_D_OUTPUT } from '../../constants/schedules/scheduleColumns';

class ScheduleDSheet extends Component {
  static calculateTotal (grid) {
    let total = 0;
    let emptyCells = true;

    for (let row = 0; row < SCHEDULE_D_OUTPUT.TOTAL; row += 1) {
      if (!Number.isNaN(parseFloat(grid[row][1].value))) {
        total += parseFloat(grid[row][1].value);
        emptyCells = false;
      }
    }

    const updatedGrid = grid;

    updatedGrid[SCHEDULE_D_OUTPUT.TOTAL][1] = {
      ...updatedGrid[SCHEDULE_D_OUTPUT.TOTAL][1],
      value: emptyCells ? '' : total
    };

    updatedGrid[SCHEDULE_D_OUTPUT.CARBON_INTENSITY][1] = {
      ...updatedGrid[SCHEDULE_D_OUTPUT.CARBON_INTENSITY][1],
      value: emptyCells ? '' : total / 1000
    };

    return updatedGrid;
  }

  constructor (props) {
    super(props);

    this.rowNumber = this.props.sheet.grid.length;

    this._addRow = this._addRow.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
  }

  componentDidMount () {
    if (this.rowNumber === 1) {
      this._addRow(10);
    }
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.props.sheet;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{
        readOnly: true,
        value: this.rowNumber
      }, {
        className: 'text',
        readOnly: this.props.readOnly
      }, {
        className: 'text',
        readOnly: this.props.readOnly
      }, {
        className: 'text',
        readOnly: this.props.readOnly
      }, {
        className: 'text',
        readOnly: this.props.readOnly
      }, {
        className: 'text',
        readOnly: this.props.readOnly
      }]);

      this.rowNumber += 1;
    }

    this.props.handleSheetChanged(grid, this.props.id);
  }

  _handleCellsChanged (gridType, changes, addition = null) {
    let grid = this.props.sheet[gridType].map(row => [...row]);

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

      if (gridType === 'input' && col === SCHEDULE_D_INPUT.FUEL_TYPE) {
        grid[row] = this._validateFuelTypeColumn(grid[row], value);
      }

      if (gridType === 'output') {
        grid[row][col] = {
          ...grid[row][col],
          value: value !== '' ? Number(String(value).replace(/,/g, '')) : ''
        };

        grid = ScheduleDSheet.calculateTotal(grid);
      }
    });

    this.props.handleSheetChanged({ [gridType]: grid }, this.props.id);
  }

  _validateFuelTypeColumn (currentRow, value) {
    const row = currentRow;
    const selectedFuel = this.props.referenceData.approvedFuels.find(fuel => fuel.name === value);

    if (!selectedFuel) {
      row[SCHEDULE_D_INPUT.FUEL_TYPE] = {
        ...row[SCHEDULE_D_INPUT.FUEL_TYPE],
        value: ''
      };
    }

    row[SCHEDULE_D_INPUT.FUEL_CLASS] = { // pre-select the fuel class, if possible
      ...row[SCHEDULE_D_INPUT.FUEL_CLASS],
      value: (selectedFuel && selectedFuel.fuelClasses.length === 1)
        ? selectedFuel.fuelClasses[0].fuelClass : ''
    };

    return row;
  }

  render () {
    return (
      <ScheduleDPage
        addRow={this._addRow}
        addRowEnabled={this.props.addRowEnabled}
        handleCellsChanged={this._handleCellsChanged}
        scheduleType="schedule-d"
        sheet={this.props.sheet}
        valid={this.props.valid}
        validating={this.props.validating}
        validationMessages={this.props.validationMessages}
      />
    );
  }
}

ScheduleDSheet.defaultProps = {
  addRowEnabled: true,
  readOnly: false,
  validationMessages: null
};

ScheduleDSheet.propTypes = {
  handleSheetChanged: PropTypes.func.isRequired,
  addRowEnabled: PropTypes.bool,
  id: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  sheet: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    input: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    output: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape()))
  }).isRequired,
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
};

export default ScheduleDSheet;
