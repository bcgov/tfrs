/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../app/components/Loading';
import ExclusionAssessmentPage from './components/ExclusionAssessmentPage';

const ExclusionAssessmentContainer = (props) => {
  if (!props.snapshot) {
    return <Loading />;
  }

  return (
    <ExclusionAssessmentPage
      exclusionReport={props.exclusionReport}
      loggedInUser={props.loggedInUser}
      snapshot={props.snapshot}
    />
  );
};

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
