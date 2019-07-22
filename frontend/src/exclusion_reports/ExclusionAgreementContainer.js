/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ExclusionAgreementPage from './components/ExclusionAgreementPage';

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
          className: 'transaction-partner',
          readOnly: true,
          value: 'Legal Name and Address of Transaction Partner'
        }, {
          className: 'quantity',
          readOnly: true,
          value: 'Quantity'
        }, {
          className: 'units',
          readOnly: true,
          value: 'Units'
        }, {
          className: 'quantity',
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
  // eslint-disable-next-line react/forbid-prop-types
  loadedState: PropTypes.any,
  create: PropTypes.bool.isRequired,
  period: PropTypes.string.isRequired,
  updateScheduleState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ExclusionAgreementContainer);
