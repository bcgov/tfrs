import Autocomplete from 'react-autocomplete';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import * as Routes from '../../constants/routes';

class AutocompletedInput extends Component {
  constructor (props) {
    super(props);

    this.state = {
      items: []
    };

    this._onChange = this._onChange.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  _onChange (event) {
    const { value } = event.target;

    if (value.length < 3) {
      this.setState({
        items: []
      });
    } else {
      axios.get(`${Routes.BASE_URL}${Routes.AUTOCOMPLETE_API}?field=${this.props.autocompleteFieldName}&q=${value}&cacheSerial=${this.props.cacheSerial}${this.props.cache === false ? `&cache=False` : ''}`)
        .then((response) => {
          this.setState({
            items: response.data
          });
        }).catch((error) => {
          console.log(error);

          this.setState({
            items: []
          });
        });
    }

    return this.props.handleInputChange(event);
  }

  _onKeyPress (event) {
    if (this.props.integersOnly) {
      if (event.key.match(/\D/g)) {
        event.preventDefault();
      }
    }
  }

  _onSelect (value) {
    // pass it up to the container, faking an event
    this.props.handleInputChange({
      target: {
        name: this.props.inputProps.name,
        value
      }
    });

    this.setState({
      items: []
    });

    if (this.props.onSelectEvent) {
      this.props.onSelectEvent();
    }
  }

  render () {
    return (
      <Autocomplete
        getItemValue={item => (item)}
        inputProps={this.props.inputProps}
        items={this.state.items}
        onChange={this._onChange}
        onSelect={this._onSelect}
        renderItem={(item, isHighlighted) => (
          <div
            className={`autocomplete-item ${isHighlighted ? 'highlight' : ''}`}
            key={item}
          >
            {item}
          </div>
        )}
        renderMenu={(items, value, style) => (
          <div
            className={items.length > 0 ? `autocomplete-menu` : ''}
            style={{
              ...style,
              position: 'fixed',
              zIndex: '400'
            }}
          >
            {items}
          </div>
        )}
        ref={(input) => { this.props.handleRef(input); }}
        renderInput={props => (
          <input
            type="text"
            onKeyPress={this._onKeyPress}
            className="form-control"
            {...props}
          />
        )}
        selectOnBlur
        value={this.props.value}
        wrapperStyle={{}}
      />
    );
  }
}

AutocompletedInput.defaultProps = {
  cache: true,
  handleRef: null,
  inputProps: {},
  integersOnly: false,
  onSelectEvent: null,
  value: ''
};

AutocompletedInput.propTypes = {
  autocompleteFieldName: PropTypes.string.isRequired,
  cache: PropTypes.bool,
  cacheSerial: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleRef: PropTypes.func,
  inputProps: PropTypes.shape(),
  integersOnly: PropTypes.bool,
  onSelectEvent: PropTypes.func,
  value: PropTypes.any
};

const mapStateToProps = state => ({
  cacheSerial: state.rootReducer.autocomplete.serial
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AutocompletedInput);
