/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import DeltasDisplay from './components/ReportHistory'
import Loading from '../app/components/Loading'

class ChangelogContainer extends Component {
  constructor (props) {
    super(props)
    this.state = this._recomputeDerivedStateFromProps(props)
  }

  componentDidMount () {
    if (this.props.snapshot) {
      this.componentWillReceiveProps(this.props)
    } else if (this.props.complianceReport && !this.props.complianceReport.hasSnapshot) {
      this.props.recomputeRequest()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this._recomputeDerivedStateFromProps(nextProps))
  }

  _recomputeDerivedStateFromProps (nextProps) {
    if (nextProps.recomputedTotals.deltas) {
      return { deltas: nextProps.recomputedTotals.deltas }
    } else if (nextProps.complianceReport.deltas) {
      return { deltas: nextProps.complianceReport.deltas }
    }

    return { deltas: null }
  }

  render () {
    if (!this.props.valid) {
      return (<p>Please fix validation issues in other schedules</p>)
    }

    if (this.props.recomputing || this.props.isValidating) {
      return (<Loading />)
    }

    if (this.state.deltas) {
      return (
        <DeltasDisplay
          snapshot={this.props.snapshot}
          complianceReport={this.props.complianceReport}
          recomputedTotals={this.props.recomputedTotals}
          deltas={this.state.deltas}
        />)
    }

    return (<Loading />)
  }
}

ChangelogContainer.defaultProps = {
  recomputedTotals: null,
  snapshot: null
}

ChangelogContainer.propTypes = {
  complianceReport: PropTypes.shape({
    hasSnapshot: PropTypes.bool
  }).isRequired,
  isValidating: PropTypes.bool.isRequired,
  recomputeRequest: PropTypes.func.isRequired,
  recomputing: PropTypes.bool.isRequired,
  recomputedTotals: PropTypes.shape(),
  snapshot: PropTypes.shape()
}

const mapStateToProps = state => ({})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ChangelogContainer)
