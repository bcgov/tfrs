import PropTypes from 'prop-types';
import React from 'react';
import Draggable from 'react-draggable';

const ScheduleATotals = (props) => {
  const formatNumber = (value) => {
    if (value === 0) {
      return '-';
    }

    return value.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Draggable>
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
          <div className="col-md-12">
            <h4>Gasoline Class</h4>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-md-offset-1">
            <label htmlFor="gasoline-received">Received (L)</label>
          </div>
          <div className="col-md-5 value">{formatNumber(props.totals.gasoline.received)}</div>
        </div>

        <div className="row">
          <div className="col-md-6 col-md-offset-1">
            <label htmlFor="gasoline-transferred">Transferred (L)</label>
          </div>
          <div className="col-md-5 value">{formatNumber(props.totals.gasoline.transferred)}</div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h4>Diesel Class</h4>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-md-offset-1">
            <label htmlFor="gasoline-received">Received (L)</label>
          </div>
          <div className="col-md-5 value">{formatNumber(props.totals.diesel.received)}</div>
        </div>

        <div className="row">
          <div className="col-md-6 col-md-offset-1">
            <label htmlFor="gasoline-transferred">Transferred (L)</label>
          </div>
          <div className="col-md-5 value">{formatNumber(props.totals.diesel.transferred)}</div>
        </div>
      </div>
    </Draggable>
  );
};

ScheduleATotals.propTypes = {
  totals: PropTypes.shape({
    diesel: PropTypes.shape({
      received: PropTypes.number,
      transferred: PropTypes.number
    }),
    gasoline: PropTypes.shape({
      received: PropTypes.number,
      transferred: PropTypes.number
    })
  }).isRequired
};

export default ScheduleATotals;
