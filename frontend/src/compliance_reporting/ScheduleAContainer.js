/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fuelClasses } from '../actions/fuelClasses';
import { notionalTransferTypes } from '../actions/notionalTransferTypes';
import Input from '../app/components/Spreadsheet/Input';
import OrganizationAutocomplete from '../app/components/Spreadsheet/OrganizationAutocomplete';
import Select from '../app/components/Spreadsheet/Select';
import SchedulesPage from './components/SchedulesPage';
import { SCHEDULE_A } from '../constants/schedules/scheduleColumns';

class ScheduleAContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          className: 'row-number',
          readOnly: true
        }, {
          className: 'organization',
          readOnly: true,
          value: 'Legal Name of Trading Partner'
        }, {
          className: 'address',
          readOnly: true,
          value: 'Postal Address'
        }, {
          className: 'fuel-class',
          readOnly: true,
          value: 'Fuel Class'
        }, {
          className: 'transfer-type',
          readOnly: true,
          value: 'Received OR Transferred'
        }, {
          className: 'quantity',
          readOnly: true,
          value: 'Quantity (L)'
        }] // header
      ],
      totals: {
        diesel: {
          received: 0,
          transferred: 0
        },
        gasoline: {
          received: 0,
          transferred: 0
        }
      }
    };
  }

  constructor (props) {
    super(props);

    this.state = ScheduleAContainer.addHeaders();
    this.rowNumber = 1;

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this.loadInitialState = this.loadInitialState.bind(this);
  }

  componentDidMount () {
    this.props.loadFuelClasses();
    this.props.loadNotionalTransferTypes();

    if (this.props.scheduleState.scheduleA) {
      // we already have the state. don't load it. just render it.
    } else if (!this.props.complianceReport.scheduleA) {
      this._addRow(5);
    } else  {
      this.loadInitialState();
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { grid } = this.state;

    if (nextProps.scheduleState.scheduleA && nextProps.scheduleState.scheduleA.records) {
      if ((grid.length - 1) < nextProps.scheduleState.scheduleA.records.length) {
        this._addRow(nextProps.scheduleState.scheduleA.records.length - (grid.length - 1));
      }

      for (let i = 0; i < nextProps.scheduleState.scheduleA.records.length; i += 1) {
        const record = nextProps.scheduleState.scheduleA.records[i];

        const qty = Number(record.quantity);

        grid[1 + i][SCHEDULE_A.LEGAL_NAME].value = record.tradingPartner;
        grid[1 + i][SCHEDULE_A.POSTAL_ADDRESS].value = record.postalAddress;
        grid[1 + i][SCHEDULE_A.FUEL_CLASS].value = record.fuelClass;
        grid[1 + i][SCHEDULE_A.TRANSFER_TYPE].value = record.transferType;
        grid[1 + i][SCHEDULE_A.QUANTITY].value = Number.isNaN(qty) ? '' : qty;
      }
    }

    this.setState({
      grid
    });
  }

  loadInitialState () {
    this.rowNumber = 1;

    const records = [];

    for (let i = 0; i < this.props.complianceReport.scheduleA.records.length; i += 1) {
      records.push({ ...this.props.complianceReport.scheduleA.records[i] });
      this.props.updateScheduleState({
        scheduleA: {
          records
        }
      });
    }
  }

  _addRow (numberOfRows = 1) {
    const { grid } = this.state;

    for (let x = 0; x < numberOfRows; x += 1) {
      grid.push([{
        readOnly: true,
        value: this.rowNumber
      }, {
        attributes: {},
        className: 'text',
        dataEditor: OrganizationAutocomplete
      }, {
        className: 'text'
      }, {
        className: 'text',
        dataEditor: Select,
        getOptions: () => !this.props.fuelClasses.isFetching &&
          this.props.fuelClasses.items,
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, {
        className: 'text',
        dataEditor: Select,
        getOptions: () => !this.props.notionalTransferTypes.isFetching &&
          this.props.notionalTransferTypes.items,
        mapping: {
          key: 'id',
          value: 'theType'
        }
      }, {
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
      }]);

      this.rowNumber += 1;
    }

    this.setState({
      grid
    });
  }

  _calculateTotal (grid) {
    const totals = {
      diesel: {
        received: 0,
        transferred: 0
      },
      gasoline: {
        received: 0,
        transferred: 0
      }
    };

    for (let x = 1; x < grid.length; x += 1) {
      let value = Number(grid[x][SCHEDULE_A.QUANTITY].value);
      const fuelClass = grid[x][SCHEDULE_A.FUEL_CLASS].value;
      const transferType = grid[x][SCHEDULE_A.TRANSFER_TYPE].value;

      if (Number.isNaN(value)) {
        value = 0;
      }

      if (fuelClass === 'Gasoline' && transferType === 'Received') {
        totals.gasoline.received += value;
      } else if (fuelClass === 'Gasoline' && transferType === 'Transferred') {
        totals.gasoline.transferred += value;
      } else if (fuelClass === 'Diesel' && transferType === 'Received') {
        totals.diesel.received += value;
      } else if (fuelClass === 'Diesel' && transferType === 'Transferred') {
        totals.diesel.transferred += value;
      }
    }

    this.setState({
      totals
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

      if (col === SCHEDULE_A.QUANTITY) {
        grid[row][col] = {
          ...grid[row][col],
          value: value.replace(/,/g, '')
        };
      }

      if (col === SCHEDULE_A.LEGAL_NAME) {
        if (cell.attributes.address) {
          grid[row][SCHEDULE_A.POSTAL_ADDRESS] = {
            ...grid[row][SCHEDULE_A.POSTAL_ADDRESS],
            value: `${cell.attributes.address.address_line_1} ${cell.attributes.address.address_line_2} ${cell.attributes.address.address_line_3} ${cell.attributes.address.city}, ${cell.attributes.address.state} ${cell.attributes.address.postal_code}`
          };
        }
      }
    });

    this.setState({
      grid
    });

    this._gridStateToPayload({
      grid
    });

    this._calculateTotal(grid);
  }

  _gridStateToPayload (state) {
    const startingRow = 1;

    const records = [];

    for (let i = startingRow; i < state.grid.length; i += 1) {
      const row = state.grid[i];
      const record = {
        tradingPartner: row[SCHEDULE_A.LEGAL_NAME].value,
        postalAddress: row[SCHEDULE_A.POSTAL_ADDRESS].value,
        fuelClass: row[SCHEDULE_A.FUEL_CLASS].value,
        quantity: row[SCHEDULE_A.QUANTITY].value,
        transferType: row[SCHEDULE_A.TRANSFER_TYPE].value
      };

      const rowIsEmpty = !(record.tradingPartner || record.postalAddress ||
        record.fuelClass || record.quantity || record.transferType);

      if (!rowIsEmpty) {
        records.push(record);
      }
    }

    this.props.updateScheduleState({
      scheduleA: {
        records
      }
    });
  }

  render () {
    return ([
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        scheduleType="schedule-a"
        title="Schedule A - Notional Transfers of Renewable Fuel"
        totals={this.state.totals}
      >
        <p>
          Under section 5.1 of the Act, a fuel supplier may transfer renewable fuel supplied in
          excess of the required volume for that fuel class. Fuel suppliers may also receive the
          excess renewable content supplied by another fuel supplier and apply that volume of
          renewable fuel to meet their own renewable requirement.
        </p>
        <p>
          For each fuel supplier that you notionally transferred fuel to, or notionally received
          fuel from, you must report the fuel supplier name, address, contact information and the
          total volumes notionally transferred to, and/or received from that supplier. Volumes
          &quot;transferred to&quot; are those volumes notionally transferred by you to another
          supplier listed in the Schedule. Volumes &quot;received from&quot; are those volumes
          notionally received by you from another supplier listed in the Schedule.
        </p>
      </SchedulesPage>
    ]);
  }
}

ScheduleAContainer.defaultProps = {
  complianceReport: null
};

ScheduleAContainer.propTypes = {
  fuelClasses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  loadFuelClasses: PropTypes.func.isRequired,
  loadNotionalTransferTypes: PropTypes.func.isRequired,
  notionalTransferTypes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  complianceReport: PropTypes.shape({
    scheduleA: PropTypes.shape()
  }),
  period: PropTypes.string.isRequired,
  scheduleState: PropTypes.shape({
    scheduleA: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape())
    })
  }).isRequired,
  updateScheduleState: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAContainer);
