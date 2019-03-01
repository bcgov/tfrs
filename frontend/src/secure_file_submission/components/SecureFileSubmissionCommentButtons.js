import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const SecureFileSubmissionCommentButtons = props => (
  <div>
    {(props.canComment && !props.isCommenting) &&
    <button
      id="credit-transfer-add-comment"
      className="btn btn-info"
      onClick={() => props.addComment()}
      disabled={props.isCommenting}
      type="button"
    >
      {Lang.BTN_COMMENT}
    </button>
    }
    {(props.canCreatePrivilegedComment && !props.isCommenting) &&
    <button
      id="credit-transfer-add-internal-comment"
      className="btn btn-primary"
      onClick={() => props.addComment(true)}
      disabled={props.isCommenting}
      type="button"
    >
      {Lang.BTN_COMMENT_PRIVILEGED}
    </button>
    }
  </div>
);

SecureFileSubmissionCommentButtons.propTypes = {
  canComment: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  addComment: PropTypes.func.isRequired,
  isCommenting: PropTypes.bool.isRequired
};

export default SecureFileSubmissionCommentButtons;
