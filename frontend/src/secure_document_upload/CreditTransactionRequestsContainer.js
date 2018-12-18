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
  requestURL: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  documentUploads: {
    isFetching: state.rootReducer.documentUploads.isFetching,
    items: state.rootReducer.documentUploads.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getDocumentUploads: bindActionCreators(getDocumentUploads, dispatch),
  requestURL: bindActionCreators(getDocumentUploadURL, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestsContainer);
