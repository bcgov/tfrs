/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import SchedulesPage from './components/SchedulesPage';
import ScheduleTabs from './components/ScheduleTabs';

class SchedulesContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
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

    this._addRow = this._addRow.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
  }

  _addRow () {
    const { grid } = this.state;

    grid.push([
      {
        className: 'text',
        component: (
          <select
            className="form-control"
            row={grid.length}
            onChange={(event) => {
              const { value } = event.target;
              const row = parseInt(event.target.getAttribute('row'), 10);

              grid[row][0] = { ...grid[row][0], value };

              this.setState({
                grid
              });
            }}
          >
            <option key="0" value="" default />
            {this.props.referenceData.approvedFuels &&
            this.props.referenceData.approvedFuels.map(mode => (
              <option key={mode.name} value={mode.name}>{mode.name}</option>
            ))}
          </select>
        ),
        value: ''
      }, {
        value: ''
      }, {
        value: ''
      }, {
        readOnly: true,
        value: ''
      }, {
        value: ''
      }, {
        value: ''
      }
    ]);

    this.setState({
      grid
    });
  }

  _handleCellsChanged (changes) {
    const grid = this.state.grid.map(row => [...row]);

    changes.forEach((change) => {
      const {
        cell, row, col, value
      } = change;

      if (cell.component) {
        return;
      }

      grid[row][col] = { ...grid[row][col], value };

      this.setState({
        grid
      });
    });
  }

  _handleSubmit () {
    console.log(this.state.grid);
    debugger;
  }

  render () {
    if (!this.props.referenceData ||
    !this.props.referenceData.approvedFuels) {
      return <Loading />;
    }

    return ([
      <ScheduleTabs
        active="schedule-b"
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

SchedulesContainer.defaultProps = {
};

SchedulesContainer.propTypes = {
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

const mapStateToProps = state => ({
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulesContainer);
