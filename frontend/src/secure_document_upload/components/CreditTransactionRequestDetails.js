/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import axios from 'axios';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import { getFileSize, getIcon } from '../../utils/functions';
import CreditTransactionRequestComment from './CreditTransactionRequestComment';
import CreditTransactionRequestCommentButtons from './CreditTransactionRequestCommentButtons';
import CreditTransactionRequestCommentForm from './CreditTransactionRequestCommentForm';

const CreditTransactionRequestDetails = props => (
  <div className="page-credit-transaction-request-details">
    <h1>{props.item.type.description}</h1>
    <div className="credit-transaction-request-details">
      <div className="row">
        <div className="col-md-4">
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="attachment-category">Attachment Category:
                <div className="value">&nbsp;</div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="compliance-period">Compliance Period:
                <div className="value">{props.item.compliancePeriod.description}</div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="milestone-id">Milestone:
                <div className="value">&nbsp;</div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="agreement-name">Part 3 Agreement Name:
                <div className="value">
                  {props.item.title}
                </div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="comment">Comment:
                <div className="value">
                  {props.item.comment}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-8">
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
              <label htmlFor="document-type">Attachments:
                <ul className="value files">
                  {props.item.attachments.map(attachment => (
                    <li key={attachment.url}>
                      <span className="icon">
                        <FontAwesomeIcon icon={getIcon(attachment.mimeType)} />
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          axios.get(attachment.url, {
                            responseType: 'blob'
                          }).then((response) => {
                            const objectURL = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = objectURL;
                            link.setAttribute('download', attachment.filename);
                            document.body.appendChild(link);
                            link.click();
                          });
                        }}
                      >
                        {attachment.filename}
                      </button> - {getFileSize(attachment.size)}
                    </li>
                  ))}
                </ul>
              </label>
            </div>
          </div>
        </div>
      </div>

      {props.item.comments.length > 0 && <h3 className="comments-header">Comments</h3>}
      {props.item.comments.map(c => (
        <CreditTransactionRequestComment comment={c} key={c.id} saveComment={props.saveComment} />
      ))
      }
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
    </div>
    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.goBack()}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>
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
};

CreditTransactionRequestDetails.propTypes = {
  addComment: PropTypes.func.isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  cancelComment: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  isCommenting: PropTypes.bool.isRequired,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired,
  saveComment: PropTypes.func.isRequired
};

export default CreditTransactionRequestDetails;
