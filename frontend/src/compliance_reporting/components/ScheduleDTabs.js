import PropTypes from 'prop-types';
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { SCHEDULE_D_INPUT, SCHEDULE_D_OUTPUT } from '../../constants/schedules/scheduleColumns';

const ScheduleDTabs = (props) => {
  const renderTabs = (active) => {
    const elements = [];

    for (let x = props.sheets.length - 1; x >= 0; x -= 1) {
      const sheet = props.sheets[x];
      const fuelType = sheet.input[1][SCHEDULE_D_INPUT.FUEL_TYPE].value;

      let label = `Fuel ${sheet.id}`;
      let carbonIntensity = sheet.output[SCHEDULE_D_OUTPUT.CARBON_INTENSITY][1].value;

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
          className={`${(active === sheet.id) ? 'active' : ''}`}
          key={sheet.id}
          role="presentation"
        >
          <div>
            <button type="button" onClick={() => props.setActiveSheet(sheet.id)}>{label}</button>
            {(active === sheet.id) &&
            <button
              className="delete"
              data-toggle="modal"
              data-target="#confirmDelete"
              type="button"
            >
              <FontAwesomeIcon icon="minus-circle" />
            </button>
            }
          </div>
        </li>);
    }

    return elements;
  };

  return (
    <ul className="schedule-d-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
      >
        <div>
          {props.addSheetEnabled &&
            <button type="button" onClick={() => props.addSheet()}>Add Fuel</button>
          }
        </div>
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
