import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../../constants/langEnUs';

import history from '../../../app/History';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const HistoricalDataEntryFormButtons = props => (
  <div className="btn-container">
    {props.actions.includes(Lang.BTN_CANCEL) &&
    <button
      type="button"
      className="btn btn-default"
      onClick={() => history.goBack()}
    >
      <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
    </button>
    }

    {props.actions.includes(Lang.BTN_COMMIT) &&
    <button
      type="button"
      className="btn btn-primary"
      data-toggle="modal"
      data-target="#confirmProcess"
    >
      {Lang.BTN_COMMIT}
    </button>
    }

    {props.actions.includes(Lang.BTN_ADD_TO_QUEUE) &&
    <button
      type="submit"
      className="btn btn-primary"
      onClick={props.handleSubmit}
    >
      {Lang.BTN_ADD_TO_QUEUE}
    </button>
    }

    {props.actions.includes(Lang.BTN_SAVE) &&
    <button
      type="submit"
      className="btn btn-primary"
      onClick={props.handleSubmit}
    >
      {Lang.BTN_SAVE}
    </button>
    }
  </div>
);

HistoricalDataEntryFormButtons.defaultProps = {
  handleSubmit: null
};

HistoricalDataEntryFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func
};

export default HistoricalDataEntryFormButtons;
