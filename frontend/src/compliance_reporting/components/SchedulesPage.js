import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const SchedulesPage = props => (
  <div className="page_schedule">
    <h1>{props.title}</h1>

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

    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.push(COMPLIANCE_REPORTING.LIST)}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>
      <button
        className="btn btn-primary"
        data-target="#confirmSubmit"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="save" /> Save
      </button>
    </div>
  </div>
);

SchedulesPage.defaultProps = {
};

SchedulesPage.propTypes = {
  addRow: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  handleCellsChanged: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default SchedulesPage;
