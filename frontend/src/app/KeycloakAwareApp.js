import StatusInterceptor from './components/StatusInterceptor';
import { IntlProvider } from 'react-intl';
import ReduxToastr from 'react-redux-toastr';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SigninPage from './SigninPage';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import React from 'react';

class KeycloakAwareApp extends React.Component {
  render () {
    let content;

    if (this.props.errorRequest.hasErrors &&
      this.props.errorRequest.error &&
      this.props.errorRequest.error.status) {
      content = <StatusInterceptor statusCode={this.props.errorRequest.error.status} />;
    }

    content = this.props.children;

    if (this.props.keycloak.user) {
      // we're logged into Keycloak.

      if (!this.props.isAuthenticated && !this.props.userRequest.isFetching) {
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
              {content}
            </div>
            <Footer />
          </div>
        </IntlProvider>
      );
    } else if (this.props.keycloak.isFetching && this.props.location.pathname === '/authCallback') {
      console.log('returning authcallback');
      return (this.props.children);
    }
    // we're not logged in and not in the process of logging in. trigger one.
    return (
      <div className="App">
        <SigninPage />
      </div>
    );
  }
}

KeycloakAwareApp.defaultProps = {
  errorRequest: {
    error: {
    },
    hasErrors: false
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
    isFetching: PropTypes.bool.isRequired
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
    isFetching: state.rootReducer.userRequest.isFetching
  },
  keycloak: {
    user: state.oidc.user,
    isFetching: state.oidc.isLoadingUser
  },
  unreadNotificationsCount: state.rootReducer.notifications.isFetching
    ? null
    : state.rootReducer.notifications.items.filter(n => !n.isRead).length
}))(KeycloakAwareApp));
