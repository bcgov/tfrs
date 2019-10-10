/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { complianceReporting } from '../actions/complianceReporting';
import ExclusionReportStatusHistory from './components/ExclusionReportStatusHistory';
import ExclusionReportSnapshotDisplay from './components/ExclusionReportSnapshopDisplay';

import Loading from '../app/components/Loading';

class ExclusionReportChangelogContainer extends Component {
  componentDidMount () {
    this.props.getSnapshotRequest(this.props.match.params.id);
  }

  render () {
    if (this.props.loading) {
      return (<Loading />);
    }

    return (
      <div>
        <ExclusionReportStatusHistory
          complianceReport={this.props.exclusionReport}
          onSwitchHandler={() => {}}
        />

        <ExclusionReportSnapshotDisplay snapshot={this.props.snapshot} />
      </div>
    );
  }
}

ExclusionReportChangelogContainer.defaultProps = {
  snapshot: null
};

ExclusionReportChangelogContainer.propTypes = {
  exclusionReport: PropTypes.shape().isRequired,
  getSnapshotRequest: PropTypes.func.isRequired,
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
