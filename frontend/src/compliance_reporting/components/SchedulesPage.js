import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ComplianceReportingStatusHistory from './ComplianceReportingStatusHistory';
import ScheduleATotals from './ScheduleATotals';
import ScheduleBTotals from './ScheduleBTotals';
import ValidationMessages from './ValidationMessages';

const SchedulesPage = props => (
  <div className="page_schedule spreadsheet-component">
    <div className="draggable-bounds">
      <h1>{props.title}</h1>

      {props.children}

      <ComplianceReportingStatusHistory
        complianceReport={props.complianceReport}
        key="history"
      />

      {!props.readOnly &&
      <ValidationMessages
        scheduleType={props.scheduleType}
        valid={props.valid}
        validating={props.validating}
        validationMessages={props.validationMessages}
      />
      }

      <div className="scrollable">
        <ReactDataSheet
          className={`spreadsheet ${props.scheduleType}`}
          data={props.data}
          onCellsChanged={props.handleCellsChanged}
          valueRenderer={cell => cell.value}
        />
      </div>

      {props.addRowEnabled &&
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
          <button
            aria-expanded="false"
            aria-haspopup="true"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            type="button"
          >
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
      }

      <div className="clear" />
      {props.scheduleType === 'schedule-a' &&
        <ScheduleATotals
          totals={props.totals}
        />
      }

      {props.scheduleType === 'schedule-b' &&
        <ScheduleBTotals
          totals={props.totals}
        />
      }
      <div className="clear" />
    </div>
  </div>
);

SchedulesPage.defaultProps = {
  addRowEnabled: true,
  children: null,
  totals: {},
  validationMessages: {}
};

SchedulesPage.propTypes = {
  addRow: PropTypes.func.isRequired,
  addRowEnabled: PropTypes.bool,
  complianceReport: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  handleCellsChanged: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  scheduleType: PropTypes.oneOf([
    'schedule-a', 'schedule-b', 'schedule-c', 'schedule-d'
  ]).isRequired,
  title: PropTypes.string.isRequired,
  totals: PropTypes.shape(),
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
};

export default SchedulesPage;
