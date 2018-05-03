import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import StatusInterceptor from './components/StatusInterceptor';

const App = (props) => {
  let content;
  if (!props.userRequest.isFetching && props.isAuthenticated) {
    content = props.children;
  } else if (!props.userRequest.isFetching) {
    content = (<StatusInterceptor statusCode={props.userRequest.error.status} />);
  }

  return (
    <IntlProvider locale="en-CA">
      <div className="App">
        <Navbar loggedInUser={props.loggedInUser} />
        <div id="main" className="template container">
          {content}
        </div>
        <Footer />
      </div>
    </IntlProvider>
  );
};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
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
  }).isRequired
};

export default withRouter(connect(state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  isAuthenticated: state.rootReducer.userRequest.isAuthenticated,
  userRequest: {
    error: state.rootReducer.userRequest.error,
    isFetching: state.rootReducer.userRequest.isFetching
  }
}))(App));
