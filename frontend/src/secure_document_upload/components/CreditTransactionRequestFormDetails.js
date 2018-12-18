/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class CreditTransactionRequestFormDetails extends Component {
  constructor (props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.removeFile = this.removeFile.bind(this);
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

  removeFile (file) {
    const found = this.props.fields.files.findIndex(item => (item === file));
    this.props.fields.files.splice(found, 1);

    const attachedFiles = this.props.fields.files;

    this.props.handleInputChange({
      target: {
        name: 'files',
        value: attachedFiles
      }
    });
  }

  render () {
    return (
      <div className="credit-transaction-request-details">
        <div className="row main-form">
          <div className="col-md-6">
            <div className="row main-form">
              <div className="form-group col-md-12">
                <label htmlFor="attachment-category">Attachment Category:
                  <input
                    className="form-control"
                    id="attachment-category"
                    name="attachmentCategory"
                  />
                </label>
              </div>
            </div>

            <div className="row main-form">
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
                  <label htmlFor="milestone-id">Milestone:
                    <input
                      className="form-control"
                      id="milestone-id"
                      name="milestoneId"
                      onChange={this.props.handleInputChange}
                      placeholder="Record section of agreement containing milestone"
                      required="required"
                      type="text"
                      value={this.props.fields.milestoneId}
                    />
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-12">
                  <label htmlFor="agreement-name">Part 3 Agreement Name:
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
                      placeholder="Provide an explanation of your Part 3 award milestone completion"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row main-form">
              <div className="form-group col-md-12">
                <label htmlFor="document-type">Attachment Type:

                  <select
                    className="form-control"
                    id="document-type"
                    name="documentType"
                    onChange={this.props.handleInputChange}
                    required="required"
                  >
                    {this.props.categories &&
                    this.props.categories.map(category => (
                      <optgroup key={category.id} label={category.name}>
                        {category.types.map(t => (
                          <option key={`'type-${t.id}'`} value={t.id}>
                            {t.theType}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="row main-form">
              <div className="form-group col-md-12">
                <label htmlFor="comment">Attachments:
                  <Dropzone
                    activeClassName="is-dragover"
                    className="dropzone"
                    onDrop={this.onDrop}
                  >
                    <FontAwesomeIcon icon="cloud-upload-alt" size="2x" />
                    <div>
                      Drop files here or click to select files to upload.
                    </div>
                  </Dropzone>
                </label>
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-12 main-form files">
                <div>Files:
                  <ul>
                    {this.props.fields.files.map(file => (
                      <li key={file.name}>
                        {file.name} - {file.size} bytes
                        <button type="button" onClick={() => this.removeFile(file)}>
                          <FontAwesomeIcon icon="minus-circle" />
                        </button>
                      </li>
                    ))}
                    {this.props.fields.files.length === 0 &&
                    <li>No files selected.</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-12">{this.props.children}</div>
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
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fields: PropTypes.shape({
    agreementName: PropTypes.string,
    attachmentType: PropTypes.string,
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
