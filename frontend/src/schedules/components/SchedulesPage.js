import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const SchedulesPage = props => (
  <div className="page_schedule">
    <ReactDataSheet
      className="schedule"
      data={props.data}
      onCellsChanged={props.handleCellsChanged}
      valueRenderer={cell => cell.value}
    />
    <div className="sheet-buttons">
      <button
        className="btn btn-primary"
        data-target="#confirmSubmit"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="save" /> Save
      </button>
      <button
        className="btn btn-default left"
        onClick={() => {
          props.addRow();
        }}
        type="button"
      >
        <FontAwesomeIcon icon="plus" /> Add Row
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
