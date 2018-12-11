/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CreditTransactionRequestDetailContainer extends Component {
  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  loadData (id) {
    this.props.invalidateCreditTransfer();
    this.props.getCreditTransactionRequest(id);
  }

  render () {
    const { isFetching, item, loggedInUser } = this.props;

    return (<CreditTransactionRequestDetails />);
  }
}

CreditTransactionRequestDetailContainer.defaultProps = {
  errors: {},
  item: {}
};

CreditTransactionRequestDetailContainer.propTypes = {
  errors: PropTypes.shape({}),
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
  }),
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
  errors: state.rootReducer.creditTransfer.errors,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditTransactionRequestDetailContainer);
