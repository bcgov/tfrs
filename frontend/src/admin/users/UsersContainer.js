/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMyOrganizationMembers } from '../../actions/organizationActions';
import AdminTabs from '../components/AdminTabs';
import UsersPage from './components/UsersPage';

class UsersContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getMyOrganizationMembers();
  }

  render () {
    return ([
      <AdminTabs key="nav" active="users" />,
      <UsersPage
        key="page"
        members={this.props.myOrganizationMembers}
      />
    ]);
  }
}

UsersContainer.propTypes = {
  getMyOrganizationMembers: PropTypes.func.isRequired,
  myOrganizationMembers: PropTypes.shape({
    isFetching: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      isActive: PropTypes.bool,
      lastName: PropTypes.string,
      role: PropTypes.shape({
        id: PropTypes.number
      })
    }))
  }).isRequired
};

const mapStateToProps = state => ({
  myOrganizationMembers: {
    isFetching: state.rootReducer.organizationMembers.isFetching,
    users: state.rootReducer.organizationMembers.users
  }
});

const mapDispatchToProps = dispatch => ({
  getMyOrganizationMembers: () => {
    dispatch(getMyOrganizationMembers());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
