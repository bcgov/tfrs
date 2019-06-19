import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ScheduleTabs = (props) => {
  let urls = {
    intro: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'intro'),
    scheduleA: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'schedule-a'),
    scheduleB: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'schedule-b'),
    scheduleC: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'schedule-c'),
    scheduleD: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'schedule-d'),
    ScheduleSummary: COMPLIANCE_REPORTING.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'schedule-summary'),
  };

  if (props.edit) {
    urls = {
      intro: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'intro'),
      scheduleA: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-a'),
      scheduleB: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-b'),
      scheduleC: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-c'),
      scheduleD: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-d'),
      ScheduleSummary: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-summary')
    };
  }

  return (
    <ul className="schedule-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
        className={`${(props.active === 'intro') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.intro}>
          Introduction
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-a') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.scheduleA}>
          Schedule A
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-b') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.scheduleB}>
          Schedule B
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-c') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.scheduleC}>
          Schedule C
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-d') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.scheduleD}>
          Schedule D
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'schedule-summary') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.ScheduleSummary}>
          Summary &amp; Declaration
        </Link>
      </li>
    </ul>
  );
};

ScheduleTabs.defaultProps = {
  compliancePeriod: null,
  id: null
};

ScheduleTabs.propTypes = {
  active: PropTypes.string.isRequired,
  compliancePeriod: PropTypes.string,
  edit: PropTypes.bool.isRequired,
  id: PropTypes.string
};

export default ScheduleTabs;
