import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import history from '../app/History';
import userManager from '../store/oidc-usermanager';
import {bindActionCreators} from "redux";

class AuthCallback extends React.Component {

  constructor() {
    super();
    this.success = this.success.bind(this);
  }

  success(user) {
    console.log('success registered, pushing target');
    const target = this.props.targetPath;
    history.push(target);

  }

  error(e)  {}

  render() {
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

const mapStateToProps = state => {
  return {
    targetPath: state.targetPath.target
  }
};

const mapDispatchToProps = dispatch => {
  return {
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthCallback)
