/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Tooltip } from 'react-bootstrap';

import {
  TEXT_ERROR_MAX_DECIMALS,
  TEXT_ERROR_MULTIPLE_DOTS,
  TEXT_ERROR_NEGATIVE_VALUE
} from '../../constants/langEnUs';

class fairMarketValueInput extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.patternMatch = this.patternMatch.bind(this);

    this.state = {
      currentValue: null,
      showTooltip: false,
      tooltipMessage: ''
    };
  }

  handleInputChange (event) {
    const { value } = event.target;
    let showTooltip = false;
    let tooltipMessage = '';

    if (value === '' && (event.nativeEvent.data === '.' ||
      event.nativeEvent.inputType === 'insertFromPaste')) { // prevent multiple dots
      this.target.value = this.state.currentValue;
      showTooltip = true;
      tooltipMessage = TEXT_ERROR_MULTIPLE_DOTS;
    }

    if (event.target.value.indexOf('-') >= 0 &&
      event.nativeEvent.inputType === 'insertFromPaste') {
      this.target.value = this.state.currentValue;
      showTooltip = true;
      tooltipMessage = TEXT_ERROR_NEGATIVE_VALUE;
    }

    const parsed = value.split('.');

    if (parsed.length > 1 && parsed[1].length > 2) { // prevent more than 2 decimal places
      this.target.value = this.state.currentValue;
      showTooltip = true;
      tooltipMessage = TEXT_ERROR_MAX_DECIMALS;
    }

    this.setState({
      currentValue: event.target.value,
      showTooltip,
      tooltipMessage
    });

    this.props.handleInputChange(event);
  }

  patternMatch (event) {
    const { value } = event.target;

    // prevent adding another dot when one already exists
    if (window.getSelection().toString() === '' && value.indexOf('.') >= 0 && event.key === '.') {
      event.preventDefault();

      this.setState({
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_MULTIPLE_DOTS
      });
    }

    // prevent adding another dot when one already exists
    if (event.key === '-') {
      event.preventDefault();

      this.setState({
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_NEGATIVE_VALUE
      });
    }
  }

  render () {
    return (
      <div className="input-group">
        <span className="input-group-addon">$</span>
        <input
          className="form-control"
          data-number-to-fixed="2"
          id="value-per-credit"
          min="0"
          name="fairMarketValuePerCredit"
          onChange={this.handleInputChange}
          onKeyPress={this.patternMatch}
          placeholder="Amount"
          required="required"
          ref={(input) => {
            this.target = input;
          }}
          step="0.01"
          type="number"
          value={this.props.value}
        />
        <Overlay
          container={this}
          placement="top"
          show={this.state.showTooltip}
          target={this.target}
        >
          <Tooltip
            className={`in ${!this.state.showTooltip ? 'hidden' : ''}`}
            id="tooltip-right"
            placement="top"
          >
            {this.state.tooltipMessage}
          </Tooltip>
        </Overlay>
      </div>
    );
  }
}

fairMarketValueInput.defaultProps = {
  value: ''
};

fairMarketValueInput.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default fairMarketValueInput;
