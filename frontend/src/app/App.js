import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import StatusInterceptor from './components/StatusInterceptor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SessionTimer from './components/SessionTimer';

import Loading from './components/Loading';
import CONFIG from '../config';
import Login from './Login';
import Router from './router';

// import 'toastr/build/toastr.min.css';
// import 'react-table/react-table.css';
import { logout } from '../actions/keycloakActions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrors: false
    };
  }

  static getDerivedStateFromError (errors) {
    return { hasErrors: true };
  }

  componentDidCatch (_error, info) {
    this.setState({
      hasErrors: true
    });
  }

  render() {
    const { 
      authenticated, 
      keycloak, 
      errorRequest,
      userRequest,
      loggedInUser,
      unreadNotificationsCount
    } = this.props;

    if (!keycloak) {
      return <Loading />;
    }

    if (keycloak && !authenticated) {
      return <Login keycloak={keycloak} />;
    }

    let content;
    if (this.state.hasErrors) {
      content = <StatusInterceptor statusCode={500} />;
    } else if (errorRequest.hasErrors &&
      errorRequest.error &&
      errorRequest.error.status) {
      content = <StatusInterceptor statusCode={errorRequest.error.status} />;
    } else if (userRequest.serverError) {
      content = <StatusInterceptor statusCode={401} />;
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
    );

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
  keycloak: state.rootReducer.keycloak.keycloak,
  authenticated: state.rootReducer.keycloak.authenticated,
  isFetching: state.rootReducer.keycloak.isFetching,
  user: state.rootReducer.keycloak.user,
  errors: state.rootReducer.keycloak.errors,
});

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);