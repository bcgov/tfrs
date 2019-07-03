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
import { SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns';
import { formatNumeric } from '../utils/functions';

class ScheduleSummaryContainer extends Component {
  static calculateDieselPayable (grid) {
    let totals = 0;

    let payable = grid[SCHEDULE_SUMMARY.LINE_15][2].value;
    if (payable && !Number.isNaN(payable)) {
      totals += parseFloat(payable);
    }

    payable = grid[SCHEDULE_SUMMARY.LINE_21][2].value;
    if (payable && !Number.isNaN(payable)) {
      totals -= parseFloat(payable);
    }

    totals *= 0.45;

    return totals;
  }

  static calculateDieselTotal (grid) {
    let totals = 0;

    let volume = grid[SCHEDULE_SUMMARY.LINE_13][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_16][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_17][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals -= parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_18][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_19][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_20][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals -= parseFloat(volume);
    }

    return totals;
  }

  static calculateGasolinePayable (grid) {
    let totals = 0;

    let payable = grid[SCHEDULE_SUMMARY.LINE_4][2].value;
    if (payable && !Number.isNaN(payable)) {
      totals += parseFloat(payable);
    }

    payable = grid[SCHEDULE_SUMMARY.LINE_10][2].value;
    if (payable && !Number.isNaN(payable)) {
      totals -= parseFloat(payable);
    }

    totals *= 0.30;

    return totals;
  }

  static calculateGasolineTotal (grid) {
    let totals = 0;

    let volume = grid[SCHEDULE_SUMMARY.LINE_2][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_5][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_6][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals -= parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_7][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_8][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals += parseFloat(volume);
    }

    volume = grid[SCHEDULE_SUMMARY.LINE_9][2].value;
    if (volume && !Number.isNaN(volume)) {
      totals -= parseFloat(volume);
    }

    return totals;
  }

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

    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleDieselChanged = this._handleDieselChanged.bind(this);
    this._handleGasolineChanged = this._handleGasolineChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    if (this.props.loadedState) {
      // this.restoreFromAutosaved();
    } else if (!this.props.create) {
      this.loadSchedules();
    }
  }

  loadSchedules () {
    const { diesel, gasoline } = this.state;
    const { scheduleA, summary } = this.props.complianceReport;
    const {
      totalPetroleumDiesel,
      totalPetroleumGasoline,
      totalRenewableDiesel,
      totalRenewableGasoline
    } = summary;

    let totalDiesel = 0;
    let totalGasoline = 0;

    if (totalPetroleumDiesel) {
      diesel[SCHEDULE_SUMMARY.LINE_12][2] = { // line 12, 3rd column
        ...diesel[SCHEDULE_SUMMARY.LINE_12][2],
        value: totalPetroleumDiesel
      };

      totalDiesel += totalPetroleumDiesel;
    }

    if (totalPetroleumGasoline) {
      gasoline[SCHEDULE_SUMMARY.LINE_1][2] = { // line 1, 3rd column
        ...gasoline[SCHEDULE_SUMMARY.LINE_1][2],
        value: totalPetroleumGasoline
      };

      totalGasoline += totalPetroleumGasoline;
    }

    if (totalRenewableGasoline) {
      gasoline[SCHEDULE_SUMMARY.LINE_2][2] = { // line 2, 3rd column
        ...gasoline[SCHEDULE_SUMMARY.LINE_2][2],
        value: totalRenewableGasoline
      };

      totalGasoline += totalRenewableGasoline;
    }

    gasoline[SCHEDULE_SUMMARY.LINE_3][2] = { // line 3, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_3][2],
      value: totalGasoline === 0 ? '' : totalGasoline
    };

    const line4Value = totalGasoline * 0.05;

    gasoline[SCHEDULE_SUMMARY.LINE_4][2] = { // line 4, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_4][2],
      value: line4Value // Line 3 x 5%
    };

    const line6Value = Math.round(line4Value * 0.05); // Line 4 x 5%

    gasoline[SCHEDULE_SUMMARY.LINE_6][0] = { // line 6, 1st column
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][0],
      value: gasoline[SCHEDULE_SUMMARY.LINE_6][0]
        .value.replace(')', ` is ${formatNumeric(line6Value, 0)} L)`)
    };

    gasoline[SCHEDULE_SUMMARY.LINE_6][2] = { // line 6, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][2],
      attributes: {
        ...gasoline[SCHEDULE_SUMMARY.LINE_6][2].attributes,
        maxValue: line6Value
      }
    };

    gasoline[SCHEDULE_SUMMARY.LINE_8][0] = { // line 8, 1st column
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][0],
      value: gasoline[SCHEDULE_SUMMARY.LINE_8][0]
        .value.replace(')', ` is ${formatNumeric(line6Value, 0)} L)`)
    };

    gasoline[SCHEDULE_SUMMARY.LINE_8][2] = { // line 8, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][2],
      attributes: {
        ...gasoline[SCHEDULE_SUMMARY.LINE_8][2].attributes,
        maxValue: line6Value
      }
    };

    if (totalRenewableDiesel) {
      diesel[SCHEDULE_SUMMARY.LINE_13][2] = { // line 13, 3rd column
        ...diesel[SCHEDULE_SUMMARY.LINE_13][2],
        value: totalRenewableDiesel
      };

      totalDiesel += totalRenewableDiesel;
    }

    diesel[SCHEDULE_SUMMARY.LINE_14][2] = { // line 14, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_14][2],
      value: totalDiesel === 0 ? '' : totalDiesel
    };

    const line15Value = totalDiesel * 0.04;

    diesel[SCHEDULE_SUMMARY.LINE_15][2] = { // line 15, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_15][2],
      value: line15Value // Line 14 x 4%
    };

    const line17Value = Math.round(line15Value * 0.05); // Line 15 x 5%

    diesel[SCHEDULE_SUMMARY.LINE_17][0] = { // line 17, 1st column
      ...diesel[SCHEDULE_SUMMARY.LINE_17][0],
      value: diesel[SCHEDULE_SUMMARY.LINE_17][0]
        .value.replace(')', ` is ${formatNumeric(line17Value, 0)} L)`)
    };

    diesel[SCHEDULE_SUMMARY.LINE_17][2] = { // line 17, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_17][2],
      attributes: {
        ...diesel[SCHEDULE_SUMMARY.LINE_17][2].attributes,
        maxValue: line17Value
      }
    };

    diesel[SCHEDULE_SUMMARY.LINE_19][0] = { // line 19, 1st column
      ...diesel[SCHEDULE_SUMMARY.LINE_19][0],
      value: diesel[SCHEDULE_SUMMARY.LINE_19][0]
        .value.replace(')', ` is ${formatNumeric(line17Value, 0)} L)`)
    };

    diesel[SCHEDULE_SUMMARY.LINE_19][2] = { // line 19, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_19][2],
      attributes: {
        ...diesel[SCHEDULE_SUMMARY.LINE_19][2].attributes,
        maxValue: line17Value
      }
    };

    if (scheduleA && scheduleA.records) {
      let dieselReceived = 0;
      let dieselTransferred = 0;
      let gasolineReceived = 0;
      let gasolineTransferred = 0;

      scheduleA.records.forEach((record) => {
        if (record.fuelClass === 'Diesel' && record.transferType === 'Transferred') {
          dieselTransferred += Number(record.quantity);
        } else if (record.fuelClass === 'Diesel' && record.transferType === 'Received') {
          dieselReceived += Number(record.quantity);
        } else if (record.fuelClass === 'Gasoline' && record.transferType === 'Transferred') {
          gasolineTransferred += Number(record.quantity);
        } else if (record.fuelClass === 'Gasoline' && record.transferType === 'Received') {
          gasolineReceived += Number(record.quantity);
        }
      });

      gasoline[SCHEDULE_SUMMARY.LINE_5][2] = { // line 5, 3rd column
        ...gasoline[SCHEDULE_SUMMARY.LINE_5][2],
        value: gasolineReceived - gasolineTransferred
      };

      diesel[SCHEDULE_SUMMARY.LINE_16][2] = { // line 5, 3rd column
        ...diesel[SCHEDULE_SUMMARY.LINE_16][2],
        value: dieselReceived - dieselTransferred
      };
    }

    gasoline[SCHEDULE_SUMMARY.LINE_10][2].value =
    ScheduleSummaryContainer.calculateGasolineTotal(gasoline);

    gasoline[SCHEDULE_SUMMARY.LINE_11][2].value =
    ScheduleSummaryContainer.calculateGasolinePayable(gasoline);

    diesel[SCHEDULE_SUMMARY.LINE_21][2].value =
    ScheduleSummaryContainer.calculateDieselTotal(diesel);

    diesel[SCHEDULE_SUMMARY.LINE_22][2].value =
    ScheduleSummaryContainer.calculateDieselPayable(diesel);

    this.setState({
      ...this.state,
      diesel,
      gasoline
    });
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
        gasoline={this.state.gasoline}
        handleDieselChanged={this._handleDieselChanged}
        handleGasolineChanged={this._handleGasolineChanged}
        key="summary"
        part3={this.state.part3}
        penalty={this.state.penalty}
        saving={this.props.saving}
      />,
      <Modal
        handleSubmit={event => this._handleSubmit(event)}
        id="confirmSubmit"
        key="confirmSubmit"
      >
        Are you sure you want to save this compliance report?
      </Modal>
    ]);
  }
}

