import React from 'react';
import PropTypes from 'prop-types';

const HistoricalDataEntryFormNote = props => (
  <div className="form-group note">
    <label htmlFor="note">Note:
      <textarea
        className="form-control"
        rows="5"
        id="note"
        name="note"
        value={props.note}
        onChange={props.handleInputChange}
      />
    </label>
  </div>
);

HistoricalDataEntryFormNote.propTypes = {
  note: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default HistoricalDataEntryFormNote;
