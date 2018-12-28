/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../app/components/Loading';

import { getDocumentUpload, partialUpdateDocument } from '../actions/documentUploads';
import Modal from '../app/components/Modal';
import history from '../app/History';
import CreditTransactionRequestDetails from './components/CreditTransactionRequestDetails';
import DOCUMENT_STATUSES from '../constants/documentStatuses';
import SECURE_DOCUMENT_UPLOAD from '../constants/routes/SecureDocumentUpload';
import toastr from '../utils/toastr';

class CreditTransactionRequestDetailContainer extends Component {
  constructor (props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getDocumentUpload(id);
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

  render () {
    const { item, success } = this.props.documentUpload;
    let availableActions = [];

    if (success) {
      availableActions = item.actions.map(action => (
        action.status
      ));

      return ([
        <CreditTransactionRequestDetails
          availableActions={availableActions}
          item={item}
          key="details"
        />,
        <Modal
          handleSubmit={(event) => {
            this._handleSubmit(event, DOCUMENT_STATUSES.received);
          }}
          id="confirmSubmit"
          key="confirmSubmit"
        >
          Are you sure you want to add this request?
        </Modal>
      ]);
    }

    return <Loading />;
  }
}

CreditTransactionRequestDetailContainer.defaultProps = {
  errors: {}
};

CreditTransactionRequestDetailContainer.propTypes = {
  documentUpload: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number
    }),
    success: PropTypes.bool
  }).isRequired,
  errors: PropTypes.shape({}),
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
  partialUpdateDocument: PropTypes.func.isRequired
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
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch),
  partialUpdateDocument: bindActionCreators(partialUpdateDocument, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditTransactionRequestDetailContainer);
