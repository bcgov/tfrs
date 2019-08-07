import PropTypes from 'prop-types';
import React from 'react';
import {SCHEDULE_D_INPUT, SCHEDULE_D_OUTPUT} from '../../constants/schedules/scheduleColumns';

const ScheduleDTabs = (props) => {
  const renderTabs = (active) => {
    const elements = [];
    for (let x = props.sheets.length - 1; x >= 0; x -= 1) {
      const fuelType = props.sheets[x].input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value;

      let label = `Fuel ${x + 1}`;
      let carbonIntensity = props.sheets[x].output[SCHEDULE_D_OUTPUT.CARBON_INTENSITY][1].value;

      if (fuelType) {
        label = fuelType;
      }

      if (carbonIntensity) {
        carbonIntensity = Number(carbonIntensity).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        label += ` ${carbonIntensity}`;
      }

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
        {props.addSheetEnabled &&
        <button type="button" onClick={() => props.addSheet()}>Add Fuel</button>
        }
      </li>
      {renderTabs(props.active)}
    </ul>
  );
};

ScheduleDTabs.defaultProps = {
  addSheetEnabled: true
};

ScheduleDTabs.propTypes = {
  active: PropTypes.number.isRequired,
  addSheet: PropTypes.func.isRequired,
  addSheetEnabled: PropTypes.bool,
  setActiveSheet: PropTypes.func.isRequired,
  sheets: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default ScheduleDTabs;
