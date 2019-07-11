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
import Modal from '../app/components/Modal';
import {
  calculateCredit,
  getCarbonIntensityLimit,
  getCreditCalculationValues,
  getDefaultCarbonIntensity,
  getEnergyEffectivenessRatio,
  getSelectedFuel,
  getSelectedProvision,
  getEnergyContent
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

    total += grid[SCHEDULE_PENALTY.LINE_11][2].value;
    total += grid[SCHEDULE_PENALTY.LINE_22][2].value;
    total += grid[SCHEDULE_PENALTY.LINE_28][2].value;

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

  static calculatePart3Payable (part3, credits = 0) {
    const grid = part3;
    const balance = Number(grid[SCHEDULE_SUMMARY.LINE_25][2].value);
    let outstandingBalance = balance + Number(credits);
    let payable = outstandingBalance * -200; // negative symbole so that the product is positive

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
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    if (this.props.loadedState) {
      // this.restoreFromAutosaved();
    } else if (!this.props.create) {
      this.loadSchedules();
    }
  }

  _calculatePart3 () {
    let { part3, penalty } = this.state;

    if (!this.props.complianceReport) {
      return part3;
    }

    const { compliancePeriod, scheduleB } = this.props.complianceReport;
    const values = [];
    const promises = [];
    let totalCredits = 0;
    let totalDebits = 0;

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

        if (credit < 0) {
          totalDebits += credit;
        } else {
          totalCredits += credit;
        }
      });

      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      part3[SCHEDULE_SUMMARY.LINE_23][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_23][2],
        value: totalCredits
      };

      part3[SCHEDULE_SUMMARY.LINE_24][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_24][2],
        value: totalDebits
      };

      const netTotal = totalCredits + totalDebits;

      part3[SCHEDULE_SUMMARY.LINE_25][2] = {
        ...part3[SCHEDULE_SUMMARY.LINE_25][2],
        value: netTotal
      };

      let maxValue = '';

      if (netTotal < 0) {
        const { organizationBalance } = this.props.loggedInUser.organization;
        maxValue = (netTotal * -1).toFixed(0);

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

      part3 = ScheduleSummaryContainer.calculatePart3Payable(part3);

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
    const { scheduleA, summary } = this.props.complianceReport;

    this.populateSchedules(summary, scheduleA);
  }

  populateSchedules (summary, scheduleA = null) {
    const { diesel, gasoline } = this.state;
    let { part3, penalty } = this.state;

    part3 = this._calculatePart3();

    const {
      totalPetroleumDiesel,
      totalPetroleumGasoline,
      totalRenewableDiesel,
      totalRenewableGasoline
    } = summary;

    let totalDiesel = 0;
    let totalGasoline = 0;

    diesel[SCHEDULE_SUMMARY.LINE_12][2] = { // line 12, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_12][2],
      value: totalPetroleumDiesel
    };

    if (totalPetroleumDiesel) {
      totalDiesel += totalPetroleumDiesel;
    }

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

    gasoline[SCHEDULE_SUMMARY.LINE_5][2] = { // line 5, 3rd column
      ...gasoline[SCHEDULE_SUMMARY.LINE_5][2],
      value: gasolineReceived - gasolineTransferred
    };

    diesel[SCHEDULE_SUMMARY.LINE_16][2] = { // line 5, 3rd column
      ...diesel[SCHEDULE_SUMMARY.LINE_16][2],
      value: dieselReceived - dieselTransferred
    };

    gasoline[SCHEDULE_SUMMARY.LINE_10][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_10][2],
      value: ScheduleSummaryContainer.calculateGasolineTotal(gasoline)
    };

    gasoline[SCHEDULE_SUMMARY.LINE_11][2] = {
      ...gasoline[SCHEDULE_SUMMARY.LINE_11][2],
      value: ScheduleSummaryContainer.calculateGasolinePayable(gasoline)
    };

    penalty[SCHEDULE_PENALTY.LINE_11][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_11][2],
      value: ScheduleSummaryContainer.calculateGasolinePayable(gasoline)
    };

    diesel[SCHEDULE_SUMMARY.LINE_21][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_21][2],
      value: ScheduleSummaryContainer.calculateDieselTotal(diesel)
    };

    diesel[SCHEDULE_SUMMARY.LINE_22][2] = {
      ...diesel[SCHEDULE_SUMMARY.LINE_22][2],
      value: ScheduleSummaryContainer.calculateDieselPayable(diesel)
    };

    penalty[SCHEDULE_PENALTY.LINE_22][2] = {
      ...penalty[SCHEDULE_PENALTY.LINE_22][2],
      value: ScheduleSummaryContainer.calculateDieselPayable(diesel)
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
        grid = ScheduleSummaryContainer.calculatePart3Payable(grid, value);
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

  _handlePart3Changed (changes, addition = null) {
    this._handleCellsChanged('part3', changes, addition);
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
        handlePart3Changed={this._handlePart3Changed}
        key="summary"
        part3={this.state.part3}
        penalty={this.state.penalty}
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
    compliancePeriod: PropTypes.shape(),
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
  loadedState: PropTypes.shape(),
  loggedInUser: PropTypes.shape().isRequired,
  period: PropTypes.string,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
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
