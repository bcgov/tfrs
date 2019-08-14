/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';

class SnapshotDisplay extends Component {

  constructor(props) {
    super(props);
  }

  static _build_schedule_a_grid(snapshot) {
    let grid = [
      [{
        value: 'Legal Name of Trading Partner',
        className: 'header',
        disableEvents: true
      }, {
        value: 'Postal Address',
        className: 'header',
        disableEvents: true
      }, {
        value: 'Fuel Class',
        className: 'header',
        disableEvents: true
      }, {
        value: 'Received OR Transferred',
        className: 'header',
        disableEvents: true
      }, {
        value: 'Quantity (L)',
        className: 'header',
        disableEvents: true
      }]
    ];

    if (snapshot.scheduleA) {
      snapshot.scheduleA.records.forEach(r => {
        grid.push(
          [
            {value: r.tradingPartner},
            {value: r.postalAddress},
            {value: r.fuelClass},
            {value: r.transferType},
            {value: r.quantity}
          ]
        )
      })
    }

    return grid;
  }

  static _build_schedule_b_grid(snapshot) {
    let grid = [
      [{
        value: 'Fuel Type',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Fuel Class',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Provision Of The Act',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Fuel Code',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Quantity Supplied',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Units',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'CI Limit',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'CI Fuel',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Energy Density',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'EER',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Energy',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Credits',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Debits',
        disableEvents: true,
        className: 'header'
      }]
    ];

    if (snapshot.scheduleB) {
      snapshot.scheduleB.records.forEach(r => {
        grid.push(
          [
            {value: r.fuelType},
            {value: r.fuelClass},
            {value: r.provisionOfTheAct},
            {value: r.fuelCode},
            {value: r.quantity},
            {value: r.units},
            {value: r.ciLimit},
            {value: r.effectiveCarbonIntensity},
            {value: r.energyDensity},
            {value: r.eer},
            {value: r.energyContent},
            {value: r.credits},
            {value: r.debits}
          ]
        )
      })
    }

    return grid;
  }

  static _build_schedule_c_grid(snapshot) {
    let grid = [
      [{
        value: 'Fuel Type',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Fuel Class',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Quantity',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Expected Use',
        disableEvents: true,
        className: 'header'
      }, {
        value: 'Rationale',
        disableEvents: true,
        className: 'header'
      }]
    ];

    if (snapshot.scheduleC) {
      snapshot.scheduleC.records.forEach(r => {
        grid.push(
          [
            {value: r.fuelType},
            {value: r.fuelClass},
            {value: r.quantity},
            {value: r.expectedUse},
            {value: r.rationale}
          ]
        )
      })
    }

    return grid;
  }

  static _build_schedule_d_grid(snapshot) {
    let grid = [];

    if (snapshot.scheduleD) {
      for (const sheet of snapshot.scheduleD.sheets) {
        grid.push(
          [
            {
              value: 'Inputs',
              disableEvents: true,
              colspan: 5,
              className: 'header'
            }
          ]
          ,
          [{
            value: 'Worksheet',
            disableEvents: true,
            className: 'header'
          }, {
            value: 'Cell',
            disableEvents: true,
            className: 'header'
          }, {
            value: 'Value',
            disableEvents: true,
            className: 'header'
          }, {
            value: 'Units',
            disableEvents: true,
            className: 'header'
          }, {
            value: 'Description',
            disableEvents: true,
            className: 'header'
          }]
        );

        sheet.inputs.forEach(r => {
          grid.push(
            [
              {value: r.fuelType},
              {value: r.fuelClass},
              {value: r.quantity},
              {value: r.expectedUse},
              {value: r.rationale}
            ]
          )
        });

        grid.push(
          [
            {
              value: 'Outputs',
              disableEvents: true,
              colspan: 5,
              className: 'header'
            }
          ]
          ,
          [{
            value: 'Output',
            disableEvents: true,
            className: 'header'
          }, {
            value: 'Value',
            disableEvents: true,
            className: 'header'
          }]
        );
        sheet.outputs.forEach(r => {
          grid.push(
            [
              {value: r.description},
              {value: r.intensity}
            ]
          )
        });

      }

    }

    return grid;
  }

  render() {
    const {snapshot} = this.props;

    if (!snapshot) {
      return (<p>l</p>);
    }

    return (
      <div>
        {snapshot.scheduleA &&
        <ReactDataSheet
          key="snapshot-a"
          className={`spreadsheet snapshot_a`}
          data={SnapshotDisplay._build_schedule_a_grid(snapshot)}
          valueRenderer={cell => cell.value}
        />
        }
        {snapshot.scheduleB &&
        <ReactDataSheet
          key="snapshot-b"
          className={`spreadsheet snapshot_b`}
          data={SnapshotDisplay._build_schedule_b_grid(snapshot)}
          valueRenderer={cell => cell.value}
        />
        }
        {snapshot.scheduleC &&
        <ReactDataSheet
          key="snapshot-c"
          className={`spreadsheet snapshot_c`}
          data={SnapshotDisplay._build_schedule_c_grid(snapshot)}
          valueRenderer={cell => cell.value}
        />
        }
        {snapshot.scheduleD &&
        <ReactDataSheet
          key="snapshot-d"
          className={`spreadsheet snapshot_d`}
          data={SnapshotDisplay._build_schedule_d_grid(snapshot)}
          valueRenderer={cell => cell.value}
        />
        }
      </div>
    )

  }
}

SnapshotDisplay.defaultProps = {
  snapshot: null,
};

SnapshotDisplay.propTypes = {
  snapshot: PropTypes.object
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotDisplay);
