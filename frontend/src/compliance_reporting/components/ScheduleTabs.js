import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ScheduleTabs = (props) => {
  const urls = {
    intro: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'intro'),
    scheduleA: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-a'),
    scheduleB: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-b'),
    scheduleC: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-c'),
    scheduleD: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-d'),
    ScheduleSummary: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-summary'),
    scheduleAssessment: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-assessment'),
    ScheduleChangelog: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'changelog'),
    snapshot: COMPLIANCE_REPORTING.SNAPSHOT.replace(':id', props.id)
  };

  let showAssessment = false;
  if (props.complianceReport && ['Accepted'].indexOf(props.complianceReport.status.directorStatus) >= 0) {
    showAssessment = true;
  } else if (props.complianceReport &&
    props.complianceReport.history &&
    props.complianceReport.history.find(h =>
      (['Accepted'].indexOf(h.status.directorStatus) >= 0))
  ) {
    // at least one prior version was accepted
    showAssessment = true;
  }

  if (props.loggedInUser.isGovernmentUser &&
    (['Recommended', 'Not Recommended'].indexOf(props.complianceReport.status.analystStatus) >= 0 ||
      ['Recommended', 'Not Recommended'].indexOf(props.complianceReport.status.managerStatus) >= 0)) {
    showAssessment = true;
  }

  return (
    <ul className="schedule-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
        className={`${(props.active === 'intro') && 'active'}`}
      >
        <Link id="navbar-introduction" to={urls.intro}>
          Introduction
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-a') && 'active'}`}
      >
        <Link id="navbar-schedule-a" to={urls.scheduleA}>
          Schedule A
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-b') && 'active'}`}
      >
        <Link id="navbar-schedule-b" to={urls.scheduleB}>
          Schedule B
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-c') && 'active'}`}
      >
        <Link id="navbar-schedule-c" to={urls.scheduleC}>
          Schedule C
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-d') && 'active'}`}
      >
        <Link id="navbar-schedule-d" to={urls.scheduleD}>
          Schedule D
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-summary') && 'active'}`}
      >
        <Link id="navbar-summary" to={urls.ScheduleSummary}>
          Summary &amp; Declaration
        </Link>
      </li>
      {showAssessment &&
      <li
        role="presentation"
        className={`${(props.active === 'schedule-assessment') && 'active'}`}
      >
        <Link id="navbar-assessment" to={urls.scheduleAssessment}>
          Assessment
        </Link>
      </li>
      }
      <li
        role="presentation"
        className={`${(props.active === 'changelog') && 'active'}`}
      >
        <Link id="schedules-changelog" to={urls.ScheduleChangelog}>
          Report History
        </Link>
      </li>
    </ul>

  );
};

ScheduleTabs.defaultProps = {
  compliancePeriod: null,
  complianceReport: null,
  hasSnapshot: false,
  id: null
};

ScheduleTabs.propTypes = {
  active: PropTypes.string.isRequired,
  compliancePeriod: PropTypes.string,
  complianceReport: PropTypes.shape({
    status: PropTypes.shape()
  }),
  id: PropTypes.string,
  hasSnapshot: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default ScheduleTabs;
