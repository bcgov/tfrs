import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Lang from '../../constants/langEnUs';

class CreditTransferCommentForm extends Component {
  static titleText (props) {
    if (props.isCommentingOnUnsavedCreditTransfer) {
      return Lang.TEXT_ADD_INITIAL_COMMENT;
    }

    if (props.isEditingExistingComment) {
      return Lang.TEXT_EDIT_COMMENT_HEADING;
    }

    if (props.isCreatingPrivilegedComment) {
      return Lang.TEXT_ADD_INTERNAL_COMMENT_HEADING;
    }

    return Lang.TEXT_ADD_COMMENT_HEADING;
  }

  constructor (props) {
    super(props);
    this.state = {
      comment: props.comment
    };
  }

  componentDidMount () {
    this.commentField.focus();
  }

  handleInputChange (prop) {
    return (e) => {
      this.setState({
        [prop]: e.target.value
      });
      if (this.props.handleCommentChanged != null && prop === 'comment') {
        this.props.handleCommentChanged(e.target.value);
      }
    };
  }

  _renderTextArea () {
    return (
      <label htmlFor="comment">
        <span className="comment-label">
          {this.props.isEditingExistingComment ? 'Edit Comment:' : 'Your Comment:'}
        </span>
        <textarea
          id="credit-transfer-comment"
          className="form-control"
          rows="5"
          name="comment"
          ref={(input) => { this.commentField = input; }}
          placeholder={
            this.props.isCreatingPrivilegedComment
              ? Lang.TEXT_COMMENT_PLACEHOLDER_PRIVILEGED
              : Lang.TEXT_COMMENT_PLACEHOLDER}
          onChange={this.handleInputChange('comment')}
          value={this.state.comment}
        />
      </label>
    );
  }

  render () {
    return (
      <div className={`comment-form row ${this.props.embedded ? '' : 'well'}`}>
        {this.props.embedded ||
        <h2>
          {CreditTransferCommentForm.titleText(this.props)}
        </h2>
        }
        <div className={`note col-xs-8 ${this.props.embedded ? '' : 'form-group'}`}>
          {
            this._renderTextArea()
          }
          <div className="text-right">
            {this.props.embedded ||
              <div>
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={() => this.props.cancelComment()}
                >
                  {Lang.BTN_CANCEL_COMMENT}
                </button>
                {this.props.id &&
                <button
                  id="credit-transfer-delete-comment"
                  className="btn btn-danger"
                  data-toggle="modal"
                  data-target="#confirmDeleteComment"
                  onClick={() => {
                    this.props.selectIdForModal(this.props.id);
                  }}
                  type="button"
                >
                  {Lang.BTN_DELETE}
                </button>
                }
                <button
                  id="credit-transfer-save-comment"
                  className="btn btn-primary"
                  type="button"
                  onClick={() => this.props.saveComment({
                    comment: this.state.comment,
                    privilegedAccess: this.props.isCreatingPrivilegedComment,
                    id: this.props.id
                  })}
                >
                  {Lang.BTN_SAVE}
                </button>
              </div>
            }
          </div>
        </div>
        <div className="col-xs-4 notice">
          <div className={
            `panel disclosure-notice
             ${this.props.isCreatingPrivilegedComment ? 'panel-primary' : 'panel-info'}`
          }

          >
            <div className="alert alert-warning">
              <h4 className="alert-heading">Disclosure Notice</h4>
              <p>{this.props.isCreatingPrivilegedComment ? Lang.TEXT_COMMENT_DISCLOSURE_PRIVILEGED
                : Lang.TEXT_COMMENT_DISCLOSURE}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreditTransferCommentForm.defaultProps = {
  cancelComment: null,
  comment: '',
  embedded: false,
  handleCommentChanged: null,
  id: null,
  isCommentingOnUnsavedCreditTransfer: false,
  isEditingExistingComment: false,
  saveComment: null,
  selectIdForModal: null
};

CreditTransferCommentForm.propTypes = {
  comment: PropTypes.string,
  id: PropTypes.number,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  isEditingExistingComment: PropTypes.bool,
  isCommentingOnUnsavedCreditTransfer: PropTypes.bool,
  embedded: PropTypes.bool,
  saveComment: PropTypes.func,
  cancelComment: PropTypes.func,
  handleCommentChanged: PropTypes.func,
  selectIdForModal: PropTypes.func
};

export default CreditTransferCommentForm;
