import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Administration = props => (
  <div className="dashboard-fieldset">
    <h1>Administration</h1>

    <div>
      <div className="value">
        <FontAwesomeIcon icon="cog" />
      </div>

      <div className="content administration">
        <div><a href="">Manage government users</a></div>
        <div><a href="">Add/Edit fuel suppliers</a></div>
        <div><a href="">User activity</a></div>
        <div><a href="">Historical data entry</a></div>
      </div>
    </div>
  </div>
);

Administration.defaultProps = {
};

Administration.propTypes = {
};

export default Administration;
