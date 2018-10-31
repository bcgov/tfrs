/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRoles } from '../../actions/roleActions';
import AdminTabs from '../components/AdminTabs';
import RolesPage from './components/RolesPage';

class RolesContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getRoles();
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    fieldState[name] = { id: id || 0 };
    this.setState({
      fields: fieldState
    });
  }

  render () {
    return ([
      <AdminTabs key="nav" active="roles" />,
      <RolesPage key="roles" data={this.props.roles} />
    ]);
  }
}

RolesContainer.defaultProps = {
};

RolesContainer.propTypes = {
  getRoles: PropTypes.func.isRequired,
  roles: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  roles: state.rootReducer.roles
});

const mapDispatchToProps = dispatch => ({
  getRoles: bindActionCreators(getRoles, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RolesContainer);
