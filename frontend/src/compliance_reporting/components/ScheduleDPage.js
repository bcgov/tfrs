import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const ScheduleDPage = props => ([
  <div className="scrollable" key="input">
    <ReactDataSheet
      className={`spreadsheet ${props.scheduleType} input`}
      data={props.sheet.input}
      onCellsChanged={(changes, additions) => {
        props.handleCellsChanged('input', changes, additions);
      }}
      valueRenderer={cell => cell.value}
    />
  </div>,
  <div className="scrollable" key="grid">
    <ReactDataSheet
      className={`spreadsheet ${props.scheduleType}`}
      data={props.sheet.grid}
      onCellsChanged={(changes, additions) => {
        props.handleCellsChanged('grid', changes, additions);
      }}
      valueRenderer={cell => cell.value}
    />
  </div>,

  <div className="sheet-buttons" key="buttons">
    {props.addRowEnabled &&
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
    }
  </div>,
  <div className="scrollable output" key="output">
    <ReactDataSheet
      className={`spreadsheet ${props.scheduleType} output`}
      data={props.sheet.output}
      key="output-summary"
      onCellsChanged={(changes, additions) => {
        props.handleCellsChanged('output', changes, additions);
      }}
      valueRenderer={cell => cell.value}
    />
  </div>
]);

ScheduleDPage.defaultProps = {
  addRowEnabled: true
};

ScheduleDPage.propTypes = {
  addRow: PropTypes.func.isRequired,
  addRowEnabled: PropTypes.bool,
  handleCellsChanged: PropTypes.func.isRequired,
  scheduleType: PropTypes.oneOf([
    'schedule-a', 'schedule-b', 'schedule-c', 'schedule-d'
  ]).isRequired,
  sheet: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    input: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    output: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape()))
  }).isRequired
};

export default ScheduleDPage;
