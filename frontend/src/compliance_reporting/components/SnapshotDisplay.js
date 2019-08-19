/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import moment from 'moment';

class SnapshotDisplay extends Component {

  constructor(props) {
    super(props);
  }

  static _decimalViewer(digits = 2) {
    return (cell) => Number(cell.value).toFixed(digits)
      .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
            {
              value: r.quantity,
              readOnly: true,
              valueViewer: SnapshotDisplay._decimalViewer(0)
            }
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
            {value: r.quantity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer(0)},
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
            {value: r.quantity, readOnly: true, valueViewer: SnapshotDisplay._decimalViewer(0)},
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

  static _build_summary_grid(snapshot) {
    let grid = [
      //p2 gasoline
      [{
        value: 'Part 2 - Gasoline',
        colSpan: 3,
        className: 'header'
      }],
      [{
        value: 'Line',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Information',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined'
      }],

      [
        {
          value: 'Line 1',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of petroleum-based gasoline supplied',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['1'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 2',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of gasoline class renewable fuel supplied',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['2'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 3',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Total volume of gasoline class fuel supplied (Line 1 + Line 2)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['3'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 4',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of Part 2 gasoline class renewable fuel required (5% of Line 3)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['4'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 5',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Net volume of renewable fuel notionally transferred to and received from other suppliers as reported in Schedule A',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['5'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 6',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable fuel retained (up to 5% of Line 4)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['6'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 7',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable fuel previously retained (from Line 6 of previous compliance period)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['7'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 8',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable obligation deferred (up to 5% of Line 4)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['8'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 9',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable obligation added (from Line 8 of previous compliance period)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['9'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 10',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of Line 2 + Line 5 - Line 6 + Line 7 + Line 8 - Line 9)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['10'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 11',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Gasoline class non-compliance payable (Line 4 - Line 10) x $0.30/L',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['11'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      // p2 diesel
      [{
        value: 'Part 2 - Diesel',
        colSpan: 3,
        className: 'header'
      }],

      [{
        value: 'Line',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Information',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined'
      }],
      [
        {
          value: 'Line 12',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of petroleum-based diesel supplied',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['12'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 13',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of diesel class renewable fuel supplied',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['13'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 14',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Total volume of diesel class fuel supplied (Line 12 + Line 13)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['14'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 15',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of Part 2 diesel class renewable fuel required (4% of Line 14)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['15'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 16',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Net volume of renewable fuel notionally transferred to and received from other suppliers as reported in Schedule A',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['16'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 17',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable fuel retained (up to 5% of Line 15)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['17'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 18',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable credit (from Line 17 of previous compliance report)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['18'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 19',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable obligation deferred (up to 5% of Line 15)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['19'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 20',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Volume of renewable fuel previously retained (from Line 19 of previous compliance period)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['20'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 21',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Net volume of renewable Part 2 gasoline class fuel supplied (Total of Line 13 + Line 16 - Line 17 + Line 18 + Line 19 - Line 20)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['21'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 22',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Diesel class non-compliance payable (Line 15 - Line 21) x $0.45/L',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['22'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      // p3
      [{
        value: 'Part 3 - Low Carbon Fuel Requirement Summary',
        colSpan: 3,
        className: 'header'
      }],

      [{
        value: 'Line',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Information',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined'
      }],

      [
        {
          value: 'Line 23',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Total credits from fuel supplied (from Schedule B)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['23'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 24',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Total debits from fuel supplied (from Schedule B)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['24'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 25',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Net credit or debit balance for compliance period',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['25'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 26',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Credits used to offset debits (if applicable)',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['26'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 27',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Outstanding Debit Balance',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['27'],
          valueViewer: SnapshotDisplay._decimalViewer(0),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 28',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Part 3 non-compliance penalty payable',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['28'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      // penalty
      [{
        value: 'Part 2 and Part 3 Non-compliance Penalty Payable Summary',
        colSpan: 3,
        className: 'header'
      }],
      [{
        value: 'Line',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Information',
        disableEvents: true,
        className: 'header underlined'
      }, {
        value: 'Value',
        disableEvents: true,
        className: 'header underlined'
      }],
      [
        {
          value: 'Line 11',
          readOnly: true,
          className: 'strong',
        },
        {
          value: 'Part 2 Gasoline class non-compliance payable',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['11'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 22',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Part 2 Diesel class non-compliance payable',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['22'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      [
        {
          value: 'Line 28',
          readOnly: true,
          className: 'strong'
        },
        {
          value: 'Part 3 non-compliance penalty payable',
          readOnly: true
        },
        {
          value: snapshot.summary.lines['28'],
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
      [
        {
          value: 'Total non-compliance penalty payable (Line 11 + Line 22 + Line 28)',
          readOnly: true,
          className: 'strong',
          colSpan: 2
        },
        {
          value: snapshot.summary.totalPayable,
          valueViewer: SnapshotDisplay._decimalViewer(2),
          readOnly: true
        },
      ],
    ];


    return grid;
  }

  render() {
    const {snapshot} = this.props;

    if (!snapshot) {
      return (<p>???</p>);
    }

    return (

      [<div key="headers">
        <h1>Compliance Report for {this.props.snapshot.compliancePeriod.description}</h1>
        <h3>{this.props.snapshot.organization.name}</h3>
        <h3>Submitted: {moment(this.props.snapshot.timestamp).format('YYYY-MM-DD')}</h3>
        <hr/>
      </div>,
        <div key="tables">
          {snapshot.scheduleA &&
          <div key="snapshot-a"
          >
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
          <div key="snapshot-b">
            <h1 className="schedule-header">Schedule B</h1>
            <hr/>
            < ReactDataSheet
              className={`spreadsheet snapshot_b`}
              data={SnapshotDisplay._build_schedule_b_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleC &&
          <div key="snapshot-c">
            <h1 className="schedule-header">Schedule C</h1>
            <hr/>
            < ReactDataSheet
              className={`spreadsheet snapshot_c`}
              data={SnapshotDisplay._build_schedule_c_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
          </div>
          }
          {snapshot.scheduleD &&
          <div key="snapshot-d">
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
          {(snapshot.summary && snapshot.summary.lines) &&
          <div key="snapshot-summary">
            <h1 className="schedule-header">Summary</h1>
            <hr/>
            < ReactDataSheet
              className={`spreadsheet summary`}
              data={SnapshotDisplay._build_summary_grid(snapshot)}
              valueRenderer={cell => cell.value}
            />
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
