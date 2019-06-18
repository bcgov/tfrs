import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import ScheduleButtons from './ScheduleButtons';

const ScheduleSummaryPage = props => (
  <div className="schedule-summary">
    <h1>Part 2 - Renewable Fuel Requirement Summary</h1>

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

    <div className="row">
      <div className="col-lg-6">
        <h1>Part 3 - Low Carbon Fuel Requirement Summary</h1>

        <ReactDataSheet
          className="schedule"
          data={props.part3}
          valueRenderer={cell => cell.value}
        />
      </div>

      <div className="col-lg-6">
        <h1>Part 2 and Part 3 Non-compliance Penalty Payable Summary</h1>

        <ReactDataSheet
          className="schedule"
          data={props.penalty}
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
  part3: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  penalty: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired
};

export default ScheduleSummaryPage;
