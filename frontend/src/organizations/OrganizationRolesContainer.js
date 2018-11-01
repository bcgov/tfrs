/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRoles } from '../actions/roleActions';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationRoles from './components/OrganizationRoles';

class OrganizationRolesContainer extends Component {
  componentWillMount () {
    this.loadData();
  }

  loadData () {
    this.props.getRoles();
  }

  render () {
    return ([
      <OrganizationDetails
        key="details"
        organization={this.props.loggedInUser.organization}
      />,
      <OrganizationRoles
        data={this.props.roles}
        key="roles"
        loggedInUser={this.props.loggedInUser}
      />
    ]);
  }
}

OrganizationRolesContainer.propTypes = {
  getRoles: PropTypes.func.isRequired,
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
  roles: PropTypes.shape().isRequired
};

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  myOrganization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  roles: state.rootReducer.roles
});

const mapDispatchToProps = dispatch => ({
  getRoles: bindActionCreators(getRoles, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationRolesContainer);
