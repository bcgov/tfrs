/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUser, getUserByUsername } from '../actions/userActions'
import UserDetails from './components/UserDetails'
import { withRouter } from '../utils/withRouter'

class UserViewContainer extends Component {
  componentDidMount () {
    if (this.props.params.id) {
      this.loadByID(this.props.params.id)
    } else if (this.props.params.username) {
      this.loadByUsername(this.props.params.username)
    }
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.params.id !== newProps.params.id) {
      this.loadByID(newProps.params.id)
    } else if (prevProps.params.username !== newProps.params.username) {
      this.loadByUsername(newProps.params.username)
    }
  }

  loadByID (id) {
    this.props.getUser(id)
  }

  loadByUsername (username) {
    this.props.getUserByUsername(username)
  }

  render () {
    return (
      <UserDetails
        loggedInUser={this.props.loggedInUser}
        user={this.props.user}
      />
    )
  }
}

UserViewContainer.defaultProps = {
  user: {
    details: {},
    error: {},
    isFetching: true
  }
}

UserViewContainer.propTypes = {
  getUser: PropTypes.func.isRequired,
  getUserByUsername: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    details: PropTypes.shape({}),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  })
}

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  user: {
    details: state.rootReducer.userViewRequest.user,
    error: state.rootReducer.userViewRequest.error,
    isFetching: state.rootReducer.userViewRequest.isFetching
  }
})

const mapDispatchToProps = dispatch => ({
  getUser: bindActionCreators(getUser, dispatch),
  getUserByUsername: bindActionCreators(getUserByUsername, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserViewContainer))
