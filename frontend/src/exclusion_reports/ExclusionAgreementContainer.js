/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { transactionTypes } from '../actions/transactionTypes';
import Input from '../app/components/Spreadsheet/Input';
import Select from '../app/components/Spreadsheet/Select';
import OrganizationAutocomplete from '../app/components/Spreadsheet/OrganizationAutocomplete';
import ExclusionAgreementPage from './components/ExclusionAgreementPage';
import { EXCLUSION_AGREEMENT } from '../constants/schedules/exclusionReportColumns';

class ExclusionAgreementContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          className: 'row-number',
          readOnly: true
        }, {
          className: 'transaction-type',
          readOnly: true,
          value: 'Transaction Type'
        }, {
          className: 'fuel-type',
          readOnly: true,
          value: 'Fuel Type'
        }, {
          className: 'organization',
          readOnly: true,
          value: 'Legal Name of Transaction Partner'
        }, {
          className: 'address',
          readOnly: true,
          value: 'Address of Transaction Partner'
        }, {
          className: 'quantity',
          readOnly: true,
          value: 'Quantity'
        }, {
          className: 'units',
          readOnly: true,
          value: 'Units'
        }, {
          className: 'quantity-not-sold',
          readOnly: true,
          value: 'Quantity not sold or supplied within the Compliance Period'
        }, {
          className: 'units',
          readOnly: true,
          value: 'Units'
        }] // header
      ]
    };
  }

  constructor (props) {
    super(props);

    this.state = ExclusionAgreementContainer.addHeaders();
    this.rowNumber = 1;

    this._addRow = this._addRow.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount () {
    this.props.loadTransactionTypes();

    if (this.props.exclusionReport.exclusionAgreement &&
      this.props.exclusionReport.exclusionAgreement.records &&
      this.props.exclusionReport.exclusionAgreement.records.length >= 0) {
      this.loadData();
    } else {
      this._addRow(5);
    }
  }

  loadData () {
    const { grid } = this.state;
    this._addRow(this.props.exclusionReport.exclusionAgreement.records.length);

    this.props.exclusionReport.exclusionAgreement.records.forEach((record, recordIndex) => {
      const index = recordIndex + 1;

      grid[index][EXCLUSION_AGREEMENT.TRANSACTION_TYPE] = {
        ...grid[index][EXCLUSION_AGREEMENT.TRANSACTION_TYPE],
        value: record.transactionType
      };

      grid[index][EXCLUSION_AGREEMENT.FUEL_TYPE] = {
        ...grid[index][EXCLUSION_AGREEMENT.FUEL_TYPE],
        value: record.fuelType
      };

      grid[index][EXCLUSION_AGREEMENT.LEGAL_NAME] = {
        ...grid[index][EXCLUSION_AGREEMENT.LEGAL_NAME],
        value: record.transactionPartner
      };

      grid[index][EXCLUSION_AGREEMENT.ADDRESS] = {
        ...grid[index][EXCLUSION_AGREEMENT.ADDRESS],
        value: record.postalAddress
      };

      grid[index][EXCLUSION_AGREEMENT.QUANTITY] = {
        ...grid[index][EXCLUSION_AGREEMENT.QUANTITY],
        value: record.quantity
      };

      grid[index][EXCLUSION_AGREEMENT.QUANTITY_NOT_SOLD] = {
        ...grid[index][EXCLUSION_AGREEMENT.QUANTITY_NOT_SOLD],
        value: record.quantityNotSold
      };

      const selectedFuel = this.props.referenceData.approvedFuels.find(fuel =>
        fuel.name === record.fuelType);

      grid[index][EXCLUSION_AGREEMENT.UNITS].value = (selectedFuel && selectedFuel.unitOfMeasure)
        ? selectedFuel.unitOfMeasure.name : '';

      grid[index][EXCLUSION_AGREEMENT.NOT_SOLD_UNITS].value = (selectedFuel &&
        selectedFuel.unitOfMeasure) ? selectedFuel.unitOfMeasure.name : '';
    });

    this.setState({
      grid
    });
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.state;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{
        readOnly: true,
        value: this.rowNumber
      }, {
        className: 'text',
        dataEditor: Select,
        getOptions: () => !this.props.transactionTypes.isFetching &&
          this.props.transactionTypes.items,
        mapping: {
          key: 'id',
          value: 'theType'
        }
      }, { // fuel type
        className: 'text',
        dataEditor: Select,
        getOptions: () => this.props.referenceData.approvedFuels.filter(fuel => (
          fuel.creditCalculationOnly === false
        )),
        mapping: {
          key: 'id',
          value: 'name'
        }
      }, { // legal name of transaction partner
        attributes: {},
        className: 'text',
        dataEditor: OrganizationAutocomplete
      }, { // address
        className: 'text'
      }, { // quantity
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          step: '1'
        },
        className: 'number',
        dataEditor: Input,
        valueViewer: (props) => {
          const { value } = props;
          return <span>{value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
        }
      }, { // units
        attributes: {},
        className: 'units',
        readOnly: true
      }, { // quantity
        attributes: {
          addCommas: true,
          dataNumberToFixed: 0,
          maxLength: '20',
          step: '1'
        },
        className: 'number',
        dataEditor: Input,
        valueViewer: (props) => {
          const { value } = props;
          return <span>{value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>;
        }
      }, { // units
        attributes: {},
        className: 'units',
        readOnly: true
      }]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
    });
  }

  _gridStateToPayload (state) {
    const startingRow = 1;

    const records = [];

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i];
      const record = {
        fuelType: row[EXCLUSION_AGREEMENT.FUEL_TYPE].value,
        postalAddress: row[EXCLUSION_AGREEMENT.ADDRESS].value,
        quantity: row[EXCLUSION_AGREEMENT.QUANTITY].value,
        quantityNotSold: row[EXCLUSION_AGREEMENT.QUANTITY_NOT_SOLD].value,
        transactionPartner: row[EXCLUSION_AGREEMENT.LEGAL_NAME].value,
        transactionType: row[EXCLUSION_AGREEMENT.TRANSACTION_TYPE].value
      };

      const rowIsEmpty = !(record.transactionType || record.fuelType || record.legalName ||
        record.address || record.quantity || record.quantityNotSold);

      if (!rowIsEmpty) {
        records.push(record);
      }
    }

    this.props.updateScheduleState({
      exclusionAgreement: {
        records
      }
    });
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

      if (col === EXCLUSION_AGREEMENT.FUEL_TYPE) {
        const selectedFuel = this.props.referenceData.approvedFuels.find(fuel =>
          fuel.name === value);

        grid[row][EXCLUSION_AGREEMENT.UNITS].value = (selectedFuel && selectedFuel.unitOfMeasure)
          ? selectedFuel.unitOfMeasure.name : '';

        grid[row][EXCLUSION_AGREEMENT.NOT_SOLD_UNITS].value = (selectedFuel &&
          selectedFuel.unitOfMeasure) ? selectedFuel.unitOfMeasure.name : '';
      }

      if (col === EXCLUSION_AGREEMENT.LEGAL_NAME) {
        if (cell.attributes.address) {
          grid[row][EXCLUSION_AGREEMENT.ADDRESS] = {
            ...grid[row][EXCLUSION_AGREEMENT.ADDRESS],
            value: `${cell.attributes.address.address_line_1} ${cell.attributes.address.address_line_2} ${cell.attributes.address.address_line_3} ${cell.attributes.address.city}, ${cell.attributes.address.state} ${cell.attributes.address.postal_code}`
          };
        }
      }

      if (col === EXCLUSION_AGREEMENT.QUANTITY || col === EXCLUSION_AGREEMENT.QUANTITY_NOT_SOLD) {
        const cleanedValue = Number(value.replace(/,/g, ''));
        grid[row][col] = {
          ...grid[row][col],
          value: Number.isNaN(cleanedValue) ? '' : cleanedValue
        };
      }
    });

    this.setState({
      grid
    });

    this._gridStateToPayload({
      grid
    });
  }

  render () {
    return ([
      <ExclusionAgreementPage
        addRow={this._addRow}
        data={this.state.grid}
        handleCellsChanged={this._handleCellsChanged}
        key="spreadsheet"
        title="Exclusion Report"
        totals={this.state.totals}
      >
        <p>
          Report all Part 3 fuels either purchased or sold under an exclusion agreement within
          this Compliance Period. <br />
          <b>This report does not apply to petroleum-based gasoline or petroleum-based diesel.</b>
        </p>
      </ExclusionAgreementPage>
    ]);
  }
}

ExclusionAgreementContainer.defaultProps = {
  loadedState: null
};

ExclusionAgreementContainer.propTypes = {
  create: PropTypes.bool.isRequired,
  exclusionReport: PropTypes.shape({
    exclusionAgreement: PropTypes.shape({
      records: PropTypes.arrayOf()
    })
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  loadedState: PropTypes.any,
  loadTransactionTypes: PropTypes.func.isRequired,
  period: PropTypes.string.isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  transactionTypes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  transactionTypes: {
    isFetching: state.rootReducer.transactionTypes.isFinding,
    items: state.rootReducer.transactionTypes.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
  loadTransactionTypes: transactionTypes.find
};

export default connect(mapStateToProps, mapDispatchToProps)(ExclusionAgreementContainer);
