import React, { Component } from 'react';
import * as Values from '../../constants/values';

export default class UploadDocumentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complianceYear: '',
      description: '',
      file: '',
    }
  }

  handleInputChange(event) {
    const newState = Object.assign({}, this.state);
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    let start = Values.COMPLIANCE_YEAR_START;
    let end = new Date().getFullYear();
    let years = [];
    for(var year = start ; year <= end; year++){
      years.push(year);
    }
    return (
      <form className="form-horizontal add-contact-form">
        <div className="form-group">
          <div className="col-sm-10">
            <input 
              type="file"  
              id="contact-name"
              name="contactName"
              onChange={(event) => this.handleInputChange(event)} />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="contact-role">Compliance Year:</label>
          <div className="col-sm-10">
            <select 
              className="form-control" 
              id="compliance-year" 
              name="complianceYear"
              onChange={(event) => this.handleInputChange(event)} >
              { years.reverse().map((year) => (
                <option>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="description">Description:</label>
          <div className="col-sm-10">
            <textarea
              className="form-control" 
              id="description" 
              name="description"
              onChange={(event) => this.handleInputChange(event)} />
          </div>
        </div>
      </form>
    )
  }
}