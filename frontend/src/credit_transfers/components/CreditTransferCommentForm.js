import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Lang from '../../constants/langEnUs';

class CreditTransferCommentForm extends Component {
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
    };
  }

  render () {
    return (
      <div className="comment-form well transparent row">
        <h2>{this.props.isCreatingPrivilegedComment ? Lang.TEXT_ADD_INTERNAL_COMMENT_HEADING
          : Lang.TEXT_ADD_COMMENT_HEADING}
        </h2>
        <div className="form-group note col-xs-8">
          <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="comment">Comment:
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
          </form>
          <div className="text-right">
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
                privilegedAccess: this.props.isCreatingPrivilegedComment
              })}
            >
              {Lang.BTN_SAVE_COMMENT}
            </button>
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
  comment: ''
};

CreditTransferCommentForm.propTypes = {
  comment: PropTypes.string,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  saveComment: PropTypes.func.isRequired,
  cancelComment: PropTypes.func.isRequired
};

export default CreditTransferCommentForm;
