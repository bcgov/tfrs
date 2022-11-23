import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import ReduxToastr from 'react-redux-toastr'
import { bindActionCreators } from 'redux'

import StatusInterceptor from './components/StatusInterceptor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionTimer from './components/SessionTimer'

import Loading from './components/Loading'
import Login from './Login'
import Router from './router'

// import 'toastr/build/toastr.min.css';
// import 'react-table/react-table.css';
import { loginKeycloakUserSuccess, logout } from '../actions/keycloakActions'
import { getLoggedInUser } from '../actions/userActions'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasErrors: false
    }
  }

  static getDerivedStateFromError (errors) {
    return { hasErrors: true }
  }

  componentDidCatch (_error, info) {
    console.error(_error)
    this.setState({
      hasErrors: true
    })
  }

  componentDidMount () {
    const { keycloak } = this.props
    keycloak.onTokenExpired = () => {
      console.log('token expired, starting refresh')
      keycloak.updateToken(5).success(() => {
        console.log('successfully got a new token', keycloak.idToken)
        this.props.loginKeycloakUserSuccess(keycloak.idToken, keycloak.idTokenParsed.exp)
      }).error((err) => {
        console.log('refresh token error', err)
      })
    }
  }

  render () {
    const {
      token,
      expiry,
      errorRequest,
      userRequest,
      loggedInUser,
      unreadNotificationsCount
    } = this.props

    const now = Math.round(Date.now() / 1000)
    if (!token || expiry < now) {
      return <Login />
    }

    if (token && (!loggedInUser?.username || userRequest.isFetching)) {
      return <Loading />
    }

    let content
    if (this.state.hasErrors) {
      content = <StatusInterceptor statusCode={500} />
    } else if (errorRequest.hasErrors &&
      errorRequest.error &&
      errorRequest.error.status) {
      content = <StatusInterceptor statusCode={errorRequest.error.status} />
    } else if (userRequest.serverError) {
      content = <StatusInterceptor statusCode={401} />
    } else {
      content = <Router/>
    }

    return (
      <IntlProvider locale="en-CA">
        <div className="App">
          <ReduxToastr
            closeOnToastrClick
            newesetOnTop={false}
            position="top-center"
            preventDuplicates
            transitionIn="fadeIn"
            transitionOut="fadeOut"
          />
          <Navbar
            loggedInUser={loggedInUser}
            unreadNotificationsCount={unreadNotificationsCount}
          />
          <div id="main" className="template container-fluid">
            <SessionTimer />
            {content}
          </div>
          <Footer />
        </div>
      </IntlProvider>
    )
  }
}

const mapStateToProps = state => ({
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount,
  errorRequest: {
    error: state.rootReducer.errorRequest.errorMessage,
    hasErrors: state.rootReducer.errorRequest.hasErrors
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  userRequest: {
    error: state.rootReducer.userRequest.error,
    isFetching: state.rootReducer.userRequest.isFetching,
    serverError: state.rootReducer.userRequest.serverError
  },
  keycloak: state.userAuth.keycloak,
  token: state.userAuth.token,
  expiry: state.userAuth.expiry,
  authenticated: state.userAuth.authenticated,
  isFetching: state.userAuth.isFetching,
  user: state.userAuth.user,
  errors: state.userAuth.errors
})

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  loginKeycloakUserSuccess: bindActionCreators(loginKeycloakUserSuccess, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
