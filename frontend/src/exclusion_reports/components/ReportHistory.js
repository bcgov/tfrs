/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ReactJson from 'react-json-view'
import ExclusionReportingStatusHistory from './ExclusionReportStatusHistory'
import SnapshotDisplay from './ExclusionReportSnapshotDisplay'

const Delta = (props) => {
  const valueRenderer = (row) => {
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
    return (<span>{row.value}</span>)
  }

  const columns = [{
    id: 'field',
    Header: 'Field',
    accessor: (item) => {
      let result
      if (Number.isInteger(item.field)) {
        result = `[${item.field}]`
      } else {
        result = `.${item.field}`
      }
      if (item.path !== null && item.path !== '') {
        return item.path + result
      }

      return item.field
    }
  }, {
    id: 'action',
    Header: 'Action',
    accessor: item => (item.action)
  }, {
    id: 'oldvalue',
    Header: 'Old Value',
    accessor: item => (item.oldValue),
    Cell: valueRenderer
  }, {
    id: 'newvalue',
    Header: 'New Value',
    accessor: item => (item.newValue),
    Cell: valueRenderer
  }, {
    id: 'delta',
    Header: 'Delta',
    accessor: (item) => {
      const ov = Number.parseFloat(item.oldValue)
      const nv = Number.parseFloat(item.newValue)

      if (Number.isNaN(ov) || Number.isNaN(nv)) {
        return 'N/A'
      }

      return nv - ov
    }
  }]

  let content = null

  switch (props.activeTab) {
    case 'snapshot':
      content = (
        <SnapshotDisplay
          snapshot={props.snapshot.data}
          showHeaders={false}
          computedWarning={props.snapshot.computed}
        />)

      break
    case 'delta':
      content = (
        (props.delta.length === 0) &&
        <p>No changes</p> ||
        <ReactTable
          columns={columns}
          data={props.delta}
          filterable
          sortable
          defaultPageSize={props.delta.length}
        />
      )
      break
    default:
  }

  return (
    <div>
      {content}
    </div>
  )
}

Delta.defaultProps = {
  activeTab: '',
  delta: [],
  snapshot: null
}

Delta.propTypes = {
  activeTab: PropTypes.string,
  delta: PropTypes.arrayOf(PropTypes.shape()),
  snapshot: PropTypes.shape()
}

const Current = props => (
  <div>
    <SnapshotDisplay
      snapshot={props.snapshot}
      computedWarning={props.computedWarning}
      dirtyWarning={props.dirtyWarning}
      showHeaders={false}
    />
  </div>
)

Current.defaultProps = {
  computedWarning: false,
  snapshot: null
}

Current.propTypes = {
  computedWarning: PropTypes.bool,
  snapshot: PropTypes.shape()
}

class ReportHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeReport: -1,
      activeTab: 'snapshot'
    }
    this.handleHistorySelection = this.handleHistorySelection.bind(this)
  }

  handleHistorySelection (id, tab) {
    this.setState({
      activeReport: id,
      activeTab: tab
    })
  }

  render () {
    const { deltas } = this.props
    const { activeReport, activeTab } = this.state

    let currentSnapshot = this.props.snapshot
    let currentSnapshotComputed = false
    if (!currentSnapshot) {
      currentSnapshotComputed = true
      currentSnapshot = this.props.exclusionReport
    }

    let title
    switch (String(activeReport)) {
      case '-1':
        title = this.props.exclusionReport.displayName
        break
      default:
        try {
          title = this.props.deltas.find(x => (String(x.ancestorId) === String(activeReport))).ancestorDisplayName
        } catch (e) {
          title = 'Current Report'
        }
    }

    return (
      <div id="deltas" className="deltas">

        <h1>Report History</h1>

        <ExclusionReportingStatusHistory
          complianceReport={this.props.exclusionReport}
          onSwitchHandler={this.handleHistorySelection}
        />

        <div className="history-content panel">
          <div className="panel-body">
            <h1>{title}</h1>
            {(String(activeReport) === '-1') &&
            <Current
              snapshot={currentSnapshot}
              computedWarning={currentSnapshotComputed}
            /> || deltas.map((d) => {
              if (String(activeReport) === String(d.ancestorId)) {
                return (
                  <Delta
                    key={d.ancestorId}
                    delta={d.delta}
                    snapshot={d.snapshot}
                    activeTab={activeTab}
                  />
                )
              }

              return null
            })}
          </div>
        </div>
      </div>
    )
  }
}

ReportHistory.defaultProps = {
  deltas: [],
  exclusionReport: null,
  recomputedTotals: null,
  snapshot: null
}

ReportHistory.propTypes = {
  deltas: PropTypes.arrayOf(PropTypes.shape()),
  exclusionReport: PropTypes.shape(),
  recomputedTotals: PropTypes.shape(),
  snapshot: PropTypes.shape()
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReportHistory)
