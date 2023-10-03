/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loading from '../app/components/Loading'
import ScheduleAssessmentPage from './components/ScheduleAssessmentPage'
import { COMPLIANCE_YEAR } from '../constants/values'

class ScheduleAssessmentContainer extends Component {
  componentDidMount () {
  }

  render () {
    if (this.props.snapshotIsLoading ||
      !this.props.complianceReport) {
      return <Loading />
    }

    // let mostRecentlyReviewed = null;

    // if (this.props.complianceReport &&
    //   ['Accepted', 'Rejected'].indexOf(this.props.complianceReport.status.directorStatus) >= 0) {
    //   mostRecentlyReviewed = this.props.snapshot;
    // } else if (this.props.complianceReport && this.props.complianceReport.history) {
    //   const historyEntry = this.props.complianceReport.history.find(h =>
    //     (['Accepted', 'Rejected'].indexOf(h.status.directorStatus) >= 0));

    //   if (historyEntry) {
    //     // at least one prior version was accepted
    //     // we have the id, now find the snapshot in deltas
    //     mostRecentlyReviewed = this.props.complianceReport.deltas.find(d =>
    //       (d.ancestorId === historyEntry.complianceReport)).snapshot.data;
    //   }
    // }

    // if (!mostRecentlyReviewed) {
    //   mostRecentlyReviewed = this.props.snapshot;
    // }

    // const snap = mostRecentlyReviewed;
    const snap = this.props.snapshot
    const { period } = this.props

    if (!snap || !snap.summary) {
      return <Loading />
    }

    let hasDirectorAssessment = false
    if (this.props.complianceReport && ['Accepted'].indexOf(this.props.complianceReport.status.directorStatus) >= 0) {
      hasDirectorAssessment = true
    } else if (this.props.complianceReport &&
      this.props.complianceReport.history &&
      this.props.complianceReport.history.find(h =>
        (['Accepted'].indexOf(h.status.directorStatus) >= 0))
    ) {
      hasDirectorAssessment = true
    }

    if (!this.props.loggedInUser.isGovernmentUser && !hasDirectorAssessment) {
      return null
    }

    let part2Compliant = 'Did not supply Part 2 fuel'
    let foundInScheduleB = false
    let foundInScheduleC = false

    if (snap.scheduleB) {
      foundInScheduleB = snap.scheduleB.records.findIndex(row => (
        [
          'Biodiesel', 'Ethanol', 'HDRD', 'Natural gas-based gasoline',
          'Petroleum-based diesel', 'Petroleum-based gasoline', 'Renewable diesel',
          'Renewable gasoline'
        ].indexOf(row.fuelType) >= 0
      )) >= 0
    }

    if (snap.scheduleC) {
      foundInScheduleC = snap.scheduleC.records.findIndex(row => (
        [
          'Biodiesel', 'Ethanol', 'HDRD', 'Natural gas-based gasoline',
          'Petroleum-based diesel', 'Petroleum-based gasoline', 'Renewable diesel',
          'Renewable gasoline'
        ].indexOf(row.fuelType) >= 0
      )) >= 0
    }

    if (foundInScheduleB || foundInScheduleC) {
      if (Number(snap.summary.lines[11]) > 0 ||
        Number(snap.summary.lines[22]) > 0) {
        part2Compliant = 'Non-compliant'
      } else {
        part2Compliant = 'Compliant'
      }
    }

    let part3Compliant = 'Compliant'

    if (period < COMPLIANCE_YEAR) {
      if (Number(snap.summary.lines[27]) < 0) {
        part3Compliant = 'Non-compliant'
      }
    } else {
      if (Number(snap.summary.lines['29C']) < 0) {
        part3Compliant = 'Non-compliant'
      }
    }

    return (
      <ScheduleAssessmentPage
        complianceReport={this.props.complianceReport}
        loggedInUser={this.props.loggedInUser}
        part2Compliant={part2Compliant}
        part3Compliant={part3Compliant}
        snapshot={snap}
      />
    )
  }
}

ScheduleAssessmentContainer.defaultProps = {
  snapshot: null,
  snapshotIsLoading: true
}

ScheduleAssessmentContainer.propTypes = {
  complianceReport: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  snapshot: PropTypes.shape(),
  snapshotIsLoading: PropTypes.bool,
  period: PropTypes.number
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAssessmentContainer)
