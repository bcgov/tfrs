/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {getUser, getUserByUsername} from '../actions/userActions';
import UserDetails from './components/UserDetails';

class UserViewContainer extends Component {
  componentWillMount () {
    if (this.props.match.params.id) {
      this.loadByID(this.props.match.params.id);
    } else if (this.props.match.params.username) {
      this.loadByUsername(this.props.match.params.username);
    }
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadByID(newProps.match.params.id);
    } else if (prevProps.match.params.username !== newProps.match.params.username) {
      this.loadByUsername(newProps.match.params.username);
    }
  }

  loadByID (id) {
    this.props.getUser(id);
  }

  loadByUsername (username) {
    this.props.getUserByUsername(username);
  }

  render () {
    return (
      <UserDetails
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
  },
  match: {
    params: {
      id: null,
      username: null
    }
  }
};

UserViewContainer.propTypes = {
  getUser: PropTypes.func.isRequired,
  getUserByUsername: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    }).isRequired
  }).isRequired,
  user: PropTypes.shape({
    details: PropTypes.shape({}),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  })
};

const mapStateToProps = state => ({
  user: {
    details: state.rootReducer.userViewRequest.user,
    error: state.rootReducer.userViewRequest.error,
    isFetching: state.rootReducer.userViewRequest.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getUser: bindActionCreators(getUser, dispatch),
  getUserByUsername: bindActionCreators(getUserByUsername, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserViewContainer);
