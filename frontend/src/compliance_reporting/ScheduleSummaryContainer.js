/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'react-datasheet/lib/react-datasheet.css';

import { fuelClasses } from '../actions/fuelClasses';
import { notionalTransferTypes } from '../actions/notionalTransferTypes';
import Modal from '../app/components/Modal';
import ScheduleSummaryDiesel from './components/ScheduleSummaryDiesel';
import ScheduleSummaryGasoline from './components/ScheduleSummaryGasoline';
import ScheduleSummaryPage from './components/ScheduleSummaryPage';
import ScheduleSummaryPart3 from './components/ScheduleSummaryPart3';
import ScheduleSummaryPenalty from './components/ScheduleSummaryPenalty';

class ScheduleSummaryContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      diesel: ScheduleSummaryDiesel,
      gasoline: ScheduleSummaryGasoline,
      part3: ScheduleSummaryPart3,
      penalty: ScheduleSummaryPenalty,
      totals: {
        diesel: 0,
        gasoline: 0
      }
    };

    this.rowNumber = 1;

    this.edit = document.location.pathname.indexOf('/edit/') >= 0;

    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleDieselChanged = this._handleDieselChanged.bind(this);
    this._handleGasolineChanged = this._handleGasolineChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
  }

  _handleCellsChanged (gridName, changes, addition = null) {
    const grid = this.state[gridName].map(row => [...row]);

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
    });

    this.setState({
      [gridName]: grid
    });
  }

  _handleDieselChanged (changes, addition = null) {
    this._handleCellsChanged('diesel', changes, addition);
  }

  _handleGasolineChanged (changes, addition = null) {
    this._handleCellsChanged('gasoline', changes, addition);
  }

  _handleSubmit () {
    console.log(this.state.grid);
  }

  render () {
    let { period } = this.props;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return ([
      <ScheduleSummaryPage
        diesel={this.state.diesel}
        edit={this.edit}
        gasoline={this.state.gasoline}
        handleDieselChanged={this._handleDieselChanged}
        handleGasolineChanged={this._handleGasolineChanged}
        key="summary"
        part3={this.state.part3}
        penalty={this.state.penalty}
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

ScheduleSummaryContainer.defaultProps = {
  period: null
};

ScheduleSummaryContainer.propTypes = {
  fuelClasses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loadFuelClasses: PropTypes.func.isRequired,
  loadNotionalTransferTypes: PropTypes.func.isRequired,
  notionalTransferTypes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  period: PropTypes.string
};

const mapStateToProps = state => ({
  fuelClasses: {
    isFetching: state.rootReducer.fuelClasses.isFinding,
    items: state.rootReducer.fuelClasses.items
  },
  notionalTransferTypes: {
    isFetching: state.rootReducer.notionalTransferTypes.isFinding,
    items: state.rootReducer.notionalTransferTypes.items
  }
});

const mapDispatchToProps = {
  loadFuelClasses: fuelClasses.find,
  loadNotionalTransferTypes: notionalTransferTypes.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSummaryContainer);
