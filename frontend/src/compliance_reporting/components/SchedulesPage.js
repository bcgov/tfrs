import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ScheduleButtons from './ScheduleButtons';

const SchedulesPage = props => (
  <div className="page_schedule">
    <h1>{props.title}</h1>

    {props.children}

    <ReactDataSheet
      className="schedule"
      data={props.data}
      onCellsChanged={props.handleCellsChanged}
      valueRenderer={cell => cell.value}
    />

    <div className="sheet-buttons">
      <div className="btn-group">
        <button
          className="btn btn-default left"
          onClick={() => {
            props.addRow();
          }}
          type="button"
        >
          <FontAwesomeIcon icon="plus" /> Add Row
        </button>
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="caret" />
          <span className="sr-only">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu">
          {[2, 5, 10].map(numberOfRows => (
            <li key={numberOfRows}>
              <button
                onClick={() => {
                  props.addRow(numberOfRows);
                }}
                type="button"
              >
                Add {numberOfRows} Rows
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <ScheduleButtons
      edit={props.edit}
      submit
    />
  </div>
);

SchedulesPage.defaultProps = {
};

SchedulesPage.propTypes = {
  addRow: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  edit: PropTypes.bool.isRequired,
  handleCellsChanged: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default SchedulesPage;
