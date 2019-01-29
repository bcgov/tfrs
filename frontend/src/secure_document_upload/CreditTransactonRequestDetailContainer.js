/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../app/components/Loading';
import CreditTransactionUtilityFunctions from './CreditTransactionRequestUtilityFunctions';

import {
  addCommentToDocument, deleteDocumentUpload, getDocumentUpload, partialUpdateDocument,
  updateCommentOnDocument
} from '../actions/documentUploads';
import Modal from '../app/components/Modal';
import history from '../app/History';
import CreditTransactionRequestDetails from './components/CreditTransactionRequestDetails';
import DOCUMENT_STATUSES from '../constants/documentStatuses';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';

class CreditTransactionRequestDetailContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      hasCommented: false,
      isCommenting: false,
      isCreatingPrivilegedComment: false
    };

    this._addComment = this._addComment.bind(this);
    this._cancelComment = this._cancelComment.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._saveComment = this._saveComment.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getDocumentUpload(id);
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    });
  }

  _cancelComment () {
    this.setState({
      isCommenting: false,
      isCreatingPrivilegedComment: false
    });
  }

  _deleteCreditTransferRequest (id) {
    this.props.deleteDocumentUpload(id).then(() => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload(null, 'Draft deleted.');
    });
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    const { id } = this.props.documentUpload.item;

    // API data structure
    const data = {
      status: status.id
    };

    this.props.partialUpdateDocument(id, data).then((response) => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload(status.id);
    });

    return true;
  }

  _saveComment (comment) {
    const { item } = this.props.documentUpload;

    // API data structure
    const data = {
      document: item.id,
      comment: comment.comment,
      privilegedAccess: comment.privilegedAccess
    };

    switch (comment.id) {
      case null:
        this.props.addCommentToDocument(data).then(() => {
          this.props.getDocumentUpload(this.props.documentUpload.item.id);
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          });
        }, () => {
        // Failed to update
        });
        break;
      default:
        // we are saving a pre-existing comment
        this.props.updateCommentOnDocument(comment.id, data).then(() => {
          this.props.getDocumentUpload(this.props.documentUpload.item.id);
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          });
        }, () => {
          // Failed to update
        });
    }
  }

  render () {
    const {
      errors, item, isFetching, success
    } = this.props.documentUpload;
    let availableActions = [];

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      availableActions = item.actions.map(action => (
        action.status
      ));

      return ([
        <CreditTransactionRequestDetails
          addComment={this._addComment}
          availableActions={availableActions}
          cancelComment={this._cancelComment}
          canComment={CreditTransactionUtilityFunctions
            .canComment(this.props.loggedInUser, this.props.documentUpload.item)}
          canCreatePrivilegedComment={
            CreditTransactionUtilityFunctions.canCreatePrivilegedComment(
              this.props.loggedInUser,
              this.props.documentUpload.item
            )
          }
          errors={errors}
          hasCommented={this.state.hasCommented}
          isCommenting={this.state.isCommenting}
          isCreatingPrivilegedComment={this.state.isCreatingPrivilegedComment}
          item={item}
          key="details"
          saveComment={this._saveComment}
        />,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, DOCUMENT_STATUSES.received);
          }}
          id="confirmReceived"
          key="confirmReceived"
        >
          Are you sure you want to mark this as received?
        </Modal>,
        <Modal
          handleSubmit={() => this._deleteCreditTransferRequest(item.id)}
          id="confirmDelete"
          key="confirmDelete"
        >
          Are you sure you want to delete this draft?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, DOCUMENT_STATUSES.submitted);
          }}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to submit this request?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

CreditTransactionRequestDetailContainer.defaultProps = {
};

CreditTransactionRequestDetailContainer.propTypes = {
  addCommentToDocument: PropTypes.func.isRequired,
  deleteDocumentUpload: PropTypes.func.isRequired,
  documentUpload: PropTypes.shape({
    errors: PropTypes.shape(),
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number
    }),
    success: PropTypes.bool
  }).isRequired,
  getDocumentUpload: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  partialUpdateDocument: PropTypes.func.isRequired,
  updateCommentOnDocument: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  documentUpload: {
    errors: state.rootReducer.documentUpload.errors,
    isFetching: state.rootReducer.documentUpload.isFetching,
    item: state.rootReducer.documentUpload.item,
    success: state.rootReducer.documentUpload.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addCommentToDocument: bindActionCreators(addCommentToDocument, dispatch),
  deleteDocumentUpload: bindActionCreators(deleteDocumentUpload, dispatch),
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch),
  partialUpdateDocument: bindActionCreators(partialUpdateDocument, dispatch),
  updateCommentOnDocument: bindActionCreators(updateCommentOnDocument, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditTransactionRequestDetailContainer);
