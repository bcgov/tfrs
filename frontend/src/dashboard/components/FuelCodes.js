import React from 'react';

const FuelCodes = props => (
  <div className="dashboard-fieldset">
    <h1>Fuel Codes</h1>
    There are:

    <div>
      <div className="value">
        2
      </div>
      <div className="content">
        <h2>fuel codes in progress:</h2>

        <div><a href="">2 awaiting Director review and statutory decision</a></div>
      </div>
    </div>

    <div>
      <div className="content offset-value">
        <a href="">See all fuel codes</a>
      </div>
    </div>
  </div>
);

FuelCodes.defaultProps = {
};

FuelCodes.propTypes = {
};

export default FuelCodes;
