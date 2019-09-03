import React from 'react';
import PropTypes from 'prop-types';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ComplianceReportingStatusHistory from '../../compliance_reporting/components/ComplianceReportingStatusHistory';

const ExclusionAgreementPage = props => (
  <div className="spreadsheet-component">
    <div className="draggable-bounds">
      <h1>{props.title}</h1>

      {props.children}

      <ComplianceReportingStatusHistory
        complianceReport={props.exclusionReport}
        key="history"
      />

      <div className="scrollable">
        <ReactDataSheet
          className="spreadsheet exclusion-agreement"
          data={props.data}
          onCellsChanged={props.handleCellsChanged}
          valueRenderer={cell => cell.value}
        />
      </div>

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
    </div>
  </div>
);

ExclusionAgreementPage.defaultProps = {
  children: null,
  totals: {}
};

ExclusionAgreementPage.propTypes = {
  addRow: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  exclusionReport: PropTypes.shape().isRequired,
  handleCellsChanged: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  totals: PropTypes.shape()
};

export default ExclusionAgreementPage;
