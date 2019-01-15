/*
 * Presentational component
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import CONFIG from '../../config';
import { getFileSize, getIcon, validateFiles } from '../../utils/functions';

class CreditTransactionRequestFormDetails extends Component {
  constructor (props) {
    super(props);

    this.rejectedFiles = [];

    this._onDrop = this._onDrop.bind(this);
    this._removeFile = this._removeFile.bind(this);
  }

  _onDrop (files) {
    const acceptedFiles = validateFiles(files);
    const rejectedFiles = files.filter(file => !acceptedFiles.includes(file));

    const attachedFiles = [
      ...this.props.fields.files,
      ...acceptedFiles
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

    this.rejectedFiles = [
      ...this.rejectedFiles,
      ...rejectedFiles
    ];
  }

  _removeFile (file) {
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
      <div className="credit-transaction-request-form-details">
        <div className="row main-form">
          <div className="col-md-6">
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

              {this.props.categories.find(category => (
                category.types.find(type => (
                  type.theType === 'Evidence' && type.id === this.props.fields.documentType.id
                ))
              )) && [
                <div className="row" key="milestones">
                  <div className="form-group col-md-12">
                    <label htmlFor="milestone">Milestone:
                      <input
                        className="form-control"
                        id="milestone"
                        name="milestone"
                        onChange={this.props.handleInputChange}
                        placeholder="Record section of agreement containing milestone"
                        required="required"
                        type="text"
                        value={this.props.fields.milestone}
                      />
                    </label>
                  </div>
                </div>,
                <div className="row" key="agreement-name">
                  <div className="form-group col-md-12">
                    <label htmlFor="title">Part 3 Agreement Name:
                      <input
                        className="form-control"
                        id="title"
                        name="title"
                        onChange={this.props.handleInputChange}
                        required="required"
                        type="text"
                        value={this.props.fields.title}
                      />
                    </label>
                  </div>
                </div>,
                <div className="row" key="agreement-comments">
                  <div className="form-group col-md-12">
                    <label htmlFor="comment">Comment:
                      <textarea
                        className="form-control"
                        id="comment"
                        name="comment"
                        onChange={this.props.handleInputChange}
                        placeholder="Provide an explanation of your Part 3 award milestone completion"
                        rows="5"
                      />
                    </label>
                  </div>
                </div>
              ]}

              {this.props.categories.find(category => (
                category.types.find(type => (
                  type.theType !== 'Evidence' && type.id === this.props.fields.documentType.id
                ))
              )) &&
              <div className="row" key="title">
                <div className="form-group col-md-12">
                  <label htmlFor="title">Title:
                    <input
                      className="form-control"
                      id="title"
                      name="title"
                      onChange={this.props.handleInputChange}
                      required="required"
                      type="text"
                      value={this.props.fields.title}
                    />
                  </label>
                </div>
              </div>
              }
              <div className="row">
                <div className="form-group col-md-12">
                  <label htmlFor="record-number">Record Number:
                    <input
                      className="form-control"
                      id="record-number"
                      name="recordNumber"
                      onChange={this.props.handleInputChange}
                      type="text"
                      value={this.props.fields.recordNumber}
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
                  <div className="btn-group" role="group" id="document-type">
                    {this.props.categories &&
                      this.props.categories.map(category => (
                        (category.types.map(t => (
                          <button
                            className={`btn btn-default ${(this.props.fields.documentType.id === t.id) ? 'active' : ''}`}
                            key={t.id}
                            name="documentType"
                            onClick={this.props.handleInputChange}
                            type="button"
                            value={t.id}
                          >
                            {t.description}
                          </button>
                        )))
                      ))}
                  </div>
                </label>
              </div>
            </div>

            <div className="row main-form">
              <div className="form-group col-md-12">
                <label htmlFor="comment">Attachments:
                  <Dropzone
                    activeClassName="is-dragover"
                    className="dropzone"
                    onDrop={this._onDrop}
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
              <div className="form-group col-md-12 main-form">
                <div>Files:
                  <ul className="files">
                    {this.props.fields.files.map(file => (
                      <li key={file.name}>
                        <span className="icon">
                          <FontAwesomeIcon icon={getIcon(file.type)} />
                        </span>
                        {file.name} - {getFileSize(file.size)}
                        <button type="button" onClick={() => this._removeFile(file)}>
                          <FontAwesomeIcon icon="minus-circle" />
                        </button>
                      </li>
                    ))}
                    {this.props.fields.files.length === 0 &&
                    <li>- No files selected.</li>
                    }
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-12 main-form">
                <div>Invalid Files/File Types (These files will not be uploaded):
                  <ul className="files">
                    {this.rejectedFiles.map(file => (
                      <li key={file.name}>
                        <span className="icon">
                          <FontAwesomeIcon icon={getIcon(file.type)} />
                        </span>
                        {file.name} - {getFileSize(file.size)}
                        {file.size > CONFIG.SECURE_DOCUMENT_UPLOAD.MAX_FILE_SIZE &&
                        <span className="error-message"> File size too large </span>
                        }
                      </li>
                    ))}
                    {this.rejectedFiles.length === 0 &&
                      <li>- None</li>
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
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    documentType: PropTypes.shape({
      id: PropTypes.number
    }),
    files: PropTypes.arrayOf(PropTypes.shape()),
    milestone: PropTypes.string,
    recordNumber: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default CreditTransactionRequestFormDetails;
