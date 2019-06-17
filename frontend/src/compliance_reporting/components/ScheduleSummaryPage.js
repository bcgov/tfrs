import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import ScheduleButtons from './ScheduleButtons';

const ScheduleSummaryPage = props => (
  <div className="schedule-summary">
    <h1>{props.title}</h1>

    <div className="row">
      <div className="col-lg-6">
        <ReactDataSheet
          className="schedule"
          data={props.gasoline}
          onCellsChanged={props.handleGasolineChanged}
          valueRenderer={cell => cell.value}
        />
      </div>

      <div className="col-lg-6">
        <ReactDataSheet
          className="schedule"
          data={props.diesel}
          onCellsChanged={props.handleDieselChanged}
          valueRenderer={cell => cell.value}
        />
      </div>
    </div>

    <div className="sticky">
      <ScheduleButtons
        edit={props.edit}
        submit
        delete
      />
    </div>
  </div>
);

ScheduleSummaryPage.defaultProps = {
  children: null
};

ScheduleSummaryPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  diesel: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  edit: PropTypes.bool.isRequired,
  gasoline: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  handleDieselChanged: PropTypes.func.isRequired,
  handleGasolineChanged: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default ScheduleSummaryPage;
