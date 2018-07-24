import React from 'react';
import PropTypes from 'prop-types';

const HistoricalDataEntryFormNote = props => (
  <div className="form-group note">
    <label htmlFor="comment">Note:
      <textarea
        className="form-control"
        rows="5"
        id="comment"
        name="comment"
        value={props.comment}
        onChange={props.handleInputChange}
      />
    </label>
  </div>
);

HistoricalDataEntryFormNote.propTypes = {
  comment: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default HistoricalDataEntryFormNote;
