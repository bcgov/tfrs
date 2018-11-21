/* eslint-disable no-undef */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SessionTimer extends Component {
  componentWillReceiveProps (newProps) {
    const oldProps = this.props;

    if (!oldProps.warning && newProps.warning) {
      $('#session-expiry-modal').modal('show');
    }
  }

  render () {
    return (
      <div
        className="modal"
        id="session-expiry-modal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                className="modal-title"
              >
                Session Expiry
              </h4>
            </div>
            <div className="modal-body">
              <p>Your session will end in a few minutes. If you would like to continue working,
                please click Continue to extend your session.
              </p>
            </div>
            <div className="modal-footer">
              <button
                id="modal-yes"
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.props.handleContinue}
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SessionTimer.defaultProps = {
};

SessionTimer.propTypes = {
  warning: PropTypes.bool.isRequired,
  expired: PropTypes.bool.isRequired,
  handleContinue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  warning: state.rootReducer.sessionTimeout.warning,
  expired: state.rootReducer.sessionTimeout.expired
});

const mapDispatchToProps = dispatch => ({
  handleContinue: bindActionCreators(() => ({ type: 'SESSION_TIMEOUT_CONTINUE' }), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionTimer);
