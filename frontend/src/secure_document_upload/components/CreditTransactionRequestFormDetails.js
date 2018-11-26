/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import InputWithTooltip from '../../app/components/InputWithTooltip';
import { CREDIT_TRANSFER_TYPES } from '../../constants/values';

class CreditTransactionRequestFormDetails extends Component {
  constructor (props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop (files) {
    const attachedFiles = [
      ...this.props.fields.files,
      ...files
    ];

    const newFiles = attachedFiles.filter((item, position, arr) => (
      arr.findIndex(existingItem => (
        existingItem.name === item.name)) === position));

    this.props.handleInputChange({
      target: {
        name: 'files',
        value: newFiles
      }
    });
  }

  render () {
    return (
      <div className="credit-transaction-details">
        <div className="main-form">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="form-group col-md-12">
                  <label htmlFor="compliance-period">Compliance Period:
                    <select
                      className="form-control"
                      id="compliance-period"
                      name="compliancePeriod"
                      onChange={this.props.handleInputChange}
                      required="required"
                    >
                      <option key="0" value="" default />
                      {this.props.compliancePeriods &&
                        this.props.compliancePeriods.map(period => (
                          <option key={period.id} value={period.id}>
                            {period.description}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="milestone-id">Milestone ID:
                      <input
                        className="form-control"
                        id="milestone-id"
                        name="milestoneId"
                        onChange={this.props.handleInputChange}
                        required="required"
                        type="text"
                        value={this.props.fields.milestoneId}
                      />
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="agreement-name">Agreement Name:
                      <input
                        className="form-control"
                        id="agreement-name"
                        name="agreementName"
                        onChange={this.props.handleInputChange}
                        required="required"
                        type="text"
                        value={this.props.fields.agreementName}
                      />
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="comment">Comment:
                      <textarea
                        id="comment"
                        className="form-control"
                        rows="5"
                        name="comment"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row">
                <div className="form-group col-md-12 dropzone">
                  <label htmlFor="comment">Attachments:
                    <Dropzone
                      onDrop={this.onDrop}
                    >
                      Drop files here, or click to select files to upload.
                    </Dropzone>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-12">
                  <label>Files:
                    <ul>
                      {
                        this.props.fields.files.map(file => (
                          <li key={file.name}>{file.name} - {file.size} bytes</li>
                        ))
                      }
                    </ul>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreditTransactionRequestFormDetails.defaultProps = {
  children: null
};

CreditTransactionRequestFormDetails.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    agreementName: PropTypes.string,
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    files: PropTypes.arrayOf(PropTypes.shape()),
    milestoneId: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default CreditTransactionRequestFormDetails;
