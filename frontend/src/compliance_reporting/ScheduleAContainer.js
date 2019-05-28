/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import Input from './components/Input';
import OrganizationAutocomplete from './components/OrganizationAutocomplete';
import Select from './components/Select';
import SchedulesPage from './components/SchedulesPage';
import ScheduleTabs from './components/ScheduleTabs';
import ScheduleATotals from './components/ScheduleATotals';
import { getQuantity } from '../utils/functions';
import { SCHEDULE_A } from '../constants/schedules/scheduleColumns';

class ScheduleAContainer extends Component {
  static addHeaders () {
    return {
      grid: [
        [{
          readOnly: true,
          width: 50
        }, {
          readOnly: true,
          value: 'Legal Name of Trading Partner'
        }, {
          readOnly: true,
          value: 'Postal Address'
        }, {
          readOnly: true,
          value: 'Fuel Class'
        }, {
          readOnly: true,
          value: 'Received OR Transferred'
        }, {
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

    if (document.location.pathname.indexOf('/edit/') >= 0) {
      this.edit = true;
    } else {
      this.edit = false;
    }

    this._addRow = this._addRow.bind(this);
    this._calculateTotal = this._calculateTotal.bind(this);
    this._handleCellsChanged = this._handleCellsChanged.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this._addRow(2);
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
        // dataEditor: AutoSuggest
      }, {
        className: 'text',
        dataEditor: Select,
        getOptions: () => [{
          fuelClass: 'Diesel',
          id: 3
        }, {
          fuelClass: 'Gasoline',
          id: 4
        }],
        mapping: {
          key: 'id',
          value: 'fuelClass'
        }
      }, {
        className: 'text',
        dataEditor: Select,
        getOptions: () => [{
          value: 'Received'
        }, {
          value: 'Transferred'
        }],
        mapping: {
          key: 'value',
          value: 'value'
        }
      }, {
        attributes: {
          dataNumberToFixed: 2,
          maxLength: '12',
          step: '0.01'
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
    let { totals } = this.state;
    totals = {
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
          value: getQuantity(value)
        };
      }

      if (col === SCHEDULE_A.LEGAL_NAME) {
        if (cell.attributes.address) {
          grid[row][SCHEDULE_A.POSTAL_ADDRESS] = {
            ...grid[row][SCHEDULE_A.POSTAL_ADDRESS],
            value: `${cell.attributes.address.address_line_1} ${cell.attributes.address.address_line_2} ${cell.attributes.address.address_line_3} ${cell.attributes.address.city}, ${cell.attributes.address.state}`
          };
        }
      }
    });

    this.setState({
      grid
    });

    this._calculateTotal(grid);
  }

  _handleSubmit () {
    console.log(this.state.grid);
  }

  render () {
    if (!this.props.referenceData ||
    !this.props.referenceData.approvedFuels) {
      return <Loading />;
    }

    const { id } = this.props.match.params;
    let { period } = this.props.match.params;

    if (!period) {
      period = `${new Date().getFullYear() - 1}`;
    }

    return ([
      <ScheduleTabs
        active="schedule-a"
        compliancePeriod={period}
        edit={this.edit}
        id={id}
        key="nav"
      />,
      <SchedulesPage
        addRow={this._addRow}
        data={this.state.grid}
        edit={this.edit}
        handleCellsChanged={this._handleCellsChanged}
        key="schedules"
        title="Schedule A - Notional Transfers of Renewable Fuel"
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
          total volumes notionally transferred to, and/or received from that supplier.  Volumes
          &quot;transferred to&quot; are those volumes notionally transferred by you to another
          supplier listed in the Schedule.  Volumes &quot;received from&quot; are those volumes
          notionally received by you from another supplier listed in the Schedule.
        </p>
      </SchedulesPage>,
      <ScheduleATotals
        key="totals"
        totals={this.state.totals}
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

ScheduleAContainer.defaultProps = {
};

ScheduleAContainer.propTypes = {
  expectedUses: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.string
    }).isRequired
  }).isRequired,
  referenceData: PropTypes.shape({
    approvedFuels: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

const mapStateToProps = state => ({
  expectedUses: {
    isFetching: state.rootReducer.expectedUses.isFinding,
    items: state.rootReducer.expectedUses.items
  },
  referenceData: {
    approvedFuels: state.rootReducer.referenceData.data.approvedFuels
  }
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAContainer);
