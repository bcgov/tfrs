import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InputWithTooltip from '../../app/components/InputWithTooltip';

class Input extends PureComponent {
  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this._input.target.focus();
  }

  handleChange (e) {
    this.props.onChange(e.target.value);
  }

  render () {
    const { value, onKeyDown } = this.props;
    const { attributes } = this.props.cell;

    return (
      <InputWithTooltip
        className="data-editor"
        handleInputChange={this.handleChange}
        handleKeyDown={onKeyDown}
        name="input"
        ref={(input) => { this._input = input; }}
        value={value}
        {...attributes}
      />
    );
  }
}

Input.defaultProps = {
  value: ''
};

Input.propTypes = {
  cell: PropTypes.shape({
    attributes: PropTypes.shape({}).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default Input;
