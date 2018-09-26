import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import ReduxToastr from 'react-redux-toastr';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import userManager from '../store/oidc-usermanager';

import StatusInterceptor from './components/StatusInterceptor';
import {Button} from "react-bootstrap";

import CONFIG from '../config';
import {getLoggedInUser} from "../actions/userActions";
import AuthCallback from "./AuthCallback";

const App = (props) => {
  let content;


  if (props.errorRequest.hasErrors && props.errorRequest.error.status) {
    content = <StatusInterceptor statusCode={props.errorRequest.error.status} />;
  } else if (!props.userRequest.isFetching && props.isAuthenticated) {
    content = props.children;
  } else if (!props.userRequest.isFetching) {
    content = <StatusInterceptor statusCode={props.userRequest.error.status} />;
  }

    if (CONFIG.KEYCLOAK.ENABLED) {
      if (props.keycloak.user) {
        //we're logged into Keycloak.

        console.log('keycloak user is: ' + props.keycloak.user);
        console.log('isFetching: ' + props.keycloak.isFetching);

        if (!props.isAuthenticated && !props.userRequest.isFetching) {
          //but we're not yet logged into the backend
          props.dispatch(getLoggedInUser());
          return (<p>Authenticating</p>);
        }

        if (props.userRequest.isFetching) {
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
                loggedInUser={props.loggedInUser}
                unreadNotificationsCount={props.unreadNotificationsCount}
              />
              <div id="main" className="template container">
                {content}
              </div>
              <Footer />
            </div>
          </IntlProvider>
        );

      }
      else if (props.keycloak.isFetching && props.location.pathname === '/authCallback') {
        console.log('returning authcallback');
        return (props.children);
      } else {
        //we're not logged in and not in the process of logging in. trigger one.
        userManager.signinRedirect();
        return (<p>Redirecting...</p>);
      }
    } else {

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
              loggedInUser={props.loggedInUser}
              unreadNotificationsCount={props.unreadNotificationsCount}
            />
            <div id="main" className="template container">
              {content}
            </div>
            <Footer/>
          </div>
        </IntlProvider>
      );
    }
}

App.defaultProps = {
  errorRequest: {
    error: {
    },
    hasErrors: false
  },
  unreadNotificationsCount: null,
  keycloak: {}
};

App.propTypes = {
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
}))(App));
