/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'
import ComplianceReportingStatusHistory from './ComplianceReportingStatusHistory'
import ScheduleDeltas from './ScheduleDeltas'
import SnapshotDisplay from './SnapshotDisplay'

const Delta = (props) => {
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
        <ScheduleDeltas deltas={props.delta} />
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
      currentSnapshot = (this.props.recomputedTotals) || (this.props.complianceReport)
    }

    let title
    switch (String(activeReport)) {
      case '-1':
        title = this.props.complianceReport.displayName
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

        <ComplianceReportingStatusHistory
          complianceReport={this.props.complianceReport}
          onSwitchHandler={this.handleHistorySelection}
        />

        <div className="history-content panel">
          <div className="panel-body">
            <h1>{title}</h1>
            {((String(activeReport) === '-1') &&
            <Current
              snapshot={currentSnapshot}
              computedWarning={currentSnapshotComputed}
              complianceReport={this.props.complianceReport}
            />) || (deltas.map((d) => {
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
            }))
            }
          </div>
        </div>
      </div>
    )
  }
}

ReportHistory.defaultProps = {
  complianceReport: null,
  deltas: [],
  recomputedTotals: null,
  snapshot: null
}

ReportHistory.propTypes = {
  complianceReport: PropTypes.shape(),
  deltas: PropTypes.arrayOf(PropTypes.shape()),
  recomputedTotals: PropTypes.shape(),
  snapshot: PropTypes.shape()
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReportHistory)