ScheduleSummaryContainer.defaultProps = {
  complianceReport: null,
  loadedState: null,
  period: null
};

ScheduleSummaryContainer.propTypes = {
  complianceReport: PropTypes.shape({
    scheduleA: PropTypes.shape(),
    scheduleB: PropTypes.shape(),
    scheduleC: PropTypes.shape(),
    summary: PropTypes.shape({
      totalPetroleumDiesel: PropTypes.number,
      totalPetroleumGasoline: PropTypes.number,
      totalRenewableDiesel: PropTypes.number,
      totalRenewableGasoline: PropTypes.number
    })
  }),
  create: PropTypes.bool.isRequired,
  fuelClasses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  loadedState: PropTypes.shape(),
  loadFuelClasses: PropTypes.func.isRequired,
  loadNotionalTransferTypes: PropTypes.func.isRequired,
  notionalTransferTypes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  period: PropTypes.string,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  saving: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  fuelClasses: {
    isFetching: state.rootReducer.fuelClasses.isFinding,
    items: state.rootReducer.fuelClasses.items
  },
  notionalTransferTypes: {
    isFetching: state.rootReducer.notionalTransferTypes.isFinding,
    items: state.rootReducer.notionalTransferTypes.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
  loadFuelClasses: fuelClasses.find,
  loadNotionalTransferTypes: notionalTransferTypes.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSummaryContainer);
