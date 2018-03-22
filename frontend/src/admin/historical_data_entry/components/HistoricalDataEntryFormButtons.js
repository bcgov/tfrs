import React from 'react';
import PropTypes from 'prop-types';

import * as Routes from '../../../constants/routes';
import * as Lang from '../../../constants/langEnUs';

import history from '../../../app/History';

const HistoricalDataEntryFormButtons = props => (
  <div className="btn-container">
    {props.actions.includes(Lang.BTN_CANCEL) &&
    <button
      type="button"
      className="btn btn-default"
      onClick={() => history.goBack()}
    >
      {Lang.BTN_APP_CANCEL}
    </button>
    }

    {props.actions.includes(Lang.BTN_COMMIT) &&
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {}}
    >
      {Lang.BTN_COMMIT}
    </button>
    }

    {props.actions.includes(Lang.BTN_ADD_TO_QUEUE) &&
    <button
      type="submit"
      className="btn btn-primary"
      onClick={() => props.handleSubmit}
    >
      {Lang.BTN_ADD_TO_QUEUE}
    </button>
    }

    {props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
    <button
      type="submit"
      className="btn btn-primary"
      onClick={() => props.handleSubmit}
    >
      {Lang.BTN_SAVE_DRAFT}
    </button>
    }
  </div>
);

HistoricalDataEntryFormButtons.defaultProps = {
};

HistoricalDataEntryFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default HistoricalDataEntryFormButtons;
