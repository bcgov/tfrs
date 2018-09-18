/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Tooltip } from 'react-bootstrap';

class fairMarketValueInput extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.patternMatch = this.patternMatch.bind(this);

    this.state = {
      currentValue: null,
      showTooltip: false
    };
  }

  handleInputChange (event) {
    const { value } = event.target;
    let showTooltip = false;

    if (value === '' && (event.nativeEvent.data === '.' ||
      event.nativeEvent.inputType === 'insertFromPaste')) { // prevent multiple dots
      this.target.value = this.state.currentValue;
      showTooltip = true;
    }

    const parsed = value.split('.');

    if (parsed.length > 1 && parsed[1].length > 2) { // prevent more than 2 decimal places
      this.target.value = this.state.currentValue;
      showTooltip = true;
    }

    this.setState({
      currentValue: event.target.value,
      showTooltip
    });

    this.props.handleInputChange(event);
  }

  patternMatch (event) {
    const { value } = event.target;

    // prevent adding another dot when one already exists
    if (window.getSelection().toString() === '' && value.indexOf('.') >= 0 && event.key === '.') {
      event.preventDefault();

      this.setState({
        showTooltip: true
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
          <Tooltip placement="top" className="in" id="tooltip-right">
          Amount cannot contain more than 2 decimal places
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
