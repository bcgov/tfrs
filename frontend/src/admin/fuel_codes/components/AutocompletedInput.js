import Autocomplete from 'react-autocomplete';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as Routes from "../../../constants/routes";

class AutocompletedInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: []
    };

    this._onChange = this._onChange.bind(this);
    this._onSelect = this._onSelect.bind(this);

  }

  _onChange(event) {
    const {value} = event.target;

    if (value.length < 3) {
      this.setState({
        items: []
      });
    }
    else {
      // this.setState({
      //   items: []
      // });

      axios.get(Routes.BASE_URL + Routes.AUTOCOMPLETE_API
        + '?field=' + this.props.autocompleteFieldName + '&q=' + value)
        .then((response) => {
          this.setState({
            items: response.data
          });
        }).catch((error) => {
        this.setState({
          items: []
        });
      });
    }

    return this.props.handleInputChange(event);

  }

  _onSelect(value) {

    //pass it up to the container, faking an event
    this.props.handleInputChange({
      target: {
        name: this.props.inputProps.name,
        value: value
      }
    });

    this.setState({
      items: []
    })
  }

  render() {
    return (
      <Autocomplete
        items={this.state.items}
        onChange={this._onChange}
        inputProps={this.props.inputProps}
        getItemValue={item => (item)}
        value={this.props.value}
        onSelect={this._onSelect}
        selectOnBlur
        renderItem={(item, isHighlighted) => (
          <div
            key={item}
            style={
              {
                background: isHighlighted ? '#ccc' : '#fff',
              }
            }
          >
            {item}
          </div>
        )}
        renderMenu={(items, value, style) => (
          <div
            style={{
              ...style,
              position: 'fixed',
              zIndex: '400'
            }}
            children={items}
          />
        )}
      />
    );
  }
}

AutocompletedInput.defaultProps = {
  inputProps: {}
};

AutocompletedInput.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  autocompleteFieldName: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
  value: PropTypes.any
};


export default AutocompletedInput;