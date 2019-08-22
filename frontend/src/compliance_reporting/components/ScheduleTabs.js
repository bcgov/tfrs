import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';

import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ScheduleTabs = (props) => {
  const urls = {
    intro: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'intro'),
    scheduleA: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-a'),
    scheduleB: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-b'),
    scheduleC: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-c'),
    scheduleD: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-d'),
    ScheduleSummary: COMPLIANCE_REPORTING.EDIT.replace(':id', props.id).replace(':tab', 'schedule-summary'),
    snapshot: COMPLIANCE_REPORTING.SNAPSHOT.replace(':id', props.id)
  };

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
      {props.hasSnapshot &&
      <li>
        <button
          className="btn btn-default"
          type="button"
          onClick={() => {
            history.push(urls.snapshot)
          }}
        >
          <FontAwesomeIcon icon="camera"/> Submission Snapshot
        </button>
      </li>
      }
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
  id: PropTypes.string,
  hasSnapshot: PropTypes.bool.isRequired
};

export default ScheduleTabs;
