/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getDocumentUpload } from '../actions/documentUploads';

import CreditTransactionRequestDetails from './components/CreditTransactionRequestDetails';

class CreditTransactionRequestDetailContainer extends Component {
  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.getDocumentUpload(id);
  }

  render () {
    const { isFetching, item } = this.props.documentUpload;

    return (<CreditTransactionRequestDetails
      isFetching={isFetching}
      item={item}
    />);
  }
}

CreditTransactionRequestDetailContainer.defaultProps = {
  errors: {}
};

CreditTransactionRequestDetailContainer.propTypes = {
  documentUpload: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    item: PropTypes.shape({
    })
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
  }).isRequired
};

const mapStateToProps = state => ({
  documentUpload: {
    errors: state.rootReducer.documentUpload.errors,
    isFetching: state.rootReducer.documentUpload.isFetching,
    item: state.rootReducer.documentUpload.item
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  getDocumentUpload: bindActionCreators(getDocumentUpload, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditTransactionRequestDetailContainer);
