import React from 'react';

const Balance = props => (
  <div className="dashboard-card">
    <h2>All Organizations</h2>
    <h1>credit balance</h1>
    <div className="value">514,805</div>
    Show transactions involving:
    <select>
      <option>All Organizations</option>
    </select>
  </div>
);

Balance.defaultProps = {
};

Balance.propTypes = {
};

export default Balance;
