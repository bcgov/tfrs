import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ScheduleTabs = props => (
  <ul className="schedule-tabs nav nav-tabs" role="tablist">
    <li
      role="presentation"
      className={`${(props.active === 'intro') && 'active'}`}
    >
      <Link id="navbar-administration" to={COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod)}>
        Introduction
      </Link>
    </li>
    <li
      role="presentation"
      className={`${(props.active === 'schedule-a') && 'active'}`}
    >
      <Link id="navbar-administration" to={COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod)}>
        Schedule A
      </Link>
    </li>
    <li
      role="presentation"
      className={`${(props.active === 'schedule-b') && 'active'}`}
    >
      <Link id="navbar-administration" to={COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod)}>
        Schedule B
      </Link>
    </li>
    <li
      role="presentation"
      className={`${(props.active === 'schedule-c') && 'active'}`}
    >
      <Link id="navbar-administration" to={COMPLIANCE_REPORTING.ADD_SCHEDULE_C.replace(':period?', props.compliancePeriod)}>
        Schedule C
      </Link>
    </li>
  </ul>
);

ScheduleTabs.defaultProps = {
};

ScheduleTabs.propTypes = {
  active: PropTypes.string.isRequired,
  compliancePeriod: PropTypes.string.isRequired
};

export default ScheduleTabs;
