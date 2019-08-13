import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ValidationMessages extends Component {
  constructor (props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this._getClassNames = this._getClassNames.bind(this);
    this._toggleErrorMessages = this._toggleErrorMessages.bind(this);
    this._validateScheduleB = this._validateScheduleB.bind(this);
  }

  _getClassNames (valid = true) {
    if (this.props.validating) {
      return 'panel panel-warning';
    }

    if (valid) {
      return 'panel panel-success';
    }

    return 'panel panel-danger';
  }

  _toggleErrorMessages () {
    const collapsed = !this.state.collapsed;

    this.setState({
      collapsed
    });
  }

  _validateScheduleB () {
    const errorMessages = [];

    if (this.props.validationMessages && !this.props.validationMessages.scheduleB) {
      errorMessages.push('Errors found in other schedules');
    } else if (
      this.props.validationMessages &&
      this.props.validationMessages.scheduleB &&
      this.props.validationMessages.scheduleB.records
    ) {
      this.props.validationMessages.scheduleB.records.forEach((record) => {
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
      this.props.validationMessages &&
      this.props.validationMessages.scheduleB &&
      Array.isArray(this.props.validationMessages.scheduleB)
    ) {
      const message = 'There are duplicate trade records, please combine the Quantity into a single value on one row.';

      if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
        errorMessages.push(message);
      }
    }

    return errorMessages;
  }

  render () {
    let errorMessages = [];

    if (this.props.scheduleType === 'schedule-b') {
      errorMessages = this._validateScheduleB();
    }

    return (
      <div className={this._getClassNames(errorMessages.length === 0)}>
        <div
          className="panel-heading"
          id="message-header"
          role="tab"
        >
          <h4 className="panel-title">
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              onClick={this._toggleErrorMessages}
              type="button"
            >
              {this.props.validating &&
                'Validating...'
              }
              {!this.props.validating && errorMessages.length === 0 &&
                'No Validation Errors'
              }
              {!this.props.validating && errorMessages.length > 0 &&
                'Validation Errors'
              }
            </button>
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="toggle"
              onClick={this._toggleErrorMessages}
              type="button"
            >
              {<FontAwesomeIcon icon={this.state.collapsed ? 'angle-down' : 'angle-up'} />}
            </button>
          </h4>
        </div>

        <Collapse in={!this.state.collapsed}>
          <div
            id="collapse-messages"
          >
            <div className="panel-body">
              {this.props.validating &&
                'Validating...'
              }
              {!this.props.validating &&
              <ul>
                {errorMessages.map(message => <li key={message}>{message}</li>)}
              </ul>
              }
              {!this.props.validating && errorMessages.length === 0 &&
                'No errors found'
              }
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

ValidationMessages.defaultProps = {
  validationMessages: null
};

ValidationMessages.propTypes = {
  scheduleType: PropTypes.oneOf([
    'schedule-a', 'schedule-b', 'schedule-c', 'schedule-d'
  ]).isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
};

export default ValidationMessages;
