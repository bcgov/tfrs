/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading from '../app/components/Loading';
import SecureFileSubmissionUtilityFunctions from './SecureFileSubmissionUtilityFunctions';

import {
  addCommentToDocument, deleteDocumentUpload, getDocumentUpload, linkDocument, partialUpdateDocument, unlinkDocument,
  updateCommentOnDocument
} from '../actions/documentUploads';
import Modal from '../app/components/Modal';
import history from '../app/History';
import SecureFileSubmissionDetails from './components/SecureFileSubmissionDetails';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';
import LinkedCreditTransferSelection from "./components/LinkedCreditTransferSelection";
import {getCreditTransfers} from "../actions/creditTransfersActions";

class SecureFileSubmissionDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        recordNumbers: []
      },
      hasCommented: false,
      isCommenting: false,
      isCreatingPrivilegedComment: false,
      isLinking: false
    };

    this._addComment = this._addComment.bind(this);
    this._cancelComment = this._cancelComment.bind(this);
    this._getDocumentStatus = this._getDocumentStatus.bind(this);
    this._handleRecordNumberChange = this._handleRecordNumberChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._saveComment = this._saveComment.bind(this);
    this._addLink = this._addLink.bind(this);
    this._cancelLink = this._cancelLink.bind(this);
    this._establishLink = this._establishLink.bind(this);
    this._unLink = this._unLink.bind(this);

  }

  componentDidMount() {
    this.loadData(this.props.match.params.id);
  }

  loadData(id) {
    this.props.getDocumentUpload(id);
  }

  _addComment(privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    });
  }

  _cancelComment() {
    this.setState({
      isCommenting: false,
      isCreatingPrivilegedComment: false
    });
  }


  _cancelLink() {
    this.setState({
      isLinking: false
    });
  }

  _addLink() {

    this.props.fetchCreditTransfers();

    this.setState({
      isLinking: true
    })
  }

  _establishLink(id) {
    let docid =  this.props.documentUpload.item.id;

    this.setState({
      isLinking: false
    });

    let data = {
      'creditTrade': id,
    };

    this.props.linkDocument(docid, data).then( response => {
        this.props.getDocumentUpload(this.props.documentUpload.item.id);
      }
    );
  }

  _unLink(id) {
    let docid =  this.props.documentUpload.item.id;

    let data = {
      'creditTrade': id,
    };

    this.props.unlinkDocument(docid, data).then( response => {
        this.props.getDocumentUpload(this.props.documentUpload.item.id);
      }
    );
  }

  _deleteCreditTransferRequest(id) {
    this.props.deleteDocumentUpload(id).then(() => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload(null, 'Draft deleted.');
    });
  }

  _getDocumentStatus(status) {
    return this.props.referenceData.documentStatuses.find(documentStatus =>
      (documentStatus.status === status));
  }

  _handleRecordNumberChange(event, index, id) {
    const {value, name} = event.target;
    const fieldState = {...this.state.fields};

    fieldState[name][index] = {
      id,
      value
    };

    this.setState({
      fields: fieldState
    });
  }

  _handleSubmit(event, status) {
    event.preventDefault();

    const {id} = this.props.documentUpload.item;

    // API data structure
    const data = {
      status: status.id
    };

    if (this.state.fields.recordNumbers.length > 0) {
      data.recordNumbers = this.state.fields.recordNumbers;
    }

    this.props.partialUpdateDocument(id, data).then((response) => {
      history.push(SECURE_DOCUMENT_UPLOAD.LIST);
      toastr.documentUpload(status.status);
    });

    return true;
  }

  _saveComment(comment) {
    const {item} = this.props.documentUpload;

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

  renderStatic() {
    const {
      errors, item, isFetching, success
    } = this.props.documentUpload;
    let availableActions = [];

    if (success || (!isFetching && Object.keys(errors).length > 0)) {
      availableActions = item.actions.map(action => (
        action.status
      ));

      return ([
        <SecureFileSubmissionDetails
          addComment={this._addComment}
          availableActions={availableActions}
          cancelComment={this._cancelComment}
          addLink={this._addLink}
          unLink={this._unLink}
          canComment={SecureFileSubmissionUtilityFunctions
            .canComment(this.props.loggedInUser, this.props.documentUpload.item)}
          canCreatePrivilegedComment={
            SecureFileSubmissionUtilityFunctions.canCreatePrivilegedComment(
              this.props.loggedInUser,
              this.props.documentUpload.item
            )
          }
          canLink={SecureFileSubmissionUtilityFunctions.canLinkCreditTransfer(this.props.loggedInUser,
            this.props.documentUpload.item)}
          errors={errors}
          fields={this.state.fields}
          handleRecordNumberChange={this._handleRecordNumberChange}
          hasCommented={this.state.hasCommented}
          isCommenting={this.state.isCommenting}
          isCreatingPrivilegedComment={this.state.isCreatingPrivilegedComment}
          item={item}
          key="details"
          saveComment={this._saveComment}
        />,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Received'));
          }}
          id="confirmReceived"
          key="confirmReceived"
        >
          Are you sure you want to mark this as received?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Archived'));
          }}
          id="confirmArchived"
          key="confirmArchived"
        >
          Are you sure you want to archive this submission?
        </Modal>,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, this._getDocumentStatus('Draft'));
          }}
          id="confirmRescind"
          key="confirmRescind"
        >
          Are you sure you want to rescind this submission back to draft?
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
            this._handleSubmit(event, this._getDocumentStatus('Submitted'));
          }}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to securely submit these files to the
          Government of British Columbia?
        </Modal>
      ]);
    }
    return <Loading/>;

  }


  render() {

    if (this.props.isFetching)
      return <Loading/>;

    if (this.state.isLinking) {
      if (this.props.creditTransfers.isFetching) {
        return <Loading/>;
      }

      return (
        <LinkedCreditTransferSelection
          creditTransfers={this.props.creditTransfers.items}
          cancelLink={this._cancelLink}
          establishLink={this._establishLink}
        />)
    }

    return this.renderStatic();

  }
}

SecureFileSubmissionDetailContainer.defaultProps = {};

SecureFileSubmissionDetailContainer.propTypes = {
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
  referenceData: PropTypes.shape({
    documentStatuses: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  updateCommentOnDocument: PropTypes.func.isRequired,
  fetchCreditTransfers: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape
    )
  }),
  linkDocument: PropTypes.func.isRequired,
  unlinkDocument: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  documentUpload: {
    errors: state.rootReducer.documentUpload.errors,
    isFetching: state.rootReducer.documentUpload.isFetching,
    item: state.rootReducer.documentUpload.item,
    success: state.rootReducer.documentUpload.success
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentStatuses: state.rootReducer.referenceData.data.documentStatuses,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  },
  creditTransfers: {
    items: state.rootReducer.creditTransfers.items,
    isFetching: state.rootReducer.creditTransfers.isFetching,
    isSuccessful: state.rootReducer.creditTransfers.success
  }
});

const mapDispatchToProps = dispatch => ({
  addCommentToDocument: bindActionCreators(addCommentToDocument, dispatch),
  deleteDocumentUpload: bindActionCreators(deleteDocumentUpload, dispatch),
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch),
  partialUpdateDocument: bindActionCreators(partialUpdateDocument, dispatch),
  updateCommentOnDocument: bindActionCreators(updateCommentOnDocument, dispatch),
  fetchCreditTransfers: bindActionCreators(getCreditTransfers, dispatch),
  linkDocument: bindActionCreators(linkDocument, dispatch),
  unlinkDocument: bindActionCreators(unlinkDocument, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecureFileSubmissionDetailContainer);
