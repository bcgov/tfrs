import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import ReduxToastr from 'react-redux-toastr'

import StatusInterceptor from './components/StatusInterceptor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionTimer from './components/SessionTimer'

import Loading from './components/Loading'
import Login from './Login'
import Router from './router'

// import 'toastr/build/toastr.min.css';
// import 'react-table/react-table.css';
import Unverified from './components/Unverified'

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

  render () {
    const {
      keycloak,
      loggingIn,
      errorRequest,
      userRequest,
      loggedInUser,
      unreadNotificationsCount
    } = this.props

    if (
      !keycloak ||
      userRequest.isFetching ||
      loggingIn
    ) {
      return <Loading />
    }

    if (keycloak && !keycloak.authenticated) {
      return <Login />
    }

    if (userRequest.serverError) {
      return <Unverified />
    }

    if (!loggedInUser?.username) {
      return <Loading />
    }

    let content
    if (this.state.hasErrors) {
      content = <StatusInterceptor statusCode={500} />
    } else if (errorRequest.hasErrors &&
      errorRequest.error &&
      errorRequest.error.status) {
      content = <StatusInterceptor statusCode={errorRequest.error.status} />
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
  idToken: state.userAuth.idToken,
  expiry: state.userAuth.expiry,
  authenticated: state.userAuth.authenticated,
  loggingIn: state.userAuth.loggingIn,
  isFetching: state.userAuth.isFetching,
  user: state.userAuth.user,
  errors: state.userAuth.errors
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
