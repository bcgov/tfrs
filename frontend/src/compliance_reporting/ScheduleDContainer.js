/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ScheduleButtons from './components/ScheduleButtons';
import ScheduleDOutput from './components/ScheduleDOutput';
import ScheduleDSheet from './components/ScheduleDSheet';
import ScheduleDTabs from './components/ScheduleDTabs';
import Select from './components/Select';
import { SCHEDULE_D_INPUT } from '../constants/schedules/scheduleColumns';

class ScheduleDContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeSheet: 0,
      sheets: []
    };

    this.rowNumber = 1;

    this._addHeaders = this._addHeaders.bind(this);
    this._addSheet = this._addSheet.bind(this);
    this._handleSheetChanged = this._handleSheetChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._setActiveSheet = this._setActiveSheet.bind(this);
  }

  componentDidMount () {
    this._addSheet();
  }

  _addHeaders (id) {
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
          className: 'text',
          dataEditor: Select,
          getOptions: () => this.props.referenceData.approvedFuels,
          mapping: {
            key: 'id',
            value: 'name'
          }
        }, {
          className: 'text'
        }, {
          className: 'text',
          dataEditor: Select,
          getOptions: row => this._getFuelClasses(row, id),
          mapping: {
            key: 'id',
            value: 'fuelClass'
          }
        }]
      ],
      id,
      output: ScheduleDOutput,
      total: ''
    };
  }

  _addSheet () {
    const { sheets } = this.state;

    const sheet = this._addHeaders(sheets.length);

    sheets.push(sheet);

    this.setState({
      sheets
    });
  }

  _getFuelClasses (row, id) {
    const fuelType = this.state.sheets[id].input[row][SCHEDULE_D_INPUT.FUEL_TYPE];

    const selectedFuel = this.props.referenceData.approvedFuels
      .find(fuel => fuel.name === fuelType.value);

    if (selectedFuel) {
      return selectedFuel.fuelClasses;
    }

    return [];
  }

  _handleSheetChanged (grid, index) {
    const { sheets } = this.state;

    sheets[index] = {
      ...sheets[index],
      ...grid
    };

    this.setState({
      sheets
    });
  }

  _handleSubmit () {
    console.log(this.state.sheets);
  }

  _setActiveSheet (id) {
    this.setState({
      activeSheet: id
    });
  }

  renderSheets () {
    const { sheets } = this.state;

    return (
      <div className="page_schedule" key="sheets">
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

        <div className="sticky">
          <ScheduleButtons
            edit={this.props.edit}
            submit
            delete
          />
        </div>
      </div>
    );
  }

  render () {
    return ([
      this.renderSheets()
    ]);
  }
}

ScheduleDContainer.defaultProps = {
};

ScheduleDContainer.propTypes = {
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

const mapStateToProps = state => ({
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

export default connect(mapStateToProps, null)(ScheduleDContainer);
