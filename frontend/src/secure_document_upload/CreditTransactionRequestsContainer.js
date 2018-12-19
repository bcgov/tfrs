/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CreditTransactionRequestsPage from './components/CreditTransactionRequestsPage';

import { getDocumentUploads, getDocumentUploadURL } from '../actions/documentUploads';

class CreditTransactionRequestsContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getDocumentUploads();
  }

  render () {
    return (
      <CreditTransactionRequestsPage
        categories={this.props.referenceData.documentCategories}
        documentUploads={this.props.documentUploads}
        loggedInUser={this.props.loggedInUser}
        requestURL={this.props.requestURL}
        title="Secure Document Upload Submissions"
      />
    );
  }
}

CreditTransactionRequestsContainer.defaultProps = {
};

CreditTransactionRequestsContainer.propTypes = {
  documentUploads: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getDocumentUploads: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  referenceData: PropTypes.shape({
    documentCategories: PropTypes.arrayOf(PropTypes.shape),
    isFetching: PropTypes.bool,
    isSuccessful: PropTypes.bool
  }).isRequired,
  requestURL: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  documentUploads: {
    isFetching: state.rootReducer.documentUploads.isFetching,
    items: state.rootReducer.documentUploads.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  referenceData: {
    documentCategories: state.rootReducer.referenceData.data.documentCategories,
    isFetching: state.rootReducer.referenceData.isFetching,
    isSuccessful: state.rootReducer.referenceData.success
  }
});

const mapDispatchToProps = dispatch => ({
  getDocumentUploads: bindActionCreators(getDocumentUploads, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestsContainer);
