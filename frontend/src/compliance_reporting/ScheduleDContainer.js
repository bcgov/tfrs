/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ScheduleDOutput from './components/ScheduleDOutput';
import ScheduleDSheet from './components/ScheduleDSheet';
import ScheduleDTabs from './components/ScheduleDTabs';
import Select from '../app/components/Spreadsheet/Select';
import {SCHEDULE_D, SCHEDULE_D_INPUT} from '../constants/schedules/scheduleColumns';
import {numericInput} from './components/Columns';

class ScheduleDContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSheet: 0,
      sheets: []
    };

    this.rowNumber = 1;

    this._addHeaders = this._addHeaders.bind(this);
    this._addSheet = this._addSheet.bind(this);
    this._handleSheetChanged = this._handleSheetChanged.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);
    this._setActiveSheet = this._setActiveSheet.bind(this);
    this.loadInitialState = this.loadInitialState.bind(this);
  }

  componentDidMount() {
    if (this.props.scheduleState.scheduleD) {
      this.componentWillReceiveProps(this.props); // it's probably more elegant to use getDerivedStateFromProps, but it is defined static and we need to access instance methods to set the headers
      // we already have the state. don't load it. just render it.
    } else if (!this.props.complianceReport.scheduleD) {
      this._addSheet();
    } else {
      this.loadInitialState();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {sheets} = this.state;

    if (nextProps.scheduleState.scheduleD && nextProps.scheduleState.scheduleD.sheets) {
      if ((sheets.length) < nextProps.scheduleState.scheduleD.sheets.length) {
        this._addSheet(nextProps.scheduleState.scheduleD.sheets.length - (sheets.length));
      }

      for (let i = 0; i < nextProps.scheduleState.scheduleD.sheets.length; i += 1) {
        const sheet = nextProps.scheduleState.scheduleD.sheets[i];
        if (sheets.length < i) {
          sheets.push(this._addHeaders(sheets.length));
        }

        sheets[i].input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value = sheet.fuelType;
        sheets[i].input[1][SCHEDULE_D_INPUT.FEEDSTOCK].value = sheet.feedstock;
        sheets[i].input[1][SCHEDULE_D_INPUT.FUEL_CLASS].value = sheet.fuelClass;

        for (let j = 0; j < sheet.inputs.length; j += 1) {
          if (j >= sheets[i].grid.length - 1) {
            sheets[i].grid.push([{
              readOnly: true,
              value: j + 1
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
          }

          sheets[i].grid[1 + j][SCHEDULE_D.CELL].value = sheet.inputs[j].cell;
          sheets[i].grid[1 + j][SCHEDULE_D.WORKSHEET_NAME].value = sheet.inputs[j].worksheetName;
          sheets[i].grid[1 + j][SCHEDULE_D.VALUE].value = sheet.inputs[j].value;
          sheets[i].grid[1 + j][SCHEDULE_D.UNITS].value = sheet.inputs[j].units;
          sheets[i].grid[1 + j][SCHEDULE_D.DESCRIPTION].value = sheet.inputs[j].description;
        }

        for (let j = 0; j < sheet.outputs.length; j += 1) {
          const rowIndex = sheets[i].output.findIndex(x =>
            x[0].value === sheet.outputs[j].description);
          if (rowIndex !== -1) {
            sheets[i].output[rowIndex][1] = {
              ...numericInput,
              value: sheet.outputs[j].intensity
            };
          }
        }

        sheets[i].output = ScheduleDSheet.calculateTotal(sheets[i].output);
      }

      this.setState({sheets});
    }
  }

  loadInitialState() {
    this.rowNumber = 1;

    const sheets = [];

    for (let i = 0; i < this.props.complianceReport.scheduleD.sheets.length; i += 1) {
      const sheet = {
        ...this.props.complianceReport.scheduleD.sheets[i]
      };
      sheet.inputs = [];
      sheet.outputs = [];

      for (let j = 0; j < this.props.complianceReport.scheduleD.sheets[i].inputs.length; j += 1) {
        sheet.inputs.push({...this.props.complianceReport.scheduleD.sheets[i].inputs[j]});
      }
      for (let j = 0; j < this.props.complianceReport.scheduleD.sheets[i].outputs.length; j += 1) {
        sheet.outputs.push({...this.props.complianceReport.scheduleD.sheets[i].outputs[j]});
      }

      sheets.push(sheet);
      this.props.updateScheduleState({
        scheduleD: {
          sheets
        }
      });
    }
  }

  _addHeaders(id) {
    return {
      grid: [
        [{
          className: 'row-number',
          readOnly: true
        }, {
          className: 'worksheet-name',
          readOnly: true,
          value: 'Worksheet Name'
        }, {
          className: 'worksheet-cell',
          readOnly: true,
          value: 'Cell'
        }, {
          className: 'worksheet-value',
          readOnly: true,
          value: 'Value'
        }, {
          className: 'units',
          readOnly: true,
          value: 'Units'
        }, {
          className: 'description',
          readOnly: true,
          value: 'Description'
        }] // spreadsheet header
      ],
      input: [
        [{
          className: 'fuel-type',
          readOnly: true,
          value: 'Part 3 Fuel Type'
        }, {
          className: 'feedstock',
          readOnly: true,
          value: 'Feedstock'
        }, {
          className: 'fuel-class',
          readOnly: true,
          value: 'Fuel Class'
        }],
        [{
          className: 'text dropdown-indicator',
          dataEditor: Select,
          getOptions: () => this.props.referenceData.approvedFuels,
          mapping: {
            key: 'id',
            value: 'name'
          }
        }, {
          className: 'text'
        }, {
          className: 'text dropdown-indicator',
          dataEditor: Select,
          getOptions: row => this._getFuelClasses(row, id),
          mapping: {
            key: 'id',
            value: 'fuelClass'
          }
        }]
      ],
      id,
      output: ScheduleDOutput()
    };
  }

  _addSheet(sheetsToAdd = 1) {
    const {sheets} = this.state;

    for (let i = 0; i < sheetsToAdd; i += 1) {
      const sheet = this._addHeaders(sheets.length);

      sheets.push(sheet);
    }

    this.setState({
      sheets
    });
  }

  _getFuelClasses(row, id) {
    const fuelType = this.state.sheets[id].input[row][SCHEDULE_D_INPUT.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
    }

    return [];
  }

  _handleSheetChanged(grid, index) {
    const {sheets} = this.state;

    sheets[index] = {
      ...sheets[index],
      ...grid
    };

    this.setState({
      sheets
    });

    this._gridStateToPayload({
      sheets
    });
  }

  _gridStateToPayload(state) {
    const sheets = [];

    for (let i = 0; i < state.sheets.length; i += 1) {
      const sheet = state.sheets[i];

      const sheetRecord = {
        fuelClass: sheet.input[1][SCHEDULE_D_INPUT.FUEL_CLASS].value,
        feedstock: sheet.input[1][SCHEDULE_D_INPUT.FEEDSTOCK].value,
        fuelType: sheet.input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value,
        inputs: [],
        outputs: []
      };

      for (let j = 1; j < sheet.grid.length; j += 1) {
        const inputRecord = {
          cell: sheet.grid[j][SCHEDULE_D.CELL].value,
          worksheetName: sheet.grid[j][SCHEDULE_D.WORKSHEET_NAME].value,

          value: sheet.grid[j][SCHEDULE_D.VALUE].value,
          units: sheet.grid[j][SCHEDULE_D.UNITS].value,
          description: sheet.grid[j][SCHEDULE_D.DESCRIPTION].value
        };
        const atLeastOneCellFilled = (
          inputRecord.cell || inputRecord.worksheetName || inputRecord.value ||
          inputRecord.units || inputRecord.description
        );
        if (atLeastOneCellFilled) {
          sheetRecord.inputs.push(inputRecord);
        }
      }

      for (let j = 0; j < sheet.output.length; j += 1) {
        const isTotalField = sheet.output[j][1].readOnly;

        if (!isTotalField) {
          const outputRecord = {
            description: sheet.output[j][0].value,
            intensity: sheet.output[j][1].value
          };
          if (outputRecord.intensity) {
            sheetRecord.outputs.push(outputRecord);
          }
        }
      }

      sheets.push(sheetRecord);
    }

    this.props.updateScheduleState({
      scheduleD: {
        sheets
      }
    });
  }

  _setActiveSheet(id) {
    this.setState({
      activeSheet: id
    });
  }

  renderSheets() {
    const {sheets} = this.state;

    return (
      <div className="page_schedule spreadsheet-component" key="sheets">
        <h1>Schedule D - GHGenius Input and Output Summaries</h1>

        <ScheduleDTabs
          active={this.state.activeSheet}
          addSheet={this._addSheet}
          sheets={sheets}
          setActiveSheet={this._setActiveSheet}
        />

        {sheets.map(sheet => (
          <div className={this.state.activeSheet === sheet.id ? 'active' : 'inactive'} key={sheet.id}>
            <ScheduleDSheet
              addHeaders={this._addHeaders}
              handleSheetChanged={this._handleSheetChanged}
              id={sheet.id}
              match={this.props.match}
              referenceData={this.props.referenceData}
              sheet={sheet}
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    return ([
      this.renderSheets()
    ]);
  }
}

ScheduleDContainer.defaultProps = {
  complianceReport: null,
  match: {}
};

ScheduleDContainer.propTypes = {
  complianceReport: PropTypes.shape({
    scheduleD: PropTypes.shape()
  }),
  match: PropTypes.shape({}),
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  scheduleState: PropTypes.shape({
    scheduleD: PropTypes.shape({
      sheets: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

export default connect(mapStateToProps, null)(ScheduleDContainer);
