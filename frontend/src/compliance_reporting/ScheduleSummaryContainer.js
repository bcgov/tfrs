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
import {
  calculateCredit,
  getCarbonIntensityLimit,
  getCreditCalculationValues,
  getDefaultCarbonIntensity,
  getEnergyContent,
  getEnergyEffectivenessRatio,
  getSelectedFuel,
  getSelectedProvision
} from './components/ScheduleFunctions';
import ScheduleSummaryDiesel from './components/ScheduleSummaryDiesel';
import ScheduleSummaryGasoline from './components/ScheduleSummaryGasoline';
import ScheduleSummaryPage from './components/ScheduleSummaryPage';
import ScheduleSummaryPart3 from './components/ScheduleSummaryPart3';
import ScheduleSummaryPenalty from './components/ScheduleSummaryPenalty';
import { SCHEDULE_PENALTY, SCHEDULE_SUMMARY } from '../constants/schedules/scheduleColumns';
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

  static calculateNonCompliancePayable (penalty) {
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

    return penalty;
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
    const credits = grid[SCHEDULE_SUMMARY.LINE_26][2].value;
    const balance = Number(grid[SCHEDULE_SUMMARY.LINE_25][2].value);
    let outstandingBalance = balance + Number(credits);
    let payable = outstandingBalance * -200; // negative symbol so that the product is positive

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
      diesel: new ScheduleSummaryDiesel(),
      gasoline: new ScheduleSummaryGasoline(),
      part3: new ScheduleSummaryPart3(),
      penalty: new ScheduleSummaryPenalty(),
      totals: {
        diesel: 0,
        gasoline: 0
      }
    };

    this.rowNumber = 1;

    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleDieselChanged = this._handleDieselChanged.bind(this);
    this._handleGasolineChanged = this._handleGasolineChanged.bind(this);
    this._handlePart3Changed = this._handlePart3Changed.bind(this);
    this._gridStateToPayload = this._gridStateToPayload.bind(this);
  }

  componentDidMount () {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps (nextProps, nextContext) {
    let sourceSummary = null;
    let sourceScheduleA = null;

    if (nextProps.scheduleState && nextProps.scheduleState.summary) {
      // prefer fresh state
      sourceSummary = nextProps.scheduleState.summary;
    } else if (nextProps.complianceReport && nextProps.complianceReport.summary) {
      // use server-side if not available
      sourceSummary = nextProps.complianceReport.summary;
    }

    if (nextProps.scheduleState && nextProps.scheduleState.scheduleA) {
      // prefer fresh state
      sourceScheduleA = nextProps.scheduleState.scheduleA;
    } else if (nextProps.complianceReport && nextProps.complianceReport.scheduleA) {
      // use server-side if not available
      sourceScheduleA = nextProps.complianceReport.scheduleA;
    }

    if (sourceSummary == null || sourceScheduleA == null) {
      return;
    }

    this.populateSchedules(sourceSummary, sourceScheduleA);
  }

  _calculateDiesel (summary, dieselReceived, dieselTransferred) {
    const { diesel } = this.state;
    const {
      totalPetroleumDiesel,
      totalRenewableDiesel
    } = summary;

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

    const line15Value = totalDiesel * 0.04;

    diesel[SCHEDULE_SUMMARY.LINE_15][2] = { // line 15, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_15][2],
      value: line15Value // Line 14 x 4%
    };

    const line17Value = line15Value * 0.05; // Line 15 x 5%
    let line17Label = diesel[SCHEDULE_SUMMARY.LINE_17][0].value;
    if (line17Value > 0) {
      line17Label = line17Label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 2)} L)`);
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
      line19label = line19label.replace('Line 15)', `Line 15 is ${formatNumeric(line17Value, 2)} L)`);
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
      value: dieselReceived - dieselTransferred
    };

    if (summary.dieselClassRetained) {
      diesel[SCHEDULE_SUMMARY.LINE_17][2].value = summary.dieselClassRetained;
    }

    if (summary.dieselClassDeferred) {
      diesel[SCHEDULE_SUMMARY.LINE_19][2].value = summary.dieselClassDeferred;
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

  _calculateGasoline (summary, gasolineReceived, gasolineTransferred) {
    const { gasoline } = this.state;
    const {
      totalPetroleumGasoline,
      totalRenewableGasoline
    } = summary;

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

    const line4Value = totalGasoline * 0.05;

    gasoline[SCHEDULE_SUMMARY.LINE_4][2] = { // line 4, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_4][2],
      value: line4Value // Line 3 x 5%
    };

    const line6Value = line4Value * 0.05; // Line 4 x 5%
    let line6Label = gasoline[SCHEDULE_SUMMARY.LINE_6][0].value;
    if (line6Value > 0) {
      line6Label = line6Label.replace('Line 4)', `Line 4 is ${formatNumeric(line6Value, 2)} L)`);
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
      line8Label = line8Label.replace('Line 4)', `Line 4 is ${formatNumeric(line6Value, 2)} L)`);
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
      value: gasolineReceived - gasolineTransferred
    };

    if (summary.gasolineClassDeferred) {
      gasoline[SCHEDULE_SUMMARY.LINE_8][2].value = summary.gasolineClassDeferred;
    }
    if (summary.gasolineClassRetained) {
      gasoline[SCHEDULE_SUMMARY.LINE_6][2].value = summary.gasolineClassRetained;
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

  _calculatePart3 (summary) {
    const { part3 } = this.state;
    let { penalty } = this.state;

    if (!this.props.scheduleState.scheduleB) {
      return part3;
    } else if (!this.props.complianceReport) {
      return part3;
    }

    if (summary.creditsOffset) {
      part3[SCHEDULE_SUMMARY.LINE_26][2].value = summary.creditsOffset;
    }

    const { compliancePeriod } = this.props.complianceReport;
    let { scheduleB } = this.props.complianceReport;
    const values = [];
    const promises = [];
    let totalCredits = 0;
    let totalDebits = 0;

    if (this.props.scheduleState.scheduleB) {
      ({ scheduleB } = this.props.scheduleState);
    }

    if (!scheduleB) {
      return part3;
    }

    scheduleB.records.forEach((row) => {
      const selectedFuel = getSelectedFuel(this.props.referenceData.approvedFuels, row.fuelType);

      const promise = this.props.getCreditCalculation(selectedFuel.id, {
        compliance_period_id: compliancePeriod.id
      }).then(() => {
        let creditCalculationValues = getCreditCalculationValues(
          values,
          selectedFuel.id
        );

        if (!creditCalculationValues) {
          values.push(this.props.creditCalculation.item);

          creditCalculationValues = getCreditCalculationValues(
            values,
            selectedFuel.id
          );
        }

        const carbonIntensityLimit = getCarbonIntensityLimit(
          creditCalculationValues,
          row.fuelClass
        );

        const selectedProvision = getSelectedProvision(
          selectedFuel,
          row.provisionOfTheAct
        );

        const { determinationType } = selectedProvision;

        const carbonIntensityFuel = getDefaultCarbonIntensity(
          creditCalculationValues,
          selectedFuel,
          determinationType,
          row.fuelCode
        );

        const energyEffectivenessRatio = getEnergyEffectivenessRatio(
          creditCalculationValues,
          row.fuelClass
        );

        const energyContent = getEnergyContent(
          creditCalculationValues,
          row.quantity
        );

        const credit = calculateCredit(
          carbonIntensityLimit,
          carbonIntensityFuel,
          energyEffectivenessRatio,
          energyContent
        );

        if (!Number.isNaN(credit)) {
          if (credit < 0) {
            totalDebits += credit;
          } else {
            totalCredits += credit;
          }
        }
      });

      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      part3[SCHEDULE_SUMMARY.LINE_23][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_23][2],
        value: Math.round(totalCredits)
      };

      part3[SCHEDULE_SUMMARY.LINE_24][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_24][2],
        value: Math.round(totalDebits)
      };

      const netTotal = totalCredits + totalDebits;

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
      }

      part3[SCHEDULE_SUMMARY.LINE_26][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_26][2],
        readOnly: (netTotal >= 0),
        attributes: {
          ...part3[SCHEDULE_SUMMARY.LINE_26][2].attributes,
          maxValue
        }
      };

      penalty[SCHEDULE_PENALTY.LINE_28][2] = {
        ...penalty[SCHEDULE_PENALTY.LINE_28][2],
        value: part3[SCHEDULE_SUMMARY.LINE_28][2].value
      };

      penalty = ScheduleSummaryContainer.calculateNonCompliancePayable(penalty);

      this.setState({
        ...this.state,
        part3,
        penalty
      });
    });

    return part3;
  }

  loadSchedules () {
    if (this.props.complianceReport) {
      const { scheduleA, summary } = this.props.complianceReport;

      this.populateSchedules(summary, scheduleA);
    }
  }

  populateSchedules (summary, scheduleA = null) {
    let {
      diesel,
      gasoline,
      part3,
      penalty
    } = this.state;

    let dieselReceived = 0;
    let dieselTransferred = 0;
    let gasolineReceived = 0;
    let gasolineTransferred = 0;

    if (scheduleA && scheduleA.records) {
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
    }

    diesel = this._calculateDiesel(summary, dieselReceived, dieselTransferred);
    gasoline = this._calculateGasoline(summary, gasolineReceived, gasolineTransferred);
    part3 = this._calculatePart3(summary);

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

    penalty = ScheduleSummaryContainer.calculateNonCompliancePayable(penalty);

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

        penalty = ScheduleSummaryContainer.calculateNonCompliancePayable(penalty);
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
    const compareOn = ['dieselClassDeferred', 'dieselClassRetained', 'gasolineClassDeferred', 'gasolineClassRetained', 'creditsOffset'];

    const nextState = {
      summary: {
        dieselClassDeferred: state.diesel[SCHEDULE_SUMMARY.LINE_19][2].value,
        dieselClassRetained: state.diesel[SCHEDULE_SUMMARY.LINE_17][2].value,
        gasolineClassDeferred: state.gasoline[SCHEDULE_SUMMARY.LINE_8][2].value,
        gasolineClassRetained: state.gasoline[SCHEDULE_SUMMARY.LINE_6][2].value,
        creditsOffset: state.part3[SCHEDULE_SUMMARY.LINE_26][2].value
      }
    };

    const prevState = this.props.scheduleState.summary ? this.props.scheduleState.summary : null;
    if (prevState == null) {
      shouldUpdate = true;
    } else {
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
        handlePart3Changed={this._handlePart3Changed}
        key="summary"
        part3={this.state.part3}
        penalty={this.state.penalty}
      />
    ]);
  }
}

ScheduleSummaryContainer.defaultProps = {
  complianceReport: null,
  period: null
};

ScheduleSummaryContainer.propTypes = {
  complianceReport: PropTypes.shape({
    compliancePeriod: PropTypes.shape(),
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
    })
  }),
  create: PropTypes.bool.isRequired,
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
  updateScheduleState: PropTypes.func.isRequired
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
