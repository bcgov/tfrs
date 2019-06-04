import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AutocompletedInput from '../../app/components/AutocompletedInput';

class OrganizationAutocomplete extends PureComponent {
  constructor (props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount () {
    this._input.focus();
  }

  handleChange (e) {
    this.props.onChange(e.target.value);
  }

  handleKeyDown (e) {
    if (e.which === 13 || e.which === 9) { // Enter Key or Tab Key
      if (this._input.state.highlightedIndex === null) {
        this.props.cell.attributes.address = null;

        this.props.onKeyDown(e);
      }
    }
  }

  render () {
    const { value, onCommit } = this.props;
    const { attributes } = this.props.cell;

    return (
      <AutocompletedInput
        autocompleteFieldName="organization.name"
        className="data-editor"
        getItemValue={item => (item.name)}
        handleRef={(input) => {
          this._input = input;
        }}
        handleInputChange={this.handleChange}
        inputProps={{
          id: 'company',
          maxLength: 500,
          name: 'company',
          onKeyDown: this.handleKeyDown,
          required: true
        }}
        name="input"
        onSelectEvent={(item) => {
          this.props.cell.attributes.address = item.organization_address;
          onCommit(item.name);
        }}
        renderItem={(item, isHighlighted) => (
          <div
            className={`autocomplete-item ${isHighlighted ? 'highlight' : ''}`}
            key={item.name}
          >
            <strong>{item.name}</strong>
            <div>
              {item.organization_address.address_line_1}
              {` ${item.organization_address.address_line_2}`}
              {` ${item.organization_address.address_line_3}`}
              {` ${item.organization_address.city}`}, {item.organization_address.state}
              {` ${item.organization_address.postal_code}`}
            </div>
          </div>
        )}
        value={value}
        {...attributes}
      />
    );
  }
}

OrganizationAutocomplete.defaultProps = {
  value: ''
};

OrganizationAutocomplete.propTypes = {
  cell: PropTypes.shape({
    attributes: PropTypes.shape({
      address: PropTypes.shape()
    }).isRequired,
    onSelectEvent: PropTypes.func
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default OrganizationAutocomplete;
