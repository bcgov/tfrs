import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import SCHEDULES from '../../constants/routes/Schedules';

const ScheduleTabs = props => (
  <ul className="schedule-tabs nav nav-tabs" role="tablist">
    <li
      role="presentation"
      className={`${(props.active === 'schedule-a') && 'active'}`}
    >
      <Link id="navbar-administration" to={SCHEDULES.LIST}>
        Schedule A
      </Link>
    </li>
    <li
      role="presentation"
      className={`${(props.active === 'schedule-b') && 'active'}`}
    >
      <Link id="navbar-administration" to={SCHEDULES.LIST}>
        Schedule B
      </Link>
    </li>
    <li
      role="presentation"
      className={`${(props.active === 'schedule-c') && 'active'}`}
    >
      <Link id="navbar-administration" to={SCHEDULES.LIST}>
        Schedule C
      </Link>
    </li>
  </ul>
);

ScheduleTabs.propTypes = {
  active: PropTypes.string.isRequired
};

export default ScheduleTabs;
