/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMyOrganizationMembers } from '../actions/organizationActions';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationMembers from './components/OrganizationMembers';

class MyOrganizationContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getMyOrganizationMembers();
  }

  render () {
    return ([
      <OrganizationDetails
        key="details"
        organization={this.props.loggedInUser.organization}
      />,
      <OrganizationMembers
        key="members"
        loggedInUser={this.props.loggedInUser}
        members={this.props.myOrganizationMembers}
      />
    ]);
  }
}

MyOrganizationContainer.propTypes = {
  getMyOrganizationMembers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    })
  }).isRequired,
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
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(MyOrganizationContainer);
