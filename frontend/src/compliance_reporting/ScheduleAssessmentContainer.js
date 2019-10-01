/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../app/components/Loading';
import ScheduleAssessmentPage from './components/ScheduleAssessmentPage';

class ScheduleAssessmentContainer extends Component {
  componentDidMount () {
  }

  render () {
    if (this.props.snapshotIsLoading || !this.props.snapshot) {
      return <Loading />;
    }

    let part2Compliant = 'Did not supply Part 2 fuel';
    let foundInScheduleB = false;
    let foundInScheduleC = false;

    if (this.props.snapshot && this.props.snapshot.scheduleB) {
      foundInScheduleB = this.props.snapshot.scheduleB.records.findIndex(row => (
        [
          'Biodiesel', 'Ethanol', 'HDRD', 'Natural gas-based gasoline',
          'Petroleum-based diesel', 'Petroleum-based gasoline', 'Renewable diesel',
          'Renewable gasoline'
        ].indexOf(row.fuelType) >= 0
      )) >= 0;
    }

    if (this.props.snapshot && this.props.snapshot.scheduleC) {
      foundInScheduleC = this.props.snapshot.scheduleC.records.findIndex(row => (
        [
          'Biodiesel', 'Ethanol', 'HDRD', 'Natural gas-based gasoline',
          'Petroleum-based diesel', 'Petroleum-based gasoline', 'Renewable diesel',
          'Renewable gasoline'
        ].indexOf(row.fuelType) >= 0
      )) >= 0;
    }

    if (foundInScheduleB || foundInScheduleC) {
      if (Number(this.props.snapshot.summary.lines[11]) > 0 ||
        Number(this.props.snapshot.summary.lines[22]) > 0) {
        part2Compliant = 'Non-compliant';
      } else {
        part2Compliant = 'Compliant';
      }
    }

    let part3Compliant = 'Compliant';

    if (Number(this.props.snapshot.summary.lines[27]) < 0) {
      part3Compliant = 'Non-compliant';
    }

    return (
      <ScheduleAssessmentPage
        complianceReport={this.props.complianceReport}
        loggedInUser={this.props.loggedInUser}
        part2Compliant={part2Compliant}
        part3Compliant={part3Compliant}
        snapshot={this.props.snapshot}
      />
    );
  }
}

ScheduleAssessmentContainer.defaultProps = {
  snapshot: null,
  snapshotIsLoading: true
};

ScheduleAssessmentContainer.propTypes = {
  complianceReport: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  snapshot: PropTypes.shape(),
  snapshotIsLoading: PropTypes.bool
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAssessmentContainer);
