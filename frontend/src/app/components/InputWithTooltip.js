/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Tooltip } from 'react-bootstrap';

import {
  TEXT_ERROR_MAX_DECIMALS,
  TEXT_ERROR_MULTIPLE_DOTS,
  TEXT_ERROR_NEGATIVE_VALUE,
  TEXT_ERROR_NO_DECIMALS
} from '../../constants/langEnUs';

class InputWithTooltip extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
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

    if (!this.props.allowNegative &&
      event.target.value.includes('-') &&
      event.nativeEvent.inputType === 'insertFromPaste') {
      this.target.value = this.state.currentValue;
      showTooltip = true;
      tooltipMessage = TEXT_ERROR_NEGATIVE_VALUE;
    }

    // e is normally allowed, but to simulate the copy/paste functionality containing a letter
    // we can just get rid of the e
    if (event.target.value.includes('e') &&
      event.nativeEvent.inputType === 'insertFromPaste') {
      this.target.value = event.target.value.replace('e', '');
    }

    const parsed = value.split('.');

    if (this.props.addCommas) {
      let newValue = parsed[0];

      if (typeof newValue === 'number') {
        newValue = newValue.toString();
      }

      newValue = newValue.replace(/\D/g, '');
      newValue = newValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

      if (parsed.length > 1) {
        this.target.value = `${newValue}.${parsed[1]}`;
      } else {
        this.target.value = newValue;
      }
    }

    if (parsed.length > 1 && parsed[1].length > this.props.dataNumberToFixed) {
      this.target.value = this.state.currentValue;
      showTooltip = true;

      if (this.props.dataNumberToFixed === 0) {
        tooltipMessage = TEXT_ERROR_NO_DECIMALS;
      } else {
        tooltipMessage = TEXT_ERROR_MAX_DECIMALS;
      }
    } else {
      this.props.handleInputChange(event);
    }

    this.setState({
      currentValue: event.target.value,
      showTooltip,
      tooltipMessage
    });
  }

  handlePaste (event) {
    const clipboard = event.clipboardData.getData('Text');
    const dotFound = (clipboard.match(/\./g) || []).length;

    if (dotFound > 1) {
      event.preventDefault();

      this.setState({
        currentValue: event.target.value,
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_MULTIPLE_DOTS
      });
    }
  }

  patternMatch (event) {
    const { value } = event.target;

    // prevent dots if we're not allowing decimals
    if (this.props.dataNumberToFixed === 0 && event.key === '.') {
      event.preventDefault();
      this.setState({
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_NO_DECIMALS
      });
    }

    // prevent adding another dot when one already exists
    if (window.getSelection().toString() === '' && value.includes('.') && event.key === '.') {
      event.preventDefault();

      this.setState({
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_MULTIPLE_DOTS
      });
    }

    // prevent the minus symbol unless we're allowing negative values
    if (!this.props.allowNegative && event.key === '-') {
      event.preventDefault();

      this.setState({
        showTooltip: true,
        tooltipMessage: TEXT_ERROR_NEGATIVE_VALUE
      });
    }

    // prevent further typing when maxlength has been reached
    // (ordinarily, type=number ignores maxlength)
    if (this.props.maxLength > 0 && value.length >= this.props.maxLength) {
      event.preventDefault();
    }

    // prevent invalid characters
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

  render () {
    return (
      <div className={this.props.showDollarSymbol ? 'input-group' : ''}>
        {this.props.showDollarSymbol &&
          <span className="input-group-addon">$</span>
        }
        <input
          className={this.props.className}
          data-number-to-fixed={this.props.dataNumberToFixed}
          id={this.props.id}
          max={this.props.max}
          maxLength={this.props.maxLength}
          min={this.props.min}
          name={this.props.name}
          onChange={this.handleInputChange}
          onKeyDown={this.props.handleKeyDown}
          onKeyPress={this.patternMatch}
          onPaste={this.handlePaste}
          placeholder={this.props.placeholder}
          required={this.props.required}
          ref={(input) => {
            this.target = input;
          }}
          step={this.props.step}
          type={this.props.addCommas ? 'text' : 'number'}
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

InputWithTooltip.defaultProps = {
  addCommas: false,
  allowNegative: false,
  className: 'form-control',
  dataNumberToFixed: 0,
  handleKeyDown: null,
  id: null,
  max: null,
  maxLength: null,
  min: null,
  placeholder: '',
  required: false,
  showDollarSymbol: false,
  step: null,
  value: ''
};

InputWithTooltip.propTypes = {
  addCommas: PropTypes.bool,
  allowNegative: PropTypes.bool,
  className: PropTypes.string,
  dataNumberToFixed: PropTypes.number,
  handleInputChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func,
  id: PropTypes.string,
  max: PropTypes.string,
  maxLength: PropTypes.string,
  min: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showDollarSymbol: PropTypes.bool,
  step: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default InputWithTooltip;
