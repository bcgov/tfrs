import PropTypes from 'prop-types';
import React from 'react';

const ValidationMessages = (props) => {
  const errorMessages = [];

  if (
    props.validationMessages &&
    props.validationMessages.scheduleB &&
    props.validationMessages.scheduleB.records
  ) {
    props.validationMessages.scheduleB.records.forEach((record) => {
      let errorCount = Object.keys(record).length;

      if ('quantity' in record) {
        const message = 'The Quantity of Fuel Supplied cannot contain a zero, negative or decimal value.';

        if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
          errorMessages.push(message);
        }

        errorCount -= 1;
      }

      if ('scheduleD_index' in record) {
        const message = 'A GHGenius Fuel Code was not found, please create a record in Schedule D.';

        if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
          errorMessages.push(message);
        }

        errorCount -= 1;
      }

      // if we still have errors after checking for 0 quantities and missing GHGenius
      // that means we're missing some columns (it's very tedious and unnecessary to check each
      // column for missing information)
      if (errorCount > 0) {
        const message = 'There is missing information, please ensure all fields are completed.';

        if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
          errorMessages.push(message);
        }
      }
    });
  }

  if (
    props.validationMessages &&
    props.validationMessages.scheduleB &&
    Array.isArray(props.validationMessages.scheduleB)
  ) {
    const message = 'There are duplicate trade records, please combine the Quantity into a single value on one row.';

    if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
      errorMessages.push(message);
    }
  }

  return (
    <div className="panel panel-danger">
      <div
        className="panel-heading"
        id="error-header"
        role="tab"
      >
        <h4 className="panel-title">
          <a
            aria-controls="collapse-error-messages"
            aria-expanded="false"
            data-parent="#error-messages"
            data-toggle="collapse"
            href="#collapse-error-messages"
            role="button"
          >
            Validation Errors
          </a>
        </h4>
      </div>

      <div
        className="panel-collapse collapse"
        id="collapse-error-messages"
        role="tabpanel"
        aria-labelledby="error-header"
      >
        <div className="panel-body">
          <ul>
            {errorMessages.map(message => <li key={message}>{message}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

ValidationMessages.propTypes = {
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
};

export default ValidationMessages;
