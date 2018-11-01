/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUser } from '../actions/userActions';
import UserDetails from './components/UserDetails';

class UserViewContainer extends Component {
  componentWillMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getUser(id);
  }

  render () {
    return (
      <UserDetails
        loggedInUser={this.props.loggedInUser}
        user={this.props.user}
      />
    );
  }
}

UserViewContainer.defaultProps = {
  user: {
    details: {},
    error: {},
    isFetching: true
  }
};

UserViewContainer.propTypes = {
  getUser: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  user: PropTypes.shape({
    details: PropTypes.shape({}),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  })
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  user: {
    details: state.rootReducer.userViewRequest.user,
    error: state.rootReducer.userViewRequest.error,
    isFetching: state.rootReducer.userViewRequest.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getUser: bindActionCreators(getUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserViewContainer);
