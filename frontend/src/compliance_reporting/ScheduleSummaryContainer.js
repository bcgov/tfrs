/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import 'react-datasheet/lib/react-datasheet.css';

import getCreditCalculation from '../actions/creditCalculation';
import ScheduleSummaryDiesel from './components/ScheduleSummaryDiesel';
import ScheduleSummaryGasoline from './components/ScheduleSummaryGasoline';
import ScheduleSummaryPage from './components/ScheduleSummaryPage';
import ScheduleSummaryPart3 from './components/ScheduleSummaryPart3';
import ScheduleSummaryPenalty from './components/ScheduleSummaryPenalty';
import { SCHEDULE_PENALTY, SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns';
import { formatNumeric } from '../utils/functions';
import CallableModal from '../app/components/CallableModal';
import Loading from '../app/components/Loading';
import * as Lang from '../constants/langEnUs';

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

    if (totals <= 0) {
      return '';
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

    if (totals <= 0) {
      return '';
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

  static calculatePart3Payable (part3) {
    const grid = part3;
    let credits = Number(grid[SCHEDULE_SUMMARY.LINE_26][2].value);
    const balance = Number(grid[SCHEDULE_SUMMARY.LINE_25][2].value);

    let outstandingBalance = 0;
    let payable = 0;

    if (Number.isNaN(credits)) {
      credits = 0;
    }

    outstandingBalance = balance + Number(credits);
    payable = outstandingBalance * -200; // negative symbol so that the product is positive

    if (balance > 0) {
      outstandingBalance = '';
      payable = '';
    }

    grid[SCHEDULE_SUMMARY.LINE_27][2] = {
      ...grid[SCHEDULE_SUMMARY.LINE_27][2],
      value: outstandingBalance
    };

    grid[SCHEDULE_SUMMARY.LINE_28][2] = {
      ...grid[SCHEDULE_SUMMARY.LINE_28][2],
      value: payable
    };

    return grid;
  }

  constructor (props) {
    super(props);

    this.state = {
      diesel: new ScheduleSummaryDiesel(props.readOnly),
      gasoline: new ScheduleSummaryGasoline(props.readOnly),
      part3: new ScheduleSummaryPart3(),
      penalty: new ScheduleSummaryPenalty(),
      showModal: false,
      totals: {
        diesel: 0,
        gasoline: 0
      }
    };

    this.rowNumber = 1;

    this._closeModal = this._closeModal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleDieselChanged = this._handleDieselChanged.bind(this);
    this._handleGasolineChanged = this._handleGasolineChanged.bind(this);
    this._handlePart3Changed = this._handlePart3Changed.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);
    this._calculateNonCompliancePayable = this._calculateNonCompliancePayable.bind(this);
  }

  componentDidMount () {
    if (this.props.complianceReport.hasSnapshot && this.props.snapshot && this.props.readOnly) {
      this.componentWillReceiveProps(this.props);
    } else {
      if (this.props.complianceReport && !this.props.complianceReport.hasSnapshot) {
        this.props.recomputeRequest();
      }

      if (!this.props.scheduleState.summary) {
        this.loadInitialState();
      }
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { diesel, gasoline } = this.state;
    let { part3, penalty, showModal } = this.state;

    if (this.props.complianceReport.hasSnapshot && nextProps.snapshot && nextProps.readOnly) {
      const { summary } = nextProps.snapshot;

      const cellFormatNumeric = cellValue => ({
        className: 'numeric',
        readOnly: true,
        value: cellValue,
        valueViewer: (data) => {
          const { value } = data;

          if (value === '') {
            return '';
          }

          if (Number(value) < 0) {
            return <span>({Math.round(value * -1).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>;
          }

          return <span>{Math.round(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
        }
      });

      const cellFormatTotal = cellValue => ({
        className: 'numeric',
        readOnly: true,
        value: cellValue,
        valueViewer: (data) => {
          const { value } = data;

          if (value === '') {
            return '';
          }

          if (Number(value) < 0) {
            return <span>({Number(value * -1).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')})</span>;
          }

          return <span>{Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
        }
      });

      gasoline[SCHEDULE_SUMMARY.LINE_1][2] = cellFormatNumeric(summary.lines['1']);
      gasoline[SCHEDULE_SUMMARY.LINE_2][2] = cellFormatNumeric(summary.lines['2']);
      gasoline[SCHEDULE_SUMMARY.LINE_3][2] = cellFormatNumeric(summary.lines['3']);
      gasoline[SCHEDULE_SUMMARY.LINE_4][2] = cellFormatNumeric(summary.lines['4']);
      gasoline[SCHEDULE_SUMMARY.LINE_5][2] = cellFormatNumeric(summary.lines['5']);
      gasoline[SCHEDULE_SUMMARY.LINE_6][2] = cellFormatNumeric(summary.lines['6']);
      gasoline[SCHEDULE_SUMMARY.LINE_7][2] = cellFormatNumeric(summary.lines['7']);
      gasoline[SCHEDULE_SUMMARY.LINE_8][2] = cellFormatNumeric(summary.lines['8']);
      gasoline[SCHEDULE_SUMMARY.LINE_9][2] = cellFormatNumeric(summary.lines['9']);
      gasoline[SCHEDULE_SUMMARY.LINE_10][2] = cellFormatNumeric(summary.lines['10']);
      gasoline[SCHEDULE_SUMMARY.LINE_11][2] = cellFormatTotal(summary.lines['11']);

      diesel[SCHEDULE_SUMMARY.LINE_12][2] = cellFormatNumeric(summary.lines['12']);
      diesel[SCHEDULE_SUMMARY.LINE_13][2] = cellFormatNumeric(summary.lines['13']);
      diesel[SCHEDULE_SUMMARY.LINE_14][2] = cellFormatNumeric(summary.lines['14']);
      diesel[SCHEDULE_SUMMARY.LINE_15][2] = cellFormatNumeric(summary.lines['15']);

      diesel[SCHEDULE_SUMMARY.LINE_16][2] = cellFormatNumeric(summary.lines['16']);
      diesel[SCHEDULE_SUMMARY.LINE_17][2] = cellFormatNumeric(summary.lines['17']);
      diesel[SCHEDULE_SUMMARY.LINE_18][2] = cellFormatNumeric(summary.lines['18']);
      diesel[SCHEDULE_SUMMARY.LINE_19][2] = cellFormatNumeric(summary.lines['19']);
      diesel[SCHEDULE_SUMMARY.LINE_20][2] = cellFormatNumeric(summary.lines['20']);
      diesel[SCHEDULE_SUMMARY.LINE_21][2] = cellFormatNumeric(summary.lines['21']);
      diesel[SCHEDULE_SUMMARY.LINE_22][2] = cellFormatTotal(summary.lines['22']);

      part3[SCHEDULE_SUMMARY.LINE_23][2] = cellFormatNumeric(summary.lines['23']);
      part3[SCHEDULE_SUMMARY.LINE_24][2] = cellFormatNumeric(summary.lines['24']);
      part3[SCHEDULE_SUMMARY.LINE_25][2] = cellFormatNumeric(summary.lines['25']);
      part3[SCHEDULE_SUMMARY.LINE_26][2] = cellFormatNumeric(summary.lines['26']);
      part3[SCHEDULE_SUMMARY.LINE_27][2] = cellFormatNumeric(summary.lines['27'] < 0 ? summary.lines['27'] : 0);
      part3[SCHEDULE_SUMMARY.LINE_28][2] = cellFormatTotal(summary.lines['28']);

      penalty[SCHEDULE_PENALTY.LINE_11][2] = cellFormatTotal(summary.lines['11']);
      penalty[SCHEDULE_PENALTY.LINE_22][2] = cellFormatTotal(summary.lines['22']);
      penalty[SCHEDULE_PENALTY.LINE_28][2] = cellFormatTotal(summary.lines['28']);
      penalty[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2] = cellFormatTotal(summary.totalPayable);
    } else {
      // read-write
      if (nextProps.validating || !nextProps.valid) {
        return;
      }

      if (nextProps.recomputing) {
        return;
      }

      this.populateSchedules();

      let { summary } = nextProps.complianceReport;

      if (nextProps.scheduleState) {
        ({ summary } = nextProps.scheduleState);
      }

      if (!summary) {
        return;
      }

      const line15percent = diesel[SCHEDULE_SUMMARY.LINE_15][2].value * 0.05;
      diesel[SCHEDULE_SUMMARY.LINE_17][2].value = summary.dieselClassRetained;

      if (diesel[SCHEDULE_SUMMARY.LINE_17][2].readOnly ||
        (line15percent && line15percent < summary.dieselClassRetained)) {
        diesel[SCHEDULE_SUMMARY.LINE_17][2].value = 0;
      }

      diesel[SCHEDULE_SUMMARY.LINE_18][2].value = summary.dieselClassPreviouslyRetained;

      diesel[SCHEDULE_SUMMARY.LINE_19][2].value = summary.dieselClassDeferred;

      if (diesel[SCHEDULE_SUMMARY.LINE_19][2].readOnly ||
        (line15percent && line15percent < summary.dieselClassDeferred)) {
        diesel[SCHEDULE_SUMMARY.LINE_19][2].value = 0;
      }

      diesel[SCHEDULE_SUMMARY.LINE_20][2].value = summary.dieselClassObligation;

      const line4percent = gasoline[SCHEDULE_SUMMARY.LINE_4][2].value * 0.05;
      gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = summary.gasolineClassRetained;

      if (gasoline[SCHEDULE_SUMMARY.LINE_6][2].readOnly ||
        (line4percent && line4percent < summary.gasolineClassRetained)) {
        gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = 0;
      }

      gasoline[SCHEDULE_SUMMARY.LINE_7][2].value = summary.gasolineClassPreviouslyRetained;

      gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = summary.gasolineClassDeferred;

      if (gasoline[SCHEDULE_SUMMARY.LINE_8][2].readOnly ||
        (line4percent && line4percent < summary.gasolineClassDeferred)) {
        gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = 0;
      }

      gasoline[SCHEDULE_SUMMARY.LINE_9][2].value = summary.gasolineClassObligation;

      part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset;
      const line25value = part3[SCHEDULE_SUMMARY.LINE_25][2].value * -1;

      if (part3[SCHEDULE_SUMMARY.LINE_26][2].readOnly ||
        (line25value && line25value < part3[SCHEDULE_SUMMARY.LINE_26][2].value)) {
        part3[SCHEDULE_SUMMARY.LINE_26][2].value = 0;
      }

      part3 = ScheduleSummaryContainer.calculatePart3Payable(part3);

      penalty[SCHEDULE_PENALTY.LINE_11][2] = {
        ...penalty[SCHEDULE_PENALTY.LINE_11][2],
        value: ScheduleSummaryContainer.calculateGasolinePayable(gasoline)
      };

      penalty[SCHEDULE_PENALTY.LINE_22][2] = {
        ...penalty[SCHEDULE_PENALTY.LINE_22][2],
        value: ScheduleSummaryContainer.calculateDieselPayable(diesel)
      };

      penalty[SCHEDULE_PENALTY.LINE_28][2] = {
        ...penalty[SCHEDULE_PENALTY.LINE_28][2],
        value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
      };

      penalty = this._calculateNonCompliancePayable(penalty);

      if (diesel[SCHEDULE_SUMMARY.LINE_17][2].value < summary.dieselClassRetained ||
        diesel[SCHEDULE_SUMMARY.LINE_19][2].value < summary.dieselClassDeferred ||
        gasoline[SCHEDULE_SUMMARY.LINE_6][2].value < summary.gasolineClassRetained ||
        gasoline[SCHEDULE_SUMMARY.LINE_8][2].value < summary.gasolineClassDeferred ||
        part3[SCHEDULE_SUMMARY.LINE_26][2].value < summary.creditsOffset) {
        showModal = true;

        this.props.updateScheduleState({
          summary: {
            ...summary,
            creditsOffset: part3[SCHEDULE_SUMMARY.LINE_26][2].value,
            dieselClassDeferred: diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
            dieselClassRetained: diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
            gasolineClassDeferred: gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
            gasolineClassRetained: gasoline[SCHEDULE_SUMMARY.LINE_6][2].value
          }
        });
      }
    }

    this.setState({
      diesel,
      gasoline,
      part3,
      penalty,
      showModal
    });
  }

  loadInitialState () {
    if (this.props.complianceReport.summary) {
      const src = this.props.complianceReport.summary;
      const initialState = {
        dieselClassDeferred: src.dieselClassDeferred,
        dieselClassObligation: src.dieselClassObligation,
        dieselClassPreviouslyRetained: src.dieselClassPreviouslyRetained,
        dieselClassRetained: src.dieselClassRetained,
        gasolineClassDeferred: src.gasolineClassDeferred,
        gasolineClassObligation: src.gasolineClassObligation,
        gasolineClassPreviouslyRetained: src.gasolineClassPreviouslyRetained,
        gasolineClassRetained: src.gasolineClassRetained,
        creditsOffset: src.creditsOffset
      };
      this.props.updateScheduleState({
        summary: initialState
      });
    } else {
      const initialState = {
        dieselClassDeferred: 0,
        dieselClassObligation: 0,
        dieselClassPreviouslyRetained: 0,
        dieselClassRetained: 0,
        gasolineClassDeferred: 0,
        gasolineClassObligation: 0,
        gasolineClassPreviouslyRetained: 0,
        gasolineClassRetained: 0,
        creditsOffset: 0
      };
      this.props.updateScheduleState({
        summary: initialState
      });
    }
  }

  _calculateDiesel () {
    const { diesel } = this.state;

    const { summary } = this.props.scheduleState;

    const totals = this.props.recomputedTotals;

    let totalPetroleumDiesel = 0;
    let totalRenewableDiesel = 0;
    let netDieselClassTransferred = 0;

    if (totals.summary) {
      ({ totalPetroleumDiesel, totalRenewableDiesel, netDieselClassTransferred } = totals.summary);
    }

    let totalDiesel = 0;

    diesel[SCHEDULE_SUMMARY.LINE_12][2] = { // line 12, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_12][2],
      value: totalPetroleumDiesel
    };

    if (totalPetroleumDiesel) {
      totalDiesel += totalPetroleumDiesel;
    }

    diesel[SCHEDULE_SUMMARY.LINE_13][2] = { // line 13, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_13][2],
      value: totalRenewableDiesel
    };

    if (totalRenewableDiesel) {
      totalDiesel += totalRenewableDiesel;
    }

    diesel[SCHEDULE_SUMMARY.LINE_14][2] = { // line 14, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_14][2],
      value: totalDiesel === 0 ? '' : totalDiesel
    };

    const line15Value = Math.round(totalDiesel * 0.04);

    diesel[SCHEDULE_SUMMARY.LINE_15][2] = { // line 15, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_15][2],
      value: line15Value // Line 14 x 4%
    };

    const line17Value = Math.floor(line15Value * 0.05); // Line 15 x 5%
    let line17Label = diesel[SCHEDULE_SUMMARY.LINE_17][0].value;
    if (line17Value > 0) {
      line17Label = line17Label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 0)} L)`);
    }

    diesel[SCHEDULE_SUMMARY.LINE_17][0] = { // line 17, 1st column
      ...diesel[SCHEDULE_SUMMARY.LINE_17][0],
      valueViewer: () => (
        <span>{line17Label}</span>
      )
    };

    diesel[SCHEDULE_SUMMARY.LINE_17][2] = { // line 17, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_17][2],
      attributes: {
        ...diesel[SCHEDULE_SUMMARY.LINE_17][2].attributes,
        maxValue: line17Value
      }
    };

    let line19label = diesel[SCHEDULE_SUMMARY.LINE_19][0].value;
    if (line17Value > 0) {
      line19label = line19label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 0)} L)`);
    }

    diesel[SCHEDULE_SUMMARY.LINE_19][0] = { // line 19, 1st column
      ...diesel[SCHEDULE_SUMMARY.LINE_19][0],
      valueViewer: () => (
        <span>{line19label}</span>
      )
    };

    diesel[SCHEDULE_SUMMARY.LINE_19][2] = { // line 19, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_19][2],
      attributes: {
        ...diesel[SCHEDULE_SUMMARY.LINE_19][2].attributes,
        maxValue: line17Value
      }
    };

    diesel[SCHEDULE_SUMMARY.LINE_16][2] = { // line 5, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_16][2],
      value: netDieselClassTransferred
    };

    if (summary.dieselClassRetained) {
      diesel[SCHEDULE_SUMMARY.LINE_17][2].value = summary.dieselClassRetained;
    }

    if (summary.dieselClassPreviouslyRetained) {
      diesel[SCHEDULE_SUMMARY.LINE_18][2].value = summary.dieselClassPreviouslyRetained;
    }

    if (summary.dieselClassDeferred) {
      diesel[SCHEDULE_SUMMARY.LINE_19][2].value = summary.dieselClassDeferred;
    }

    if (summary.dieselClassObligation) {
      diesel[SCHEDULE_SUMMARY.LINE_20][2].value = summary.dieselClassObligation;
    }

    diesel[SCHEDULE_SUMMARY.LINE_21][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_21][2],
      value: ScheduleSummaryContainer.calculateDieselTotal(diesel)
    };

    diesel[SCHEDULE_SUMMARY.LINE_22][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_22][2],
      value: ScheduleSummaryContainer.calculateDieselPayable(diesel)
    };

    return diesel;
  }

  _calculateGasoline () {
    const { gasoline } = this.state;
    const { summary } = this.props.scheduleState;

    const totals = this.props.recomputedTotals;

    let totalPetroleumGasoline = 0;
    let totalRenewableGasoline = 0;
    let netGasolineClassTransferred = 0;

    if (totals.summary) {
      ({
        totalPetroleumGasoline,
        totalRenewableGasoline,
        netGasolineClassTransferred
      } = totals.summary);
    }

    let totalGasoline = 0;

    gasoline[SCHEDULE_SUMMARY.LINE_1][2] = { // line 1, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_1][2],
      value: totalPetroleumGasoline
    };

    if (totalPetroleumGasoline) {
      totalGasoline += totalPetroleumGasoline;
    }

    gasoline[SCHEDULE_SUMMARY.LINE_2][2] = { // line 2, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_2][2],
      value: totalRenewableGasoline
    };

    if (totalRenewableGasoline) {
      totalGasoline += totalRenewableGasoline;
    }

    gasoline[SCHEDULE_SUMMARY.LINE_3][2] = { // line 3, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_3][2],
      value: totalGasoline === 0 ? '' : totalGasoline
    };

    const line4Value = Math.round(totalGasoline * 0.05);

    gasoline[SCHEDULE_SUMMARY.LINE_4][2] = { // line 4, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_4][2],
      value: line4Value // Line 3 x 5%
    };

    const line6Value = Math.floor(line4Value * 0.05); // Line 4 x 5%
    let line6Label = gasoline[SCHEDULE_SUMMARY.LINE_6][0].value;
    if (line6Value > 0) {
      line6Label = line6Label.replace('Line 4)', `Line 4 is ${formatNumeric(line6Value, 0)} L)`);
    }

    gasoline[SCHEDULE_SUMMARY.LINE_6][0] = { // line 6, 1st column
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][0],
      valueViewer: () => (
        <span>{line6Label}</span>
      )
    };

    gasoline[SCHEDULE_SUMMARY.LINE_6][2] = { // line 6, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][2],
      attributes: {
        ...gasoline[SCHEDULE_SUMMARY.LINE_6][2].attributes,
        maxValue: line6Value
      }
    };

    let line8Label = gasoline[SCHEDULE_SUMMARY.LINE_8][0].value;
    if (line6Value > 0) {
      line8Label = line8Label.replace('Line 4)', `Line 4 is ${formatNumeric(line6Value, 0)} L)`);
    }

    gasoline[SCHEDULE_SUMMARY.LINE_8][0] = { // line 8, 1st column
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][0],
      valueViewer: () => (
        <span>{line8Label}</span>
      )
    };

    gasoline[SCHEDULE_SUMMARY.LINE_8][2] = { // line 8, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][2],
      attributes: {
        ...gasoline[SCHEDULE_SUMMARY.LINE_8][2].attributes,
        maxValue: line6Value
      }
    };

    gasoline[SCHEDULE_SUMMARY.LINE_5][2] = { // line 5, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_5][2],
      value: netGasolineClassTransferred
    };

    if (summary.gasolineClassDeferred) {
      gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = summary.gasolineClassDeferred;
    }

    if (summary.gasolineClassPreviouslyRetained) {
      gasoline[SCHEDULE_SUMMARY.LINE_7][2].value = summary.gasolineClassPreviouslyRetained;
    }

    if (summary.gasolineClassRetained) {
      gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = summary.gasolineClassRetained;
    }

    if (summary.gasolineClassObligation) {
      gasoline[SCHEDULE_SUMMARY.LINE_9][2].value = summary.gasolineClassObligation;
    }

    gasoline[SCHEDULE_SUMMARY.LINE_10][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_10][2],
      value: ScheduleSummaryContainer.calculateGasolineTotal(gasoline)
    };

    gasoline[SCHEDULE_SUMMARY.LINE_11][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_11][2],
      value: ScheduleSummaryContainer.calculateGasolinePayable(gasoline)
    };

    return gasoline;
  }

  _calculatePart3 () {
    const { part3 } = this.state;
    let { penalty } = this.state;
    const { summary } = this.props.scheduleState;

    let totalCredits = 0;
    let totalDebits = 0;
    if (this.props.recomputedTotals.scheduleB) {
      ({ totalCredits, totalDebits } = this.props.recomputedTotals.scheduleB);
    }

    if (summary.creditsOffset) {
      part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset;
    }

    part3[SCHEDULE_SUMMARY.LINE_23][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_23][2],
      value: Math.round(totalCredits)
    };

    part3[SCHEDULE_SUMMARY.LINE_24][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_24][2],
      value: -1 * Math.round(totalDebits)
    };

    const netTotal = totalCredits - totalDebits;

    part3[SCHEDULE_SUMMARY.LINE_25][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_25][2],
      value: Math.round(netTotal)
    };

    let maxValue = '';

    if (netTotal < 0) {
      const { organizationBalance } = this.props.loggedInUser.organization;
      maxValue = Math.round(netTotal * -1);

      if (organizationBalance.validatedCredits < maxValue) {
        maxValue = organizationBalance.validatedCredits;
      }

      let previousReductionTotal = 0;
      if (this.props.complianceReport.totalPreviousCreditReduction) {
        previousReductionTotal = this.props.complianceReport.totalPreviousCreditReduction;
      }

      maxValue += previousReductionTotal;
    }

    part3[SCHEDULE_SUMMARY.LINE_26][2] = {
      ...part3[SCHEDULE_SUMMARY.LINE_26][2],
      readOnly: (netTotal >= 0 || this.props.readOnly),
      attributes: {
        ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
        maxValue
      }
    };

    penalty[SCHEDULE_PENALTY.LINE_28][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_28][2],
      value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
    };

    penalty = this._calculateNonCompliancePayable(penalty);

    this.setState({
      ...this.state,
      part3,
      penalty
    });

    return part3;
  }

  _calculateNonCompliancePayable (penalty) {
    const grid = penalty;
    let total = 0;

    if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_11][2].value)) {
      total += Number(grid[SCHEDULE_PENALTY.LINE_11][2].value);
    }

    if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_22][2].value)) {
      total += Number(grid[SCHEDULE_PENALTY.LINE_22][2].value);
    }

    if (!Number.isNaN(grid[SCHEDULE_PENALTY.LINE_28][2].value)) {
      total += Number(grid[SCHEDULE_PENALTY.LINE_28][2].value);
    }

    grid[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2] = {
      ...grid[SCHEDULE_PENALTY.TOTAL_NON_COMPLIANCE][2],
      value: total
    };

    if (total > 0) {
      this.props.showPenaltyWarning(true);
    } else {
      this.props.showPenaltyWarning(false);
    }

    return grid;
  }

  _closeModal () {
    this.setState({
      ...this.state,
      showModal: false
    });
  }

  populateSchedules () {
    if (this.props.complianceReport.hasSnapshot && this.props.snapshot && this.props.readOnly) {
      return;
    }

    if (!this.props.scheduleState.summary) {
      return;
    }

    if (Object.keys(this.props.recomputedTotals).length === 0) {
      return;
    }

    let {
      diesel,
      gasoline,
      part3,
      penalty
    } = this.state;

    diesel = this._calculateDiesel();
    gasoline = this._calculateGasoline();
    part3 = this._calculatePart3();

    penalty[SCHEDULE_PENALTY.LINE_11][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_11][2],
      value: ScheduleSummaryContainer.calculateGasolinePayable(gasoline)
    };

    penalty[SCHEDULE_PENALTY.LINE_22][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_22][2],
      value: ScheduleSummaryContainer.calculateDieselPayable(diesel)
    };

    penalty[SCHEDULE_PENALTY.LINE_28][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_28][2],
      value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
    };

    gasoline[SCHEDULE_SUMMARY.LINE_6][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_6][2],
      readOnly: gasoline[SCHEDULE_SUMMARY.LINE_2][2].value <=
        gasoline[SCHEDULE_SUMMARY.LINE_4][2].value || this.props.readOnly
    };

    gasoline[SCHEDULE_SUMMARY.LINE_8][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_8][2],
      readOnly: gasoline[SCHEDULE_SUMMARY.LINE_4][2].value <=
        gasoline[SCHEDULE_SUMMARY.LINE_2][2].value || this.props.readOnly
    };

    gasoline[SCHEDULE_SUMMARY.LINE_7][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_7][2],
      readOnly: gasoline[SCHEDULE_SUMMARY.LINE_7][2].readOnly || this.props.readOnly
    };

    gasoline[SCHEDULE_SUMMARY.LINE_9][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_9][2],
      readOnly: gasoline[SCHEDULE_SUMMARY.LINE_9][2].readOnly || this.props.readOnly
    };

    diesel[SCHEDULE_SUMMARY.LINE_17][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_17][2],
      readOnly: diesel[SCHEDULE_SUMMARY.LINE_13][2].value <=
        diesel[SCHEDULE_SUMMARY.LINE_15][2].value || this.props.readOnly
    };

    diesel[SCHEDULE_SUMMARY.LINE_19][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_19][2],
      readOnly: diesel[SCHEDULE_SUMMARY.LINE_15][2].value <=
        diesel[SCHEDULE_SUMMARY.LINE_13][2].value || this.props.readOnly
    };

    diesel[SCHEDULE_SUMMARY.LINE_18][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_18][2],
      readOnly: diesel[SCHEDULE_SUMMARY.LINE_18][2].readOnly || this.props.readOnly
    };

    diesel[SCHEDULE_SUMMARY.LINE_20][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_20][2],
      readOnly: diesel[SCHEDULE_SUMMARY.LINE_20][2].readOnly || this.props.readOnly
    };

    penalty = this._calculateNonCompliancePayable(penalty);

    this.setState({
      ...this.state,
      diesel,
      gasoline,
      part3,
      penalty
    });
  }

  _handleCellsChanged (gridName, changes, addition = null) {
    let grid = this.state[gridName].map(row => [...row]);
    let { penalty } = this.state;

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

      if (gridName === 'part3' && row === SCHEDULE_SUMMARY.LINE_26) {
        const numericValue = Number(String(value).replace(/,/g, ''));
        grid[row][col] = {
          ...grid[row][col],
          value: numericValue
        };

        grid = ScheduleSummaryContainer.calculatePart3Payable(grid);

        penalty[SCHEDULE_PENALTY.LINE_28][2] = {
          ...penalty[SCHEDULE_PENALTY.LINE_28][2],
          value: grid[SCHEDULE_SUMMARY.LINE_28][2].value
        };

        penalty = this._calculateNonCompliancePayable(penalty);
      }
    });

    if (gridName === 'diesel') {
      grid[SCHEDULE_SUMMARY.LINE_21][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_21][2],
        value: ScheduleSummaryContainer.calculateDieselTotal(grid)
      };

      grid[SCHEDULE_SUMMARY.LINE_22][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_22][2],
        value: ScheduleSummaryContainer.calculateDieselPayable(grid)
      };
    }

    if (gridName === 'gasoline') {
      grid[SCHEDULE_SUMMARY.LINE_10][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_10][2],
        value: ScheduleSummaryContainer.calculateGasolineTotal(grid)
      };

      grid[SCHEDULE_SUMMARY.LINE_11][2] = {
        ...grid[SCHEDULE_SUMMARY.LINE_11][2],
        value: ScheduleSummaryContainer.calculateGasolinePayable(grid)
      };
    }

    switch (gridName) {
      case 'diesel':
        this._gridStateToPayload({
          [gridName]: grid,
          gasoline: this.state.gasoline,
          part3: this.state.part3
        });
        break;
      case 'gasoline':
        this._gridStateToPayload({
          [gridName]: grid,
          diesel: this.state.diesel,
          part3: this.state.part3
        });
        break;
      case 'part3':
        this._gridStateToPayload({
          [gridName]: grid,
          diesel: this.state.diesel,
          gasoline: this.state.gasoline
        });
        break;
      default:
    }

    this.setState({
      [gridName]: grid,
      penalty
    });
  }

  _handleDieselChanged (changes, addition = null) {
    this._handleCellsChanged('diesel', changes, addition);
  }

  _handleGasolineChanged (changes, addition = null) {
    this._handleCellsChanged('gasoline', changes, addition);
  }

  _handlePart3Changed (changes, addition = null) {
    this._handleCellsChanged('part3', changes, addition);
  }

  _gridStateToPayload (state) {
    let shouldUpdate = false;
    const compareOn = [
      'dieselClassDeferred', 'dieselClassRetained',
      'dieselClassPreviouslyRetained', 'dieselClassObligation',
      'gasolineClassDeferred', 'gasolineClassRetained',
      'gasolineClassPreviouslyRetained', 'gasolineClassObligation',
      'creditsOffset'
    ];

    const nextState = {
      summary: {
        dieselClassDeferred: state.diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
        dieselClassObligation: state.diesel[SCHEDULE_SUMMARY.LINE_20][2].value,
        dieselClassPreviouslyRetained: state.diesel[SCHEDULE_SUMMARY.LINE_18][2].value,
        dieselClassRetained: state.diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
        gasolineClassDeferred: state.gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
        gasolineClassObligation: state.gasoline[SCHEDULE_SUMMARY.LINE_9][2].value,
        gasolineClassPreviouslyRetained: state.gasoline[SCHEDULE_SUMMARY.LINE_7][2].value,
        gasolineClassRetained: state.gasoline[SCHEDULE_SUMMARY.LINE_6][2].value,
        creditsOffset: state.part3[SCHEDULE_SUMMARY.LINE_26][2].value
      }
    };

    const prevState = this.props.scheduleState.summary ? this.props.scheduleState.summary : null;
    if (prevState == null) {
      shouldUpdate = true;
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const field of compareOn) {
        if (prevState[field] !== nextState.summary[field]) {
          if (!(prevState[field] == null && typeof nextState.summary[field] === typeof undefined)) {
            shouldUpdate = true;
            break;
          }
        }
      }
    }

    if (shouldUpdate) {
      this.props.updateScheduleState({
        summary: nextState.summary
      });
    }
  }

  render () {
    if (!this.props.snapshot &&
      (Object.keys(this.props.recomputedTotals).length === 0 &&
        Object.keys(this.props.validationMessages).length === 0)) {
      return (<Loading />);
    }

    if (this.props.recomputing) {
      return (<Loading />);
    }

    return ([
      <ScheduleSummaryPage
        diesel={this.state.diesel}
        gasoline={this.state.gasoline}
        handleDieselChanged={this._handleDieselChanged}
        handleGasolineChanged={this._handleGasolineChanged}
        handlePart3Changed={this._handlePart3Changed}
        key="summary-page"
        part3={this.state.part3}
        penalty={this.state.penalty}
        readOnly={this.props.readOnly}
        valid={this.props.valid}
        validating={this.props.validating}
        validationMessages={this.props.validationMessages}
      />,
      <CallableModal
        cancelLabel={Lang.BTN_OK}
        close={() => {
          this._closeModal();
        }}
        id="warning"
        key="warning"
        show={this.state.showModal}
      >
        <p>
          The values you previously entered in the Summary &amp; Declaration tab have been cleared
          as a result of making subsequent changes within the schedules.
        </p>
        <p>
          It is recommended you complete this section after all schedules are complete.
        </p>
      </CallableModal>
    ]);
  }
}

