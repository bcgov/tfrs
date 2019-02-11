/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import axios from 'axios';

import Errors from '../../app/components/Errors';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import { getFileSize, getIcon, getScanStatusIcon } from '../../utils/functions';
import CreditTransactionRequestComment from './CreditTransactionRequestComment';
import CreditTransactionRequestCommentButtons from './CreditTransactionRequestCommentButtons';
import CreditTransactionRequestCommentForm from './CreditTransactionRequestCommentForm';

const CreditTransactionRequestDetails = props => (
  <div className="page-credit-transaction-request-details">
    <h1>{props.item.type.description} Submission</h1>

    <div className="credit-transaction-request-details">

      <div className="row">
        <div className="form-group col-md-12">
          <label htmlFor="document-status">Document Submission Status:
            <div className="value">{props.item.status.status}</div>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="compliance-period">Compliance Period:
                <div className="value">{props.item.compliancePeriod.description}</div>
              </label>
            </div>
          </div>

          {props.item.milestone &&
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="milestone-id">Milestone:
                <div className="value">{props.item.milestone.milestone}</div>
              </label>
            </div>
          </div>
          }

          {props.item.type.theType === 'Evidence' &&
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="agreement-name">Part 3 Agreement Name:
                <div className="value">
                  {props.item.title}
                </div>
              </label>
            </div>
          </div>
          }

          {props.item.type.theType !== 'Evidence' &&
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="agreement-name">Title:
                <div className="value">
                  {props.item.title}
                </div>
              </label>
            </div>
          </div>
          }
        </div>

        <div className="col-md-6">
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="document-type">Attachment Type:
                <div className="value">
                  {props.item.type.description}
                </div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="document-type">Attachments:</label>
              <div className="file-submission-attachments">
                <div className="row">
                  <div className="col-md-7 header">Filename</div>
                  <div className="col-md-2 size header">Size</div>
                  <div className="col-md-3 security-scan-status header">Security Scan</div>
                </div>
                {props.item.attachments.map(attachment => (
                  <div className="row" key={attachment.url}>
                    <div className="col-md-7 filename">
                      <span className="icon">
                        <FontAwesomeIcon icon={getIcon(attachment.mimeType)} fixedWidth />
                      </span>
                      <button
                        className="text"
                        onClick={() => {
                          axios.get(attachment.url, {
                            responseType: 'blob'
                          }).then((response) => {
                            const objectURL =
                              window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = objectURL;
                            link.setAttribute('download', attachment.filename);
                            document.body.appendChild(link);
                            link.click();
                          });
                        }}
                        type="button"
                      >
                        {attachment.filename}
                      </button>
                    </div>

                    <div className="col-md-2 size">
                      <span>{getFileSize(attachment.size)}</span>
                    </div>

                    <div className="col-md-3 security-scan-status">
                      <span className="security-scan-icon" data-security-scan-status={attachment.securityScanStatus}>
                        <FontAwesomeIcon
                          icon={getScanStatusIcon(attachment.securityScanStatus)}
                          fixedWidth
                        />
                      </span>
                    </div>
                  </div>
                ))}
                {props.item.attachments.length === 0 &&
                  <div className="row">
                    <div className="col-md-12">No files attached.</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(props.errors).length > 0 &&
        <div className="row">
          <div className="col-md-12">
            <Errors errors={props.errors} />
          </div>
        </div>
      }

      {props.item.comments.length > 0 && <h3 className="comments-header">Comments</h3>}
      {props.item.comments.map(c => (
        <CreditTransactionRequestComment comment={c} key={c.id} saveComment={props.saveComment} />
      ))
      }
      {!['Archived', 'Received'].includes(props.item.status.status) &&
        <div className="row">
          <div className="col-md-12">
            <CreditTransactionRequestCommentButtons
              addComment={props.addComment}
              canComment={props.canComment}
              canCreatePrivilegedComment={props.canCreatePrivilegedComment}
              isCommenting={props.isCommenting}
            />
            {props.isCommenting &&
            <CreditTransactionRequestCommentForm
              cancelComment={props.cancelComment}
              isCreatingPrivilegedComment={props.isCreatingPrivilegedComment}
              saveComment={props.saveComment}
            />
            }
          </div>
        </div>
      }
    </div>

    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.goBack()}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>

      {props.availableActions.includes('Cancelled') &&
        <button
          className="btn btn-danger"
          data-target="#confirmDelete"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
        </button>
      }

      {props.availableActions.includes('Draft') &&
      <button
        className="btn btn-default"
        type="button"
        onClick={() => history.push(SECURE_DOCUMENT_UPLOAD.EDIT.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
      }

      {props.availableActions.includes('Submitted') &&
      <button
        className="btn btn-primary"
        data-target="#confirmSubmit"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="share-square" /> Submit
      </button>
      }
      {props.availableActions.includes('Received') &&
      <button
        className="btn btn-primary"
        data-target="#confirmReceived"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="check" /> Received
      </button>
      }
    </div>
  </div>
);

CreditTransactionRequestDetails.defaultProps = {
  errors: {}
};

CreditTransactionRequestDetails.propTypes = {
  addComment: PropTypes.func.isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  cancelComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  errors: PropTypes.shape(),
  isCommenting: PropTypes.bool.isRequired,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired,
  saveComment: PropTypes.func.isRequired
};

export default CreditTransactionRequestDetails;
