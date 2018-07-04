/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getMyOrganization, getMyOrganizationMembers } from '../actions/organizationActions';
import OrganizationDetails from './components/OrganizationDetails';

class OrganizationViewContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getMyOrganization();
    this.props.getMyOrganizationMembers();
  }

  render () {
    return (
      <OrganizationDetails
        members={this.props.myOrganizationMembers}
        organization={this.props.myOrganization}
      />
    );
  }
}

OrganizationViewContainer.propTypes = {
  getMyOrganization: PropTypes.func.isRequired,
  getMyOrganizationMembers: PropTypes.func.isRequired,
  myOrganization: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    isFetching: PropTypes.bool
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
  myOrganization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  myOrganizationMembers: {
    isFetching: state.rootReducer.organizationMembers.isFetching,
    users: state.rootReducer.organizationMembers.users
  }
});

const mapDispatchToProps = dispatch => ({
  getMyOrganization: () => {
    dispatch(getMyOrganization());
  },
  getMyOrganizationMembers: () => {
    dispatch(getMyOrganizationMembers());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationViewContainer);
