import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import UserLoginHistoryPage from './components/UserLoginHistoryPage'
import { getUserLoginHistory } from '../../actions/userLoginHistory'
import AdminTabs from '../components/AdminTabs'

class UserLoginHistoryContainer extends Component {
  componentDidMount () {
    this.props.getUserLoginHistory()
  }

  render () {
    return ([
      <AdminTabs
        active="user-login-history"
        key="nav"
        loggedInUser={this.props.loggedInUser}
      />,
      <UserLoginHistoryPage
        userLoginHistory={this.props.userLoginHistory}
        key="user-login-history"
        loggedInUser={this.props.loggedInUser}
      />
    ])
  }
}

UserLoginHistoryContainer.propTypes = {
  userLoginHistory: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  getUserLoginHistory: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape().isRequired
}

const mapStateToProps = state => ({
  userLoginHistory: {
    isFetching: state.rootReducer.userLoginHistory.isFetching,
    items: state.rootReducer.userLoginHistory.items
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser
})

const mapDispatchToProps = dispatch => ({
  getUserLoginHistory: bindActionCreators(getUserLoginHistory, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserLoginHistoryContainer)
