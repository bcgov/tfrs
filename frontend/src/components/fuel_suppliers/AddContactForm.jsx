import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import validators from '../../utils/validator.jsx';
import InputMask from 'react-input-mask';

export default class AddContactForm extends Component {
  constructor(props) {
  super(props);
    this.state = {
      contactGivenName: '',
      contactSurname: '',
      contactRole: '',
      contactEmail: '',
      contactWorkPhone: '',
      contactCellPhone: '',
      contactBCeID: '',
    };
    this.validators = validators;
    this.resetValidators();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.displayValidationErrors = this.displayValidationErrors.bind(this);
    this.updateValidators = this.updateValidators.bind(this);
    this.resetValidators = this.resetValidators.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleVerifyID() {
    this.props.verifyID(this.state.contactBCeID);
  }

  handleAddContact(event) {
    event.preventDefault();
    let contactData = {
      contactGivenName: this.state.contactGivenName,
      contactSurname: this.state.contactSurname,
      contactRole: this.state.contactRole,
      contactEmail: this.state.contactEmail,
      contactWorkPhone: this.state.contactWorkPhone,
      contactCellPhone: this.state.contactCellPhone,
      contactBCeID: this.state.contactBCeID,
      fuelSupplierFK: this.props.fuelSupplierData.id,
    }
    if (this.isFormValid()) {
      this.props.addContact(contactData);
    } else {
      for (var key in this.validators) {
        this.updateValidators(key, this.validators[key].state);
      }
    }
  }
  
  /** 
   * This function is called whenever a form input is changed
   * Which in turn updates the state of this component and validators
   */
  handleInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.updateValidators(event.target.name, event.target.value);
  }
  
   /** 
   * This function updates the state of the validator for the specified validator
   */
  updateValidators(fieldName, value) {
    this.validators[fieldName].errors = [];
    this.validators[fieldName].state = value;
    this.validators[fieldName].valid = true;
    this.validators[fieldName].rules.forEach((rule) => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  }
  
  // This function resets all validators for this form to the default state
  resetValidators() {
    Object.keys(this.validators).forEach((fieldName) => {
      this.validators[fieldName].errors = [];
      this.validators[fieldName].state = '';
      this.validators[fieldName].valid = false;
    });
  }
  
  // This function displays the validation errors for a given input field
  displayValidationErrors(fieldName) {
    const validator = this.validators[fieldName];
    const result = '';
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return <span className="error" key={index}>* {info}</span>;
      });

      return (
        <div>
          {errors}
        </div>
      );
    }
    return result;
  }
  
  // This method checks to see if the validity of all validators are true
  isFormValid() {
    let status = true;
    Object.keys(this.validators).forEach((field) => {
      if (!this.validators[field].valid) {
        status = false;
      }
    });
    return status;
  }
  
  render() {
    return (
      <form className="form-horizontal add-contact-form" onSubmit={(event) => this.handleAddContact(event)}>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-name">First Name:</label>
          <div className="col-sm-10">
            <input 
              type="text" 
              className="form-control" 
              id="contact--given-name"
              name="contactGivenName"
              onChange={(event) => this.handleInputChange(event)} />
            { this.displayValidationErrors('contactGivenName') }
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-name">Last Name:</label>
          <div className="col-sm-10">
            <input 
              type="text" 
              className="form-control" 
              id="contact-surname"
              name="contactSurname"
              onChange={(event) => this.handleInputChange(event)} />
            { this.displayValidationErrors('contactSurname') }
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-role">Role:</label>
          <div className="col-sm-10">
            <select 
              className="form-control" 
              id="contact-role" 
              name="contactRole"
              onChange={(event) => this.handleInputChange(event)} >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-email">Email:</label>
          <div className="col-sm-10">
            <input 
              type="email" 
              className="form-control" 
              id="contact-email"
              name="contactEmail"
              onChange={(event) => this.handleInputChange(event)} />
            { this.displayValidationErrors('contactEmail') }
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-work-phone">Work Phone:</label>
          <div className="col-sm-10">
              <InputMask 
                mask="+1 (999) 999-9999" 
                maskChar=" " 
                type="text" 
                className="form-control bfh-phone" 
                id="contact-work-phone" 
                name="contactWorkPhone"
                onChange={(event) => this.handleInputChange(event)} />
            { this.displayValidationErrors('contactWorkPhone') }
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-cell-phone">Cell Phone:</label>
          <div className="col-sm-10">
            <InputMask 
              mask="+1 (999) 999-9999" 
              maskChar=" " 
              type="text" 
              className="form-control" 
              id="contact-cell-phone"
              name="contactCellPhone"
              onChange={(event) => this.handleInputChange(event)} />
          { this.displayValidationErrors('contactCellPhone') }
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="contact-bceid">BCeID:</label>
          <div className="col-sm-10">
            <input 
              type="text" 
              className="form-control" 
              id="contact-bceid"
              name="contactBCeID"
              onChange={(event) => this.handleInputChange(event)} />
            { this.props.verifyIDSuccess && 
              <div className="alert alert-success">Valid BCeID</div>
            }
            { this.props.verifyIDError.length > 0 && 
              <div className="alert alert-warning">{this.props.verifyIDError}</div>
            }
            <input 
              type="button" 
              className="btn btn-default verify-btn" 
              value="verify"
              onClick={() => this.handleVerifyID()} />
          </div>
        </div>
        { this.props.addContactSuccess && 
          <div className="alert alert-success">Contact successfully added</div>
        }
        <div className="form-group"> 
          { !this.props.addContactSuccess ? 
            <div className="col-sm-offset-2 col-sm-10 btn-container">
              <button 
                type="button" 
                className="btn btn-default" 
                onClick={this.props.closeAddContactModal}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary">
                Save
              </button>
            </div>
            :
            <div className="col-sm-offset-2 col-sm-10 btn-container">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={this.props.closeAddContactModal}>
                Okay
              </button>
            </div>
          }
        </div>
      </form>
    )
  }
}