import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class CheckBox extends Component {
  componentDidMount () {
    const obj = {
      id: this.props.id
    }

    if (this.props.field) {
      obj.field = this.props.field
    }

    if (this.props.type) {
      obj.type = this.props.type
    }

    if (this.props.value) {
      obj.value = true
    } else {
      obj.value = false
    }

    this.props.addToFields(obj)
  }

  render () {
    const checkboxes = this.props.fields.filter(field => field.id === this.props.id)

    let checkbox = null
    if (checkboxes.length === 1) {
      [checkbox] = checkboxes
    } else {
      checkbox = checkboxes.find(field =>
        field.field === this.props.field && field.type === this.props.type)
    }

    if (checkbox && checkbox.value) {
      return (
        <FontAwesomeIcon
          icon={['far', 'check-square']}
          onClick={() => this.props.toggleCheck(this.props.id, {
            field: this.props.field,
            type: this.props.type
          })}
          size="2x"
        />
      )
    }

    return (
      <FontAwesomeIcon
        icon={['far', 'square']}
        onClick={() => this.props.toggleCheck(this.props.id, {
          field: this.props.field,
          type: this.props.type
        })}
        size="2x"
      />)
  }
}

CheckBox.defaultProps = {
  field: null,
  type: null,
  value: false
}

CheckBox.propTypes = {
  addToFields: PropTypes.func.isRequired,
  field: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  toggleCheck: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.bool
}

export default CheckBox
