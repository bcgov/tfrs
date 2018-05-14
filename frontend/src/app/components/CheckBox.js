import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-free-regular';

const CheckBox = (props) => {
  if (props.field) {
    return (
      <FontAwesomeIcon
        icon={faCheckSquare}
        onClick={() => props.toggleCheck(props.id)}
        size="2x"
      />
    );
  }

  return (
    <FontAwesomeIcon
      icon={faSquare}
      onClick={() => props.toggleCheck(props.id)}
      size="2x"
    />);
};

CheckBox.propTypes = {
  field: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default CheckBox;
