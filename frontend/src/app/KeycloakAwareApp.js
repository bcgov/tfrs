import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router';
import ReduxToastr from 'react-redux-toastr';

import StatusInterceptor from './components/StatusInterceptor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SessionTimer from './components/SessionTimer';
import Login from './Login';
import CONFIG from '../config';

class KeycloakAwareApp extends React.Component {
  render () {
    let content;

    if (this.props.errorRequest.hasErrors &&
      this.props.errorRequest.error &&
      this.props.errorRequest.error.status) {
      content = <StatusInterceptor statusCode={this.props.errorRequest.error.status} />;
    } else if (this.props.userRequest.serverError) {
      content = <StatusInterceptor statusCode={401} />;
    } else {
      content = this.props.children;
    }

    if (this.props.keycloak.user && !this.props.keycloak.user.expired) {
      // we're logged into Keycloak.

      if (!this.props.isAuthenticated &&
        !this.props.userRequest.isFetching &&
        !this.props.userRequest.serverError) {
        // but we're not yet logged into the backend
        return (<p>Authenticating</p>);
      }

      if (this.props.userRequest.isFetching) {
        return (<p>Authenticating</p>);
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
              loggedInUser={this.props.loggedInUser}
              unreadNotificationsCount={this.props.unreadNotificationsCount}
            />
            <div id="main" className="template container">
              <SessionTimer />
              {content}
            </div>
            <Footer />
          </div>
        </IntlProvider>
      );
    } else if (this.props.keycloak.isFetching && this.props.location.pathname === '/authCallback') {
      return (this.props.children);
    }

    if ((!this.props.keycloak.user || this.props.keycloak.user.expired) &&
    !this.props.keycloak.isFetching) {
      if (!CONFIG.KEYCLOAK.CUSTOM_LOGIN ||
        (window.location.hash.indexOf('session_state') >= 0 &&
        window.location.hash.indexOf('access_token') >= 0)) {
        return (
          <div className="App">
            <p>Redirecting...</p>
          </div>
        );
      }

      return (<Login />);
    }

    return null;
  }
}

KeycloakAwareApp.defaultProps = {
  errorRequest: {
    error: {},
    hasErrors: false
  },
  location: {
    pathname: ''
  },
  unreadNotificationsCount: null,
  keycloak: {}
};

KeycloakAwareApp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  errorRequest: PropTypes.shape({
    error: PropTypes.shape({
      status: PropTypes.number,
      statusText: PropTypes.string
    }),
    hasErrors: PropTypes.bool
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userRequest: PropTypes.shape({
    error: PropTypes.shape({
      status: PropTypes.number
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    serverError: PropTypes.bool.isRequired
  }).isRequired,
  unreadNotificationsCount: PropTypes.number,
  keycloak: PropTypes.shape({
    user: PropTypes.object,
    isFetching: PropTypes.bool
  })
};

export default withRouter(connect(state => ({
  errorRequest: {
    error: state.rootReducer.errorRequest.errorMessage,
    hasErrors: state.rootReducer.errorRequest.hasErrors
  },
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  isAuthenticated: state.rootReducer.userRequest.isAuthenticated,
  userRequest: {
    error: state.rootReducer.userRequest.error,
    isFetching: state.rootReducer.userRequest.isFetching,
    serverError: state.rootReducer.userRequest.serverError
  },
  keycloak: {
    user: state.oidc.user,
    isFetching: state.oidc.isLoadingUser
  },
  unreadNotificationsCount: state.rootReducer.notifications.count.unreadCount
}))(KeycloakAwareApp));
