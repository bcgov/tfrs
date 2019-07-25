/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { transactionTypes } from '../actions/transactionTypes';
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
    this._addRow(5);
  }

  loadData () {
    this.rowNumber = 1;
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
      }, {
        attributes: {},
        className: 'text',
        dataEditor: OrganizationAutocomplete
      }, {
        className: 'text'
      }, {
        attributes: {},
        className: 'text'
      }, {
        attributes: {},
        className: 'text'
      }, {
        attributes: {},
        className: 'text'
      }, {
        attributes: {},
        className: 'text'
      }]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
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

      if (col === EXCLUSION_AGREEMENT.LEGAL_NAME) {
        if (cell.attributes.address) {
          grid[row][EXCLUSION_AGREEMENT.ADDRESS] = {
            ...grid[row][EXCLUSION_AGREEMENT.ADDRESS],
            value: `${cell.attributes.address.address_line_1} ${cell.attributes.address.address_line_2} ${cell.attributes.address.address_line_3} ${cell.attributes.address.city}, ${cell.attributes.address.state} ${cell.attributes.address.postal_code}`
          };
        }
      }
    });

    this.setState({
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
  }).isRequired
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