ScheduleSummaryContainer.defaultProps = {
  complianceReport: null,
  period: null,
  recomputedTotals: {},
  snapshot: null
};

ScheduleSummaryContainer.propTypes = {
  recomputedTotals: PropTypes.shape(),
  recomputeRequest: PropTypes.func.isRequired,
  recomputing: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.string
    ]),
    hasSnapshot: PropTypes.bool,
    history: PropTypes.arrayOf(PropTypes.shape()),
    scheduleA: PropTypes.shape(),
    scheduleB: PropTypes.shape(),
    scheduleC: PropTypes.shape(),
    summary: PropTypes.shape({
      totalPetroleumDiesel: PropTypes.number,
      totalPetroleumGasoline: PropTypes.number,
      totalRenewableDiesel: PropTypes.number,
      totalRenewableGasoline: PropTypes.number,
      dieselClassDeferred: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      dieselClassRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassDeferred: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      gasolineClassRetained: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ]),
      creditsOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ])
    }),
    totalPreviousCreditReduction: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }),
  creditCalculation: PropTypes.shape({
    isFetching: PropTypes.bool,
    item: PropTypes.shape({
      carbonIntensityLimit: PropTypes.shape({
        diesel: PropTypes.number,
        gasoline: PropTypes.number
      }),
      defaultCarbonIntensity: PropTypes.number,
      energyDensity: PropTypes.number,
      energyEffectivenessRatio: PropTypes.shape({
        diesel: PropTypes.number,
        gasoline: PropTypes.number
      }),
      fuelCodes: PropTypes.arrayOf(PropTypes.shape({
        fuelCode: PropTypes.string,
        fuelCodeVersion: PropTypes.number,
        fuelCodeVersionMinor: PropTypes.number,
        id: PropTypes.number
      }))
    }),
    success: PropTypes.bool
  }).isRequired,
  getCreditCalculation: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  scheduleState: PropTypes.shape({
    scheduleA: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleC: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleD: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    summary: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  showPenaltyWarning: PropTypes.func.isRequired,
  snapshot: PropTypes.shape({
    scheduleA: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleB: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleC: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    scheduleD: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    }),
    summary: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }),
  updateScheduleState: PropTypes.func.isRequired,
  validationMessages: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  creditCalculation: {
    isFetching: state.rootReducer.creditCalculation.isFetching,
    item: state.rootReducer.creditCalculation.item,
    success: state.rootReducer.creditCalculation.success
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = dispatch => ({
  getCreditCalculation: bindActionCreators(getCreditCalculation, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSummaryContainer);
