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
  static getPlaceholders (documentType) {
    if (documentType && documentType.theType === 'Application') {
      return {
        titlePlaceholder: 'e.g. Cold Weather Biodiesel, Co-processing, etc.',
        commentPlaceholder: 'Optional: provide any additional information with respect to your P3A Application submission'
      };
    }

    if (documentType && documentType.theType === 'Evidence') {
      return {
        titlePlaceholder: 'e.g. P3A-18COM1, Cold Weather Biodiesel, etc.',
        commentPlaceholder: 'Optional: provide any additional information with respect to your P3A evidence submission'
      };
    }

    if (documentType && documentType.theType === 'Records') {
      return {
        titlePlaceholder: 'e.g. Compliance Report, Supplemental Report, Exclusion Report, etc.',
        commentPlaceholder: 'Optional: provide any additional information with respect to your submission'
      };
    }

    return {
      titlePlaceholder: '',
      commentPlaceholder: 'Optional: provide any additional information with respect to your submission'
    };
  }

  constructor (props) {
    super(props);

    this.documentType = null;
    this.rejectedFiles = [];

    this._onDrop = this._onDrop.bind(this);
    this._removeAttachment = this._removeAttachment.bind(this);
    this._removeFile = this._removeFile.bind(this);
  }

  componentWillReceiveProps (props) {
    if (props.fields.documentType) {
      this.documentType = this._getType(props.fields.documentType.id);
    }
  }

  _getType (typeId) {
    let documentType = null;

    this.props.categories.forEach((category) => {
      const foundType = category.types
        .find(type => (type.id === typeId));

      if (foundType) {
        documentType = foundType;
      }
    });

    this.props.handlePageTitle(documentType.description);

    return documentType;
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

  _removeAttachment (attachment) {
    const found = this.props.fields.attachments.findIndex(item => (item === attachment));
    this.props.fields.attachments.splice(found, 1);

    const attachedFiles = this.props.fields.attachments;

    this.props.handleInputChange({
      target: {
        name: 'attachments',
        value: attachedFiles
      }
    });
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
    const { titlePlaceholder, commentPlaceholder } = CreditTransactionRequestFormDetails
      .getPlaceholders(this.documentType);

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
                    value={this.props.fields.compliancePeriod.id}
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

              {this.documentType && this.documentType.theType === 'Evidence' &&
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="milestone">Milestone:
                      <input
                        className="form-control"
                        id="milestone"
                        name="milestone"
                        onChange={this.props.handleInputChange}
                        placeholder="e.g. Milestone B.2 - Construction, Milestone B.4 & B.5, etc."
                        required="required"
                        type="text"
                        value={this.props.fields.milestone}
                      />
                    </label>
                  </div>
                </div>
              }

              <div className="row" key="title">
                <div className="form-group col-md-12">
                  <label htmlFor="title">
                    {this.documentType &&
                      this.documentType.theType === 'Evidence' ? 'Part 3 Agreement' : 'Title'}:
                    <input
                      className="form-control"
                      id="title"
                      name="title"
                      onChange={this.props.handleInputChange}
                      placeholder={titlePlaceholder}
                      required="required"
                      type="text"
                      value={this.props.fields.title}
                    />
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-12">
                  <label htmlFor="comment">Comment:
                    <textarea
                      className="form-control"
                      id="comment"
                      name="comment"
                      onChange={this.props.handleInputChange}
                      placeholder={commentPlaceholder}
                      rows="5"
                      value={this.props.fields.comment}
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
                    disabled={this.props.edit}
                    id="document-type"
                    name="documentType"
                    onChange={this.props.handleInputChange}
                    required="required"
                    value={this.props.fields.documentType.id}
                  >
                    {this.props.categories &&
                      this.props.categories.map(category => (
                        (category.types.map(t => (
                          <option
                            key={t.id}
                            value={t.id}
                          >
                            {t.description}
                          </option>
                        )))
                      ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="row main-form">
              <div className="form-group col-md-12">
                <label htmlFor="attachment">Attachments:
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
                    {this.props.fields.attachments.map(attachment => (
                      <li key={attachment.filename}>
                        <span className="icon">
                          <FontAwesomeIcon icon={getIcon(attachment.mimeType)} />
                        </span>
                        <span className="filename">{attachment.filename}</span>
                        <span> - {getFileSize(attachment.size)}
                          <button type="button" onClick={() => this._removeAttachment(attachment)}>
                            <FontAwesomeIcon icon="minus-circle" />
                          </button>
                        </span>
                      </li>
                    ))}
                    {this.props.fields.attachments.length === 0 &&
                    this.props.fields.files.length === 0 &&
                    <li>- No files selected.</li>
                    }
                    {this.props.fields.files.map(file => (
                      <li key={file.name}>
                        <span className="icon">
                          <FontAwesomeIcon icon={getIcon(file.type)} />
                        </span>
                        <span className="filename">{file.name}</span>
                        <span> - {getFileSize(file.size)}
                          <button type="button" onClick={() => this._removeFile(file)}>
                            <FontAwesomeIcon icon="minus-circle" />
                          </button>
                        </span>
                      </li>
                    ))}
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
                        <span className="filename">{file.name}</span>
                        <span> - {getFileSize(file.size)}</span>
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
  children: null,
  edit: false
};

CreditTransactionRequestFormDetails.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  edit: PropTypes.bool,
  fields: PropTypes.shape({
    attachments: PropTypes.arrayOf(PropTypes.shape()),
    comment: PropTypes.string,
    compliancePeriod: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.number
    }),
    documentType: PropTypes.shape({
      id: PropTypes.number
    }),
    files: PropTypes.arrayOf(PropTypes.shape()),
    milestone: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handlePageTitle: PropTypes.func.isRequired
};

export default CreditTransactionRequestFormDetails;
