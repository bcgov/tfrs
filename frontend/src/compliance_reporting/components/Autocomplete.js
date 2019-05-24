import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AutocompletedInput from '../../app/components/AutocompletedInput';

class Autocomplete extends PureComponent {
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
    const { value, onKeyDown } = this.props;
    const { attributes } = this.props.cell;

    return (
      <AutocompletedInput
        autocompleteFieldName="organization.name"
        className="data-editor"
        handleRef={(input) => {
          this._input = input;
        }}
        handleInputChange={this.handleChange}
        handleKeyDown={onKeyDown}
        inputProps={{
          id: 'company',
          maxLength: 500,
          name: 'company',
          required: true
        }}
        name="input"
        value={value}
        {...attributes}
      />
    );
  }
}

Autocomplete.defaultProps = {
  value: ''
};

Autocomplete.propTypes = {
  cell: PropTypes.shape({
    attributes: PropTypes.shape({}).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default Autocomplete;
