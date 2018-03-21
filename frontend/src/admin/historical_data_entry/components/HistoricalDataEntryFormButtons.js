import React from 'react';
import PropTypes from 'prop-types';

import * as Routes from '../../../constants/routes';
import * as Lang from '../../../constants/langEnUs';

import history from '../../../app/History';

const HistoricalDataEntryFormButtons = props => (
  <div className="historical-data-entry-actions">
    <div className="btn-container">
      <button
        type="button"
        className="btn btn-default"
        onClick={() => history.goBack()}
      >
        {Lang.BTN_APP_CANCEL}
      </button>

      {props.actions.includes(Lang.BTN_COMMIT) &&
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => {}}
      >
        {Lang.BTN_COMMIT}
      </button>
      }
    </div>
  </div>
);

HistoricalDataEntryFormButtons.defaultProps = {
};

HistoricalDataEntryFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default HistoricalDataEntryFormButtons;
