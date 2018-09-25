import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import history from '../app/History';
import userManager from '../store/oidc-usermanager';

class AuthCallback extends React.Component {
  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.props.success}
        errorCallback={this.props.error}
      >
        <div>Stand by...</div>
      </CallbackComponent>
    );
  }
}

const mapStateToProps = state => {
  return {
    //todo: state.todos[0]
  }
}


const mapDispatchToProps = dispatch => {
  return {
    success: (user) => {
      history.push('/');
    }
    ,
    error: (e) => {
      console.error(e);
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthCallback)
