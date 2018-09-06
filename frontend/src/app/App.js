import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import ReduxToastr from 'react-redux-toastr';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import StatusInterceptor from './components/StatusInterceptor';

const App = (props) => {
  let content;
  if (props.errorRequest.hasErrors && props.errorRequest.error.status) {
    content = <StatusInterceptor statusCode={props.errorRequest.error.status} />;
  } else if (!props.userRequest.isFetching && props.isAuthenticated) {
    content = props.children;
  } else if (!props.userRequest.isFetching) {
    content = <StatusInterceptor statusCode={props.userRequest.error.status} />;
  }

  return (
    <IntlProvider locale="en-CA">
      <div className="App">
        <ReduxToastr
          closeOnToastrClick
          newesetOnTop={false}
          position="top-center"
          preventDuplicates
          progressBar
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
};

App.defaultProps = {
  errorRequest: {
    error: {
    },
    hasErrors: false
  },
  unreadNotificationsCount: null
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
  unreadNotificationsCount: PropTypes.number
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
  unreadNotificationsCount: state.rootReducer.notificationsReducer.isFetching
    ? null
    : state.rootReducer.notificationsReducer.notifications.filter(n => !n.isRead).length
}))(App));
