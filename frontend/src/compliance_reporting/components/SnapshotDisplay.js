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
        value: 'Legal Name of Trading Partner'
      }, {
        value: 'Postal Address'
      }, {
        value: 'Fuel Class'
      }, {
        value: 'Received OR Transferred'
      }, {
        value: 'Quantity (L)'
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
        value: 'Fuel Type'
      }, {
        value: 'Fuel Class'
      }, {
        value: 'Provision Of The Act'
      }, {
        value: 'Fuel Code'
      }, {
        value: 'Quantity Supplied'
      }, {
        value: 'Units'
      }, {
        value: 'CI Limit'
      }, {
        value: 'CI Fuel'
      }, {
        value: 'Energy Density'
      }, {
        value: 'EER'
      }, {
        value: 'Energy'
      }, {
        value: 'Credits'
      }, {
        value: 'Debits'
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
        value: 'Fuel Type'
      }, {
        value: 'Fuel Class'
      }, {
        value: 'Quantity'
      }, {
        value: 'Expected Use'
      }, {
        value: 'Rationale'
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
              colspan: 5
            }
          ]
          ,
          [{
            value: 'Worksheet'
          }, {
            value: 'Cell'
          }, {
            value: 'Value'
          }, {
            value: 'Units'
          }, {
            value: 'Description'
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
              colspan: 5
            }
          ]
          ,
          [{
            value: 'Output'
          }, {
            value: 'Value'
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
