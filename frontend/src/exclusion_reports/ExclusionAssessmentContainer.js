/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { complianceReporting } from '../actions/complianceReporting';
import Loading from '../app/components/Loading';
import ExclusionAssessmentPage from './components/ExclusionAssessmentPage';

class ExclusionAssessmentContainer extends Component {
  componentDidMount () {
    this.props.getSnapshotRequest(this.props.match.params.id);
  }

  render () {
    if (this.props.snapshotIsLoading || !this.props.snapshot) {
      return <Loading />;
    }

    return (
      <ExclusionAssessmentPage
        exclusionReport={this.props.exclusionReport}
        loggedInUser={this.props.loggedInUser}
        snapshot={this.props.snapshot}
      />
    );
  }
}

ExclusionAssessmentContainer.defaultProps = {
  snapshot: null,
  snapshotIsLoading: true
};

ExclusionAssessmentContainer.propTypes = {
  exclusionReport: PropTypes.shape().isRequired,
  getSnapshotRequest: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired,
  snapshot: PropTypes.shape(),
  snapshotIsLoading: PropTypes.bool
};

const mapStateToProps = state => ({
  snapshot: state.rootReducer.complianceReporting.snapshotItem,
  snapshotIsLoading: state.rootReducer.complianceReporting.isGettingSnapshot,
  loading: state.rootReducer.complianceReporting.isGettingSnapshot
});

const mapDispatchToProps = {
  getSnapshotRequest: complianceReporting.getSnapshot
};

export default connect(mapStateToProps, mapDispatchToProps)(ExclusionAssessmentContainer);
