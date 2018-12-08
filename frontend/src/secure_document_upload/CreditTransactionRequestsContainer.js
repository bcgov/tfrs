/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CreditTransactionRequestsPage from './components/CreditTransactionRequestsPage';

import { getDocumentUploads } from '../actions/documentUploads';

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
        title="Secure Document Upload Submissions"
      />
    );
  }
}

CreditTransactionRequestsContainer.defaultProps = {
};

CreditTransactionRequestsContainer.propTypes = {
  getDocumentUploads: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape).isRequired
};

const mapStateToProps = state => ({
  items: state.rootReducer.documentUploads.items
});

const mapDispatchToProps = dispatch => ({
  getDocumentUploads: bindActionCreators(getDocumentUploads, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransactionRequestsContainer);
