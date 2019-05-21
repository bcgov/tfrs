import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ScheduleTabs = (props) => {
  let urls = {
    intro: COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod),
    scheduleA: COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod),
    scheduleB: COMPLIANCE_REPORTING.ADD.replace(':period?', props.compliancePeriod),
    scheduleC: COMPLIANCE_REPORTING.ADD_SCHEDULE_C.replace(':period?', props.compliancePeriod)
  };

  if (props.edit) {
    urls = {
      intro: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id),
      scheduleA: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id),
      scheduleB: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id),
      scheduleC: COMPLIANCE_REPORTING.EDIT_SCHEDULE_C.replace(':id', props.id)
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
