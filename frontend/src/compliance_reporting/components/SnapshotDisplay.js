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

  static _decimalViewer(digits = 2) {
    return (cell) => Number(cell.value).toFixed(digits);
  }

  static _build_schedule_a_grid(snapshot) {
    let grid = [
      [{
        value: 'Legal Name of Trading Partner',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Postal Address',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Fuel Class',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Received OR Transferred',
        className: 'header underlined',
        disableEvents: true
      }, {
        value: 'Quantity (L)',
        className: 'header underlined',
        disableEvents: true
      }]
    ];

    if (snapshot.scheduleA) {
      snapshot.scheduleA.records.forEach(r => {
        grid.push(
          [
            {value: r.tradingPartner, readOnly: true},
            {value: r.postalAddress, readOnly: true},
            {value: r.fuelClass, readOnly: true},
            {value: r.transferType, readOnly: true},
            {value: r.quantity, readOnly: true}
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
        className: 'header underlined'
      }, {
        value: 'Fuel Class',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Provision Of The Act',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Fuel Code',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Quantity Supplied',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Units',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'CI Limit',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'CI Fuel',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Energy Density',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'EER',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Energy',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Credits',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Debits',
        disableEvents: true,
        className: 'header underlined'
      }]
    ];

    if (snapshot.scheduleB) {
      snapshot.scheduleB.records.forEach(r => {
        grid.push(
          [
            {value: r.fuelType, readOnly: true},
            {value: r.fuelClass, readOnly: true},
            {value: r.provisionOfTheAct, readOnly: true},
            {value: r.fuelCode, readOnly: true},
            {value: r.quantity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.units, readOnly: true},
            {value: r.ciLimit, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.effectiveCarbonIntensity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.energyDensity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.eer, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.energyContent, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.credits, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer(2)},
            {value: r.debits, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer(2)}
          ]
        )
      })
      grid.push(
        [
          {
            value: 'Totals',
            className: 'strong',
            colSpan: 11,
            readOnly: true
          },
          {
            value: snapshot.scheduleB.totalCredits,
            readOnly: true,
            valueViewer: SnapshotDisplay._decimalViewer(0)
          },
          {
            value: snapshot.scheduleB.totalDebits,
            readOnly: true,
            valueViewer: SnapshotDisplay._decimalViewer(0)
          },
        ]
      )
    }

    return grid;
  }

  static _build_schedule_c_grid(snapshot) {
    let grid = [
      [{
        value: 'Fuel Type',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Fuel Class',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Quantity',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Expected Use',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Rationale',
        disableEvents: true,
        className: 'header underlined'
      }]
    ];

    if (snapshot.scheduleC) {
      snapshot.scheduleC.records.forEach(r => {
        grid.push(
          [
            {value: r.fuelType, readOnly: true},
            {value: r.fuelClass, readOnly: true},
            {value: r.quantity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer()},
            {value: r.expectedUse, readOnly: true},
            {value: r.rationale, readOnly: true}
          ]
        )
      })
    }

    return grid;
  }

  static _build_schedule_d_grid(snapshot, i) {
    let grid = [];
    const sheet = snapshot.scheduleD.sheets[i];
    grid.push(
      [
        {
          value: 'Parameters',
          disableEvents: true,
          colSpan: 5,
          className: 'header underlined'
        }
      ]
    );
    grid.push(
      [
        {
          value: 'Fuel Class',
          disableEvents: true,
          colSpan: 3,
          className: 'strong'
        },
        {
          value: sheet.fuelClass,
          colSpan: 2,
          readOnly: true,
        }
      ],
      [
        {
          value: 'Fuel Type',
          disableEvents: true,
          colSpan: 3,
          className: 'strong'
        },
        {
          value: sheet.fuelType,
          colSpan: 2,
          readOnly: true,
        }
      ]
      , [
        {
          value: 'Feedstock',
          disableEvents: true,
          colSpan: 3,
          className: 'strong'
        },
        {
          value: sheet.feedstock,
          colSpan: 2,
          readOnly: true,
        }
      ]
    );

    grid.push(
      [
        {
          value: 'Inputs',
          disableEvents: true,
          colSpan: 5,
          className: 'header'
        }
      ]
      ,
      [{
        value: 'Worksheet',
        disableEvents: true,
        className: 'header underlined', readOnly: true
      }, {
        value: 'Cell',
        disableEvents: true,
        className: 'header underlined', readOnly: true
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined', readOnly: true
      }, {
        value: 'Units',
        disableEvents: true,
        className: 'header underlined', readOnly: true
      }, {
        value: 'Description',
        disableEvents: true,
        className: 'header underlined', readOnly: true
      }]
    );

    sheet.inputs.forEach(r => {
      grid.push(
        [
          {value: r.worksheetName, readOnly: true},
          {value: r.cell, readOnly: true},
          {value: r.value, readOnly: true},
          {value: r.units, readOnly: true},
          {value: r.description, readOnly: true}
        ]
      )
    });

    grid.push(
      [
        {
          value: 'Outputs',
          disableEvents: true,
          colSpan: 5,
          className: 'header'
        }
      ]
      ,
      [{
        value: 'Output',
        disableEvents: true,
        className: 'header underlined',
        colSpan: 3
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined',
        colSpan: 2
      }]
    );
    sheet.outputs.forEach(r => {
      grid.push(
        [
          {
            value: r.description,
            readOnly: true,
            className: 'strong',
            colSpan: 3
          },
          {
            value: r.intensity,
            readOnly: true,
            colSpan: 2,
            valueViewer: SnapshotDisplay._decimalViewer(2)
          }
        ]
      )
    });

    return grid;
  }

  render() {
    const {snapshot} = this.props;

    if (!snapshot) {
      return (<p>???</p>);
    }

    return (

      [<div>
        <h1>Compliance Report for {this.props.snapshot.compliancePeriod.description}</h1>
        <h3>{this.props.snapshot.organization.name}</h3>
        <h3>Submitted: {this.props.snapshot.timestamp}</h3>
        <hr/>

      </div>,

        <div>
          {snapshot.scheduleA &&
          <div>
            <h1 className="schedule-header">Schedule A</h1>
            <hr/>
            < ReactDataSheet
              key="snapshot-a"
              className={`spreadsheet snapshot_a`}
              data={SnapshotDisplay._build_schedule_a_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleB &&
          <div>
            <h1 className="schedule-header">Schedule B</h1>
            <hr/>
            < ReactDataSheet
              key="snapshot-b"
              className={`spreadsheet snapshot_b`}
              data={SnapshotDisplay._build_schedule_b_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleC &&
          <div>
            <h1 className="schedule-header">Schedule C</h1>
            <hr/>
            < ReactDataSheet
              key="snapshot-c"
              className={`spreadsheet snapshot_c`}
              data={SnapshotDisplay._build_schedule_c_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleD &&
          <div>
            <h1 className="schedule-header">Schedule D</h1>
            <hr/>
            {snapshot.scheduleD.sheets.map((s, i) => (
              <div key={`snapshot-d-${i}`}>
                <h2>Fuel {i + 1}</h2>
                <ReactDataSheet
                  className={`spreadsheet snapshot_d`}
                  data={SnapshotDisplay._build_schedule_d_grid(snapshot, i)}
                  valueRenderer={cell => cell.value}
                />
              </div>
            ))
            }
          </div>
          }
        </div>
      ]
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
