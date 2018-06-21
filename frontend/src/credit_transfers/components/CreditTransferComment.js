import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as Lang from '../../constants/langEnUs';

const CreditTransferComment = props => (
  <div className="comment panel panel-info">
    <div className="panel-heading">
      <div className="row">
        <div className="col-xs-6">
          {props.comment.createUser.displayName}<br />
          {props.comment.createUser.organization.name}
        </div>
        <div className="col-xs-6 text-right">
          <span className="align-middle">{props.comment.updateTimestamp}</span>
        </div>
      </div>
    </div>
    <div className="panel-body">
      <div className="col-xs-11 comment-text">
        {props.comment.comment}
      </div>
      <div className="col-xs-1 text-right">
        {props.comment.privilegedAccess &&
        <span title={Lang.TEXT_VISIBLE_TO_GOV}>
          <FontAwesomeIcon size="2x" icon="lock" className="text-success" />
        </span>}
        {props.comment.privilegedAccess ||
        <span title={Lang.TEXT_VISIBLE_TO_ALL}>
          <FontAwesomeIcon size="2x" icon="unlock" className="" />
        </span>
        }
      </div>
    </div>
  </div>
);

CreditTransferComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    createTimestamp: PropTypes.string,
    updateTimestamp: PropTypes.string,
    comment: PropTypes.string,
    privilegedAccess: PropTypes.bool,
    createUser: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      displayName: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.number
      })
    })
  }).isRequired
};

export default CreditTransferComment;
