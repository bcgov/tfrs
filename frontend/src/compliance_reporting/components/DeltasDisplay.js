/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactJson from 'react-json-view';
import Select from "../../app/components/Spreadsheet/Select";
import ComplianceReportingStatusHistory from "./ComplianceReportingStatusHistory";
import SnapshotDisplay from "./SnapshotDisplay";

class Delta extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'snapshot'
    }
  }

  render() {
    const valueRenderer = row => {
      if (row.value === null) {
        return (<em>null</em>)
      }
      if (row.value instanceof Object) {
        return (
          <ReactJson
            src={row.value}
            theme="grayscale:inverted"
            iconStyle="triangle"
            style={{
              fontFamily: ['Source Code Pro', 'monospace'],
              fontSize: '10px'
            }}
            displayDataTypes={false}
            enableClipboard={false}
            sortKeys
          />
        )
      }
      return (<span>{row.value}</span>);
    };

    const columns =
      [
        {
          id: 'field',
          Header: 'Field',
          accessor: item => {
            let result;
            if (Number.isInteger(item.field)) {
              result = '[' + item.field + ']';
            } else {
              result = '.' + item.field
            }
            if (item.path !== null && item.path !== '') {
              return item.path + result;
            } else {
              return item.field;
            }
          },
        },
        {
          id: 'action',
          Header: 'Action',
          accessor: item => (item.action),
        },
        {
          id: 'oldvalue',
          Header: 'Old Value',
          accessor: item => (item.oldValue),
          Cell: valueRenderer
        },
        {
          id: 'newvalue',
          Header: 'New Value',
          accessor: item => (item.newValue),
          Cell: valueRenderer
        },
        {
          id: 'delta',
          Header: 'Delta',
          accessor: item => {
            const ov = Number.parseFloat(item.oldValue);
            const nv = Number.parseFloat(item.newValue);
            if (Number.isNaN(ov) || Number.isNaN(nv)) {
              return 'N/A'
            }
            return nv - ov;

          }
        }
      ];

    let content = null;
    switch (this.state.activeTab) {
      case 'snapshot':
        content = (
          <SnapshotDisplay
            snapshot={this.props.snapshot.data}
            showHeaders={false}
            computedWarning={this.props.snapshot.computed}
          />);

        break;
      case 'delta':
        content = (
          (this.props.delta.length === 0) &&
          <p>No changes</p> ||
          <ReactTable
            columns={columns}
            data={this.props.delta}
            filterable
            sortable
            defaultPageSize={this.props.delta.length}
          />
        );
        break;
    }
    return (
      <div>
        <ul className="delta-tabs nav nav-tabs" role="tablist">
          <li
            role="presentation"
            className={(this.state.activeTab === 'snapshot' ? 'active' : '')}
          >
            <a href='#' onClick={() => this.setState({activeTab: 'snapshot'})}>Snapshot</a>
          </li>
          <li
            role="presentation"
            className={(this.state.activeTab === 'delta' ? 'active' : '')}
          >
            <a href='#' onClick={() => this.setState({activeTab: 'delta'})}>Differences
              ({this.props.delta ? this.props.delta.length : 0})</a>
          </li>
        </ul>
        <div>
          {content}
        </div>
      </div>
    )
  }
}

class Current extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'snapshot'
    };
  }

  render() {

    let content = null;

    switch (this.state.activeTab) {
      case 'snapshot':
        content = (
          <SnapshotDisplay
            snapshot={this.props.snapshot}
            computedWarning={this.props.computedWarning}
            showHeaders={false}
          />
        );
        break;
      case 'history':
        content = (
          < ComplianceReportingStatusHistory
            complianceReport={this.props.complianceReport}
            key="history"
          />
        );
        break;
    }

    return (
      <div>
        <ul className="delta-tabs nav nav-tabs" role="tablist">
          <li
            role="presentation"
            className={(this.state.activeTab === 'snapshot' ? 'active' : '')}
          >
            <a href='#' onClick={() => this.setState({activeTab: 'snapshot'})}>Snapshot</a>
          </li>
          <li
            role="presentation"
            className={(this.state.activeTab === 'history' ? 'active' : '')}
          >
            <a href='#' onClick={() => this.setState({activeTab: 'history'})}>History</a>
          </li>
        </ul>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

class DeltasDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeDelta: -1
    };
    this.handleDeltaSelection = this.handleDeltaSelection.bind(this);
  }

  handleDeltaSelection(id) {
    this.setState({
      activeDelta: id
    });

  }

  render() {
    const {deltas} = this.props;
    const {activeDelta} = this.state;

    let currentSnapshot = this.props.snapshot;
    let currentSnapshotComputed = false;
    if (!currentSnapshot) {
      currentSnapshotComputed = true;
      currentSnapshot = this.props.recomputedTotals || this.props.complianceReport;
    }

    return (
      <div id="deltas" className="deltas">

        <h1>Submission History</h1>

        <div className="history-container">
          <div className="history-list panel panel-default">
            <div className="panel-body">
              <h3>Revisions</h3>
              <ul>
                <li className={String(activeDelta) === '-1' ? "active" : ""}>
                  <a href="#" onClick={() => this.handleDeltaSelection(-1)}>
                    Current
                  </a>
                </li>
                {
                  deltas.map(d => (
                      <li key={d.ancestorId} className={String(activeDelta) === String(d.ancestorId) ? "active" : ""}>
                        <a href="#" onClick={() => this.handleDeltaSelection(d.ancestorId)}>
                          {d.ancestorDisplayName}
                        </a>
                      </li>
                    )
                  )
                }
              </ul>
            </div>
          </div>
          <div className="history-content panel">
            <div className="panel-body">
              {(String(activeDelta) === '-1') &&
              <Current snapshot={currentSnapshot}
                       computedWarning={currentSnapshotComputed}
                       complianceReport={this.props.complianceReport}
              />

              || deltas.map(d => {

                  if (String(activeDelta) === String(d.ancestorId)) {
                    return (
                      <Delta key={d.ancestorId} delta={d.delta} snapshot={d.snapshot}/>
                    )
                  } else {
                    return null;
                  }
                }
              )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeltasDisplay.defaultProps = {
  deltas: []
};

DeltasDisplay.propTypes = {
  deltas: PropTypes.array
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DeltasDisplay);
