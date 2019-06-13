import PropTypes from 'prop-types';
import React from 'react';
import { SCHEDULE_D_INPUT } from '../../constants/schedules/scheduleColumns';

const ScheduleDTabs = (props) => {
  const renderTabs = (active) => {
    const elements = [];
    for (let x = props.sheets.length - 1; x >= 0; x -= 1) {
      const label = props.sheets[x].input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value || `Sheet ${x + 1}`;

      // eslint-disable-next-line function-paren-newline
      elements.push(
        <li
          className={`${(active === x) ? 'active' : ''}`}
          key={x}
          role="presentation"
        >
          <button type="button" onClick={() => props.setActiveSheet(x)}>{label}</button>
        </li>);
    }

    return elements;
  };

  return (
    <ul className="schedule-d-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
      >
        <button type="button" onClick={props.addSheet}>Add Sheet</button>
      </li>
      {renderTabs(props.active)}
    </ul>
  );
};

ScheduleDTabs.defaultProps = {
};

ScheduleDTabs.propTypes = {
  active: PropTypes.number.isRequired,
  addSheet: PropTypes.func.isRequired,
  setActiveSheet: PropTypes.func.isRequired,
  sheets: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default ScheduleDTabs;
