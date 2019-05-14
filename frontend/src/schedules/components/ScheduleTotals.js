import PropTypes from 'prop-types';
import React from 'react';

const ScheduleTotals = props => (
  <div
    className="schedule-totals"
    key="totals"
  >
    <div className="row">
      <div className="col-md-12">
        <h2>Totals</h2>
      </div>
    </div>
    <div className="row">
      <div className="col-md-7">
        <label htmlFor="gasoline-class-excluded">Gasoline Class Excluded:</label>
      </div>
      <div className="col-md-5 value">{props.gasolineTotals.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</div>
    </div>
    <div className="row">
      <div className="col-md-7">
        <label htmlFor="diesel-class-excluded">Diesel Class Excluded:</label>
      </div>
      <div className="col-md-5 value">{props.dieselTotals.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</div>
    </div>
  </div>
);

ScheduleTotals.propTypes = {
  dieselTotals: PropTypes.number.isRequired,
  gasolineTotals: PropTypes.number.isRequired
};

export default ScheduleTotals;
