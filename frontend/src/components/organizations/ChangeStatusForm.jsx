import React, { Component } from 'react';

export default class UploadDocumentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      action: '',
      type: '',
      note: '',
    }
  }

  handleInputChange(event) {
    const newState = Object.assign({}, this.state);
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(event) {
    event.preventDefault();
    const status = this.status.value;
    const action = this.action.value;
    const type = this.type.value;
  }

  render() {
    return (
      <form 
        className="form-horizontal add-contact-form"
        onSubmit={(event) => this.handleSubmit(event)}>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="contact-role">Status:</label>
          <div className="col-sm-10">
            <select 
              className="form-control" 
              id="status" 
              name="status"
              defaultValue={this.props.organization.organizationStatusFK}
              ref={(input) => this.status = input}
              onChange={(event) => this.handleInputChange(event)} >
              { this.props.organizationStatuses.map((status) => (
                <option key={status.id} value={status.id}>{status.status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="contact-role">Actions:</label>
          <div className="col-sm-10">
            <select 
              className="form-control" 
              id="actions" 
              name="actions"
              defaultValue={this.props.organization.organizationActionsTypeFK}
              ref={(input) => this.action = input}
              onChange={(event) => this.handleInputChange(event)} >
              { this.props.organizationActions.map((action) => (
                <option key={action.id} value={action.id} >{action.description}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="contact-role">Type:</label>
          <div className="col-sm-10">
            <select 
              className="form-control" 
              id="type" 
              name="type"
              defaultValue={this.props.organization.organizationTypeFK}
              ref={(input) => this.type = input}
              onChange={(event) => this.handleInputChange(event)} >
              { this.props.organizationTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.description}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2" htmlFor="description">Note:</label>
          <div className="col-sm-10">
            <textarea
              className="form-control" 
              id="description" 
              name="description"
              onChange={(event) => this.handleInputChange(event)} />
          </div>
        </div>
        <div className="btn-container">
          <button 
            type="button" 
            className="btn btn-default" 
            onClick={this.props.closeChangeStatusModal}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary not-implemented">
            Save
          </button>
        </div> 
      </form>
    )
  }
}