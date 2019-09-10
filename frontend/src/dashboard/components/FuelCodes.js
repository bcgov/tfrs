import React from 'react';

const FuelCodes = props => (
  <div className="dashboard-fieldset">
    <h1>Fuel Codes</h1>
    There are:

    <div className="row">
      <div className="col-xs-3 value">
        2
      </div>
      <div className="col-xs-9">
        <h2>fuel codes in progress:</h2>

        <div><a href="">2 awaiting Director review and statutory decision</a></div>
      </div>
    </div>

    <div className="row">
      <div className="col-xs-9 col-xs-offset-3">
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
