/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRole } from '../../actions/roleActions';
import RoleDetails from '../../roles/components/RoleDetails';

class RoleViewContainer extends Component {
  componentWillMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getRole(id);
  }

  render () {
    return (
      <RoleDetails
        role={this.props.role}
      />
    );
  }
}

RoleViewContainer.defaultProps = {
  role: {
    details: {},
    error: {},
    isFetching: true
  }
};

RoleViewContainer.propTypes = {
  getRole: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  role: PropTypes.shape({
    details: PropTypes.shape({}),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  })
};

const mapStateToProps = state => ({
  role: {
    details: state.rootReducer.roleRequest.role,
    error: state.rootReducer.roleRequest.error,
    isFetching: state.rootReducer.roleRequest.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getRole: bindActionCreators(getRole, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleViewContainer);
