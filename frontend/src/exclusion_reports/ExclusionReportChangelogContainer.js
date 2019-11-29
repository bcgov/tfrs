/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { complianceReporting } from '../actions/complianceReporting';
import ReportHistory from './components/ReportHistory';

class ExclusionReportChangelogContainer extends Component {
  componentDidMount () {
  }

  render () {
    return (
      <ReportHistory
        deltas={this.props.exclusionReport.deltas}
        exclusionReport={this.props.exclusionReport}
        snapshot={this.props.snapshot}
      />
    );
  }
}

ExclusionReportChangelogContainer.defaultProps = {
  snapshot: null
};

ExclusionReportChangelogContainer.propTypes = {
  exclusionReport: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired,
  snapshot: PropTypes.shape()
};

const mapStateToProps = state => ({
  loading: state.rootReducer.complianceReporting.isGettingSnapshot,
  snapshot: state.rootReducer.complianceReporting.snapshotItem
});

const mapDispatchToProps = {
  getSnapshotRequest: complianceReporting.getSnapshot
};

export default connect(mapStateToProps, mapDispatchToProps)(ExclusionReportChangelogContainer);
