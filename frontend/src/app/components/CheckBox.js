import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-free-regular';

class CheckBox extends Component {
  constructor (props) {
    super(props);

    // sometimes we might re-render so best to check and make sure we're not duplicating
    if (!this.props.fields.find(field => field.id === this.props.id)) {
      props.addToFields({
        id: props.id,
        value: false
      });
    }
  }

  render () {
    const checkbox = this.props.fields.find(field => field.id === this.props.id);

    if (checkbox && checkbox.value) {
      return (
        <FontAwesomeIcon
          icon={faCheckSquare}
          onClick={() => this.props.toggleCheck(this.props.id)}
          size="2x"
        />
      );
    }

    return (
      <FontAwesomeIcon
        icon={faSquare}
        onClick={() => this.props.toggleCheck(this.props.id)}
        size="2x"
      />);
  }
}

CheckBox.defaultProps = {
  value: false
};

CheckBox.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  id: PropTypes.number.isRequired,
  toggleCheck: PropTypes.func.isRequired,
  value: PropTypes.bool
};

export default CheckBox;
