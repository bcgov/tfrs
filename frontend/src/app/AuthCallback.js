import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import PropTypes from 'prop-types';
import history from '../app/History';
import userManager from '../store/oidc-usermanager';

class AuthCallback extends React.Component {
  constructor () {
    super();
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }

  success (user) {
    const target = this.props.targetPath;

    history.push(target);
  }

  error (e) { // state is most likely empty, redirect back to try the authentication again
    const target = this.props.targetPath;

    // using history seems to be causing the page to get stuck
    // so using window.location instead
    if (target) {
      window.location.replace(target);
    } else {
      window.location.replace('/');
    }
  }

  render () {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.success}
        errorCallback={this.error}
      >
        <div>Authentication complete. Redirecting.</div>
      </CallbackComponent>
    );
  }
}

AuthCallback.propTypes = {
  targetPath: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  targetPath: state.targetPath.target
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthCallback);
