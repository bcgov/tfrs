import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Select extends PureComponent {
  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this._input.focus();
  }

  handleChange (e) {
    this.props.onChange(e.target.value);
  }

  render () {
    const options = this.props.cell.getOptions(this.props.row);
    const { value, onKeyDown } = this.props;
    const { key: optionKey, value: optionValue } = this.props.cell.mapping;

    return (
      <select
        className="form-control"
        onChange={this.handleChange}
        onKeyDown={onKeyDown}
        ref={(input) => { this._input = input; }}
        value={value}
      >
        <option key="0" value="" default />
        {options &&
        options.map(mode => (
          <option key={mode[optionKey]} value={mode[optionValue]}>{mode[optionValue]}</option>
        ))}
      </select>
    );
  }
}

Select.defaultProps = {
  value: ''
};

Select.propTypes = {
  cell: PropTypes.shape({
    getOptions: PropTypes.func,
    mapping: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    }).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  row: PropTypes.number.isRequired,
  value: PropTypes.string
};

export default Select;
