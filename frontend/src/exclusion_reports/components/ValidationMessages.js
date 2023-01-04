import React, { Component } from 'react'
import { Collapse } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class ValidationMessages extends Component {
  static getOtherSchedulesErrorMessage (validationMessages) {
    let message = 'Errors found in '
    if (validationMessages.exclusionAgreement) {
      message += 'Exclusion Agreement, '
    }
    // find the last comma and get rid of it
    // (this enables us not to get into a really complicated if else condition
    // as we'll always get a comma at the end)
    const lastComma = message.lastIndexOf(', ')
    message = message.substring(0, lastComma)

    message = message.replace(/,([^,]*)$/, ' and$1') // replace last comma with "and"

    return message
  }

  constructor (props) {
    super(props)

    this.state = {
      collapsed: true
    }

    this._getClassNames = this._getClassNames.bind(this)
    this._toggleErrorMessages = this._toggleErrorMessages.bind(this)
    this._validateExclusionAgreement = this._validateExclusionAgreement.bind(this)
  }

  _getClassNames (valid = true) {
    if (this.props.validating) {
      return 'panel panel-warning'
    }

    if (valid) {
      return 'panel panel-success'
    }

    return 'panel panel-danger'
  }

  _toggleErrorMessages () {
    const collapsed = !this.state.collapsed

    this.setState({
      collapsed
    })
  }

  _validateExclusionAgreement () {
    const errorMessages = []

    if (!this.props.valid &&
      this.props.validationMessages &&
      !this.props.validationMessages.exclusionAgreement) {
      const { validationMessages } = this.props
      const message = ValidationMessages.getOtherSchedulesErrorMessage(validationMessages)
      errorMessages.push(message)
    } else if (
      this.props.validationMessages &&
      this.props.validationMessages.exclusionAgreement &&
      this.props.validationMessages.exclusionAgreement.records
    ) {
      this.props.validationMessages.exclusionAgreement.records.forEach((record) => {
        let errorCount = Object.keys(record).length

        if ('quantity' in record) {
          const message = 'The quantity of fuel cannot be zero, negative, or contain a decimal value.'

          if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
            errorMessages.push(message)
          }

          errorCount -= 1
        }

        if ('quantityNotSold' in record) {
          const message = 'The quantity of fuel not sold cannot be negative, contain a decimal value, or be greater than the quantity.'

          if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
            errorMessages.push(message)
          }

          errorCount -= 1
        }

        // if we still have errors after checking
        // that means we're missing some columns (it's very tedious and unnecessary to check each
        // column for missing information)
        if (errorCount > 0) {
          const message = 'There is missing information, please ensure all fields are completed.'

          if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
            errorMessages.push(message)
          }
        }
      })
    }

    if (
      this.props.validationMessages &&
      this.props.validationMessages.exclusionAgreement &&
      Array.isArray(this.props.validationMessages.exclusionAgreement)
    ) {
      const message = 'There are duplicate entries, please combine the quantity into a single value on one row.'

      if (errorMessages.findIndex(errorMessage => errorMessage === message) < 0) {
        errorMessages.push(message)
      }
    }

    return errorMessages
  }

  _validateSchedules () {
    const errorMessages = []

    if (!this.props.valid &&
      this.props.validationMessages) {
      const { validationMessages } = this.props
      const message = ValidationMessages.getOtherSchedulesErrorMessage(validationMessages)
      errorMessages.push(message)
    }

    return errorMessages
  }

  render () {
    let errorMessages = []

    switch (this.props.scheduleType) {
      case 'exclusion-agreement':
        errorMessages = this._validateExclusionAgreement()
        break
      default:
        errorMessages = this._validateSchedules()
    }

    return (
      <div className={this._getClassNames(errorMessages.length === 0)}>
        <div
          className="panel-heading"
          id="message-header"
          role="tab"
        >
          <h4 className="panel-title">
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="text"
              onClick={this._toggleErrorMessages}
              type="button"
            >
              {this.props.validating &&
                <FontAwesomeIcon icon="ellipsis-h" />
              }
              {!this.props.validating && errorMessages.length === 0 &&
                <FontAwesomeIcon icon="check" />
              }
              {!this.props.validating && errorMessages.length > 0 &&
                <FontAwesomeIcon icon="times" />
              }
              {this.props.validating &&
                ' Identifying potential issues...'
              }
              {!this.props.validating && errorMessages.length === 0 &&
                ' No issues identified'
              }
              {!this.props.validating && errorMessages.length > 0 &&
                ' Issues identified'
              }
            </button>
            <button
              aria-controls="collapse-messages"
              aria-expanded={!this.state.collapsed}
              className="toggle"
              onClick={this._toggleErrorMessages}
              type="button"
            >
              <FontAwesomeIcon icon={this.state.collapsed ? 'angle-down' : 'angle-up'} />
            </button>
          </h4>
        </div>

        <Collapse in={!this.state.collapsed}>
          <div id="collapse-messages">
            <div className="panel-body">
              {this.props.validating &&
                'Validating...'
              }
              {!this.props.validating &&
              <ul>
                {errorMessages.map(message => <li key={message}>{message}</li>)}
              </ul>
              }
              {!this.props.validating && errorMessages.length === 0 &&
                'No errors found'
              }
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

ValidationMessages.defaultProps = {
  activeSheet: 0,
  validationMessages: null
}

ValidationMessages.propTypes = {
  activeSheet: PropTypes.number,
  scheduleType: PropTypes.oneOf([
    'exclusion-agreement'
  ]).isRequired,
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationMessages: PropTypes.shape()
}

export default ValidationMessages
