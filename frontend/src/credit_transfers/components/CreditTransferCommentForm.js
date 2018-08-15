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
        {this.props.isEditingExistingComment ? 'Edit Comment:' : 'Add New Comment:'}
        <textarea
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
      <div className={`comment-form row ${this.props.embedded ? '' : 'well transparent'}`}>
        {this.props.embedded ||
        <h2>
          {CreditTransferCommentForm.titleText(this.props)}
        </h2>
        }
        <div className={`note col-xs-8 ${this.props.embedded ? '' : 'form-group'}`}>
          {
            this.props.embedded ? this._renderTextArea()
              : <form onSubmit={e => e.preventDefault()}>{this._renderTextArea()}</form>
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
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => this.props.saveComment({
                    comment: this.state.comment,
                    privilegedAccess: this.props.isCreatingPrivilegedComment,
                    id: this.props.id
                  })}
                >
                  {Lang.BTN_SAVE_COMMENT}
                </button>
              </div>
            }
          </div>
        </div>
        <div className="col-xs-4">
          <div className={
            `panel disclosure-notice
             ${this.props.isCreatingPrivilegedComment ? 'panel-primary' : 'panel-info'}`
          }

          >
            <div className="panel-heading">Disclosure Notice</div>
            <div className="panel-body">
              {this.props.isCreatingPrivilegedComment ? Lang.TEXT_COMMENT_DISCLOSURE_PRIVILEGED
                : Lang.TEXT_COMMENT_DISCLOSURE}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreditTransferCommentForm.defaultProps = {
  comment: '',
  isEditingExistingComment: false,
  isCommentingOnUnsavedCreditTransfer: false,
  id: null,
  saveComment: null,
  cancelComment: null,
  embedded: false,
  handleCommentChanged: null
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
  handleCommentChanged: PropTypes.func
};

export default CreditTransferCommentForm;
