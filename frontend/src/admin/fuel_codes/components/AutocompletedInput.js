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
  }

  _onChange(event) {
    const {value} = event.target;

    if (value.length < 3) {
      this.setState({
        items: []
      });
    }
    else {
      this.setState({
        items: []
      });

      axios.get(Routes.BASE_URL + Routes.AUTOCOMPLETE_API
        + '?field=' + this.props.autocompleteFieldName + '&q=' + value)
        .then((response) => {
          this.setState({
            items: response.data
          });
        }).catch((error) => {
      });
    }

    return this.props.handleInputChange(event);

  }

  render() {
    return (
      <Autocomplete
        items={this.state.items}
        onChange={this._onChange}
        inputProps={this.props.inputProps}
        getItemValue={item => (item)}
        value={this.props.value}
        onSelect={(val) => {
          this.props.handleInputChange({
            target: {
              name: this.props.inputProps.name,
              value: val
            }
          })
        }}
        renderItem={(item, isHighlighted) => (
          <div
            key={item}
            style={
              {
                background: isHighlighted ? '#ccc' : '#fff',
                zIndex: 500000
              }
            }
          >
            {item}
          </div>
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