/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Modal from '../app/components/Modal';
import ScheduleButtons from './components/ScheduleButtons';
import ScheduleDOutput from './components/ScheduleDOutput';
import ScheduleDSheet from './components/ScheduleDSheet';
import ScheduleTabs from './components/ScheduleTabs';

class ScheduleDContainer extends Component {
  static addHeaders () {
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
          className: 'text'
        }, {
          className: 'text'
        }, {
          className: 'text'
        }]
      ],
      output: ScheduleDOutput,
      total: ''
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      sheets: []
    };

    this.rowNumber = 1;

    if (document.location.pathname.indexOf('/edit/') >= 0) {
      this.edit = true;
    } else {
      this.edit = false;
    }

    this._addSheet = this._addSheet.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleSheetChanged = this._handleSheetChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this._addSheet();
  }

  _addSheet () {
    const { sheets } = this.state;

    const sheet = ScheduleDContainer.addHeaders();

    sheets.push(sheet);

    this.setState({
      sheets
    });
  }

  _calculateTotal (grid) {
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

  renderSheets () {
    const { sheets } = this.state;

    return (
      <div className="page_schedule" key="sheets">
        <h1>Schedule D - GHGenius Input and Output Summaries</h1>

        <button type="button" onClick={this._addSheet}>Add Sheet</button>

        {sheets.map((sheet, index) => (
          <ScheduleDSheet
            key={index} // eslint-disable-line react/no-array-index-key
            handleSheetChanged={this._handleSheetChanged}
            index={index}
            match={this.props.match}
            sheet={sheet}
          />
        ))}

        <div className="sticky">
          <ScheduleButtons
            edit={this.edit}
            submit
            delete
          />
        </div>
      </div>
    );
  }

  render () {
    const { id } = this.props.match.params;

    return ([
      <ScheduleTabs
        active="schedule-d"
        edit={this.edit}
        id={id}
        key="nav"
      />,
      this.renderSheets(),
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

ScheduleDContainer.defaultProps = {
};

ScheduleDContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string
    }).isRequired
  }).isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDContainer);
