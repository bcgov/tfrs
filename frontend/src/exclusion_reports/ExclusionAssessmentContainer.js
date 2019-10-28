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
  render () {
    if (!this.props.snapshot) {
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
  snapshot: null
};

ExclusionAssessmentContainer.propTypes = {
  exclusionReport: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }).isRequired,
  snapshot: PropTypes.shape()
};


export default (ExclusionAssessmentContainer);
