/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Errors from '../../app/components/Errors';
import LocalTimestamp from '../../app/components/LocalTimestamp';
import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import LinkedCreditTransactions from './LinkedCreditTransactions';
import SecureFileSubmissionComment from './SecureFileSubmissionComment';
import SecureFileSubmissionCommentButtons from './SecureFileSubmissionCommentButtons';
import SecureFileSubmissionCommentForm from './SecureFileSubmissionCommentForm';
import SecureFileSubmissionFileAttachments from './SecureFileSubmissionFileAttachments';

const SecureFileSubmissionDetails = props => (
  <div className="page-credit-transaction-request-details">
    <h1>{props.item.type.description} Submission</h1>

    <div className="credit-transaction-request-details">

      <div className="row">
        <div className="form-group col-md-12">
          <label htmlFor="document-status">Document Submission Status:
            <div>
              <span className="value">{props.item.status.status}</span> on
              <span className="value"> <LocalTimestamp iso8601Date={props.item.updateTimestamp} /></span>
            </div>
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

          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="title">{props.item.type.theType === 'Evidence' ? 'Part 3 Agreement Name' : 'Title'}:
                <div className="value">
                  {props.item.title}
                </div>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-12">
              <label className="label-credit-transactions" htmlFor="credit-transactions">Linked Credit Transactions:
                {(props.item.creditTrades && props.item.creditTrades.length > 0)
                  ? (
                    <LinkedCreditTransactions
<<<<<<< HEAD
                      canLink={props.canLink}
=======
>>>>>>> master
                      creditTrades={props.item.creditTrades}
                      selectLinkIdForModal={props.selectLinkIdForModal}
                    />)
                  : (<div className="value">None</div>)
                }
                {props.canLink &&
                <button
                  id="add-credit-transfer-link"
                  className="btn btn-primary"
                  data-target="#modalCreditTransfer"
                  data-toggle="modal"
                  onClick={() => props.addLink()}
                  type="button"
                >
                  {Lang.BTN_LINK_CREDIT_TRANSACTION}
                </button>
                }
              </label>
            </div>
          </div>
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
              <SecureFileSubmissionFileAttachments
                attachments={props.item.attachments}
                availableActions={props.availableActions}
                fields={props.fields}
                handleRecordNumberChange={props.handleRecordNumberChange}
                status={props.item.status}

              />
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

      <div className="row">
        <div className="form-group col-md-12">
          <label htmlFor="comments">Comments:</label>
          {props.item.comments.length === 0 &&
          !props.isCommenting &&
            <div className="form-group value">None</div>
          }
          {props.item.comments.map(c => (
            <SecureFileSubmissionComment comment={c} key={c.id} saveComment={props.saveComment} />
          ))
          }
          <SecureFileSubmissionCommentButtons
            addComment={props.addComment}
            canComment={props.canComment}
            canCreatePrivilegedComment={props.canCreatePrivilegedComment}
            isCommenting={props.isCommenting}
          />
          {props.isCommenting &&
          <SecureFileSubmissionCommentForm
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
      ['Draft', 'Security Scan Failed'].includes(props.item.status.status) &&
      <button
        className="btn btn-default"
        type="button"
        onClick={() => history.push(SECURE_DOCUMENT_UPLOAD.EDIT.replace(':id', props.item.id))}
      >
        <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
      </button>
      }
      {props.availableActions.includes('Draft') &&
      ['Submitted', 'Pending Submission'].includes(props.item.status.status) &&
      <button
        className="btn btn-danger"
        data-target="#confirmRescind"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="undo-alt" /> {Lang.BTN_RESCIND_AS_DRAFT}
      </button>
      }
      {props.availableActions.includes('Submitted') &&
      <button
        className="btn btn-primary"
        data-target="#confirmSubmit"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="share-square" /> {Lang.BTN_SUBMIT}
      </button>
      }
      {props.availableActions.includes('Received') &&
      <button
        className="btn btn-primary"
        data-target="#confirmReceived"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="check" /> {Lang.BTN_RECEIVED}
      </button>
      }
      {props.availableActions.includes('Archived') &&
      <TooltipWhenDisabled
        disabled={props.formValidationMessage.length > 0}
        title={props.formValidationMessage}
      >
        <button
          className="btn btn-primary"
          data-target="#confirmArchived"
          data-toggle="modal"
          disabled={props.formValidationMessage.length > 0}
          type="button"
        >
          <FontAwesomeIcon icon="archive" /> {Lang.BTN_ARCHIVE}
        </button>
      </TooltipWhenDisabled>
      }
    </div>
  </div>
);

SecureFileSubmissionDetails.defaultProps = {
  errors: {},
  formValidationMessage: []
};

SecureFileSubmissionDetails.propTypes = {
  addComment: PropTypes.func.isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  cancelComment: PropTypes.func.isRequired,
  addLink: PropTypes.func.isRequired,
  canComment: PropTypes.bool.isRequired,
  canLink: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  errors: PropTypes.shape(),
  fields: PropTypes.shape({
    recordNumbers: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  formValidationMessage: PropTypes.arrayOf(PropTypes.string),
  handleRecordNumberChange: PropTypes.func.isRequired,
  isCommenting: PropTypes.bool.isRequired,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  item: PropTypes.shape().isRequired,
  saveComment: PropTypes.func.isRequired,
  selectLinkIdForModal: PropTypes.func.isRequired
};

export default SecureFileSubmissionDetails;
