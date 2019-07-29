/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { expectedUses } from '../actions/expectedUses';
import Input from '../app/components/Spreadsheet/Input';
import Select from '../app/components/Spreadsheet/Select';
import SchedulesPage from './components/SchedulesPage';
import { SCHEDULE_C } from '../constants/schedules/scheduleColumns';

class ScheduleCContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          className: 'row-number',
          readOnly: true
        }, {
          colSpan: 4,
          readOnly: true,
          value: 'FUEL IDENTIFICATION AND QUANTITY'
        }, {
          className: 'expected-use',
          readOnly: true,
          rowSpan: 2,
          value: 'Expected Use'
        }, {
          className: 'other',
          readOnly: true,
          rowSpan: 2,
          value: 'If other, write in expected use:'
        }], // header
        [{
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
          className: 'quantity',
          readOnly: true,
          value: 'Quantity of Fuel Supplied'
        }, {
          className: 'units',
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

    this._addRow = this._addRow.bind(this);
    this._getFuelClasses = this._getFuelClasses.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._validateFuelClassColumn = this._validateFuelClassColumn.bind(this);
    this._validateFuelTypeColumn = this._validateFuelTypeColumn.bind(this);
    this.loadInitialState = this.loadInitialState.bind(this);
  }

  componentDidMount () {
    this.props.loadExpectedUses();

    if (this.props.scheduleState.scheduleC) {
      // we already have the state. don't load it. just render it.
    } else if (!this.props.complianceReport.scheduleC) {
      this._addRow(5);
    } else  {
      this.loadInitialState();
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { grid } = this.state;

    if (nextProps.scheduleState.scheduleC && nextProps.scheduleState.scheduleC.records) {
      if ((grid.length - 2) < nextProps.scheduleState.scheduleC.records.length) {
        this._addRow(nextProps.scheduleState.scheduleC.records.length - (grid.length - 2));
      }

      for (let i = 0; i < nextProps.scheduleState.scheduleC.records.length; i += 1) {
        const record = nextProps.scheduleState.scheduleC.records[i];

        grid[2 + i][SCHEDULE_C.FUEL_TYPE].value = record.fuelType;
        grid[2 + i][SCHEDULE_C.FUEL_CLASS].value = record.fuelClass;
        grid[2 + i][SCHEDULE_C.EXPECTED_USE].value = record.expectedUse;
        grid[2 + i][SCHEDULE_C.EXPECTED_USE_OTHER].value = record.rationale;
        grid[2 + i][SCHEDULE_C.EXPECTED_USE_OTHER].readOnly = (record.expectedUse !== 'Other');
        grid[2 + i][SCHEDULE_C.QUANTITY].value = record.quantity;

        const selectedFuel = this.props.referenceData.approvedFuels.find(fuel =>
          fuel.name === record.fuelType);

        grid[2 + i][SCHEDULE_C.UNITS].value = (selectedFuel && selectedFuel.unitOfMeasure)
          ? selectedFuel.unitOfMeasure.name : '';
      }
    }

    this.setState({
      grid
    });
  }

  loadInitialState () {
    this.rowNumber = 1;
    // this._addRow(this.props.complianceReport.scheduleC.records.length);

    const records = [];

    for (let i = 0; i < this.props.complianceReport.scheduleC.records.length; i += 1) {
      records.push({ ...this.props.complianceReport.scheduleC.records[i] });
      this.props.updateScheduleState({
        scheduleC: {
          records
        }
      });
    }
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
            addCommas: true,
            dataNumberToFixed: 0,
            maxLength: '12',
            step: '1'
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

      if (col === SCHEDULE_C.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: value.replace(/,/g, '')
        };
      }

      if (col === SCHEDULE_C.EXPECTED_USE) { //  Expected Use
        if (value !== 'Other') {
          grid[row][SCHEDULE_C.EXPECTED_USE_OTHER] = {
            ...grid[row][SCHEDULE_C.EXPECTED_USE_OTHER],
            value: ''
          };
        } else {
          grid[row][SCHEDULE_C.EXPECTED_USE_OTHER] = {
            ...grid[row][SCHEDULE_C.EXPECTED_USE_OTHER]
          };
        }
      }
    });

    this.setState({
      grid
    });

    this._gridStateToPayload({
      grid
    });
  }

  _gridStateToPayload (state) {
    const startingRow = 2;

    const records = [];

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i];
      const record = {
        expectedUse: row[5].value,
        fuelType: row[1].value,
        fuelClass: row[2].value,
        quantity: row[3].value,
        rationale: row[6].value
      };

      const rowIsEmpty = !(record.expectedUse || record.fuelClass ||
        record.fuelType || record.quantity);

      if (!rowIsEmpty) {
        records.push(record);
      }
    }

    this.props.updateScheduleState({
      scheduleC: {
        records
      }
    });
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
        ...row[SCHEDULE_C.FUEL_TYPE],
        value: ''
      };
    }

    // if fuel type only allows one fuel class, pre-select the fuel class
    // otherwise, reset the fuel class
    row[SCHEDULE_C.FUEL_CLASS] = {
      ...row[SCHEDULE_C.FUEL_CLASS],
      value: (selectedFuel && selectedFuel.fuelClasses.length === 1)
        ? selectedFuel.fuelClasses[0].fuelClass : ''
    };

    row[SCHEDULE_C.UNITS] = { // automatically load the unit of measure for this fuel type
      ...row[SCHEDULE_C.UNITS],
      value: (selectedFuel && selectedFuel && selectedFuel.unitOfMeasure)
        ? selectedFuel.unitOfMeasure.name : ''
    };

    return row;
  }

  render () {
    return ([
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        scheduleType="schedule-c"
        title="Schedule C - Fuels used for other purposes"
      >
        <p>
          Under section 6 (3) of the
          <em> Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act
          </em>
          , Part 3 requirements do not apply in relation to fuel quantities that the Part 3 fuel
          supplier expects, on reasonable grounds, will be used for a purpose other than
          transportation. The quantities and expected uses of excluded fuels must be reported in
          accordance with section 11.08 (4) (d) (ii) of the Regulation.
        </p>
        <p>
          <strong>
            The volumes reported here should not be reported in Schedule B. This form will
            include the quantities entered in this Schedule in the Part 2 Summary section
            as appropriate.
          </strong>
        </p>
        <p>
          Report &quot;middle-distillate&quot; spec diesel heating oil as Petroleum-based diesel.
        </p>
      </SchedulesPage>
    ]);
  }
}

ScheduleCContainer.defaultProps = {
  complianceReport: null
};

ScheduleCContainer.propTypes = {
  expectedUses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loadExpectedUses: PropTypes.func.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool
  }).isRequired,
  complianceReport: PropTypes.shape({
    scheduleC: PropTypes.shape()
  }),
  period: PropTypes.string.isRequired,
  scheduleState: PropTypes.shape({
    scheduleC: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
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
