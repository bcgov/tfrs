/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { getOrganization, getOrganizationMembers } from '../actions/organizationActions';
import OrganizationPage from './components/OrganizationPage';

class OrganizationViewContainer extends Component {
  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getOrganization(id);
    this.props.getOrganizationMembers(id);
  }

  render () {
    return (
      <OrganizationPage
        loggedInUser={this.props.loggedInUser}
        members={this.props.organizationMembers}
        organization={this.props.organization}
      />
    );
  }
}

OrganizationViewContainer.propTypes = {
  getOrganization: PropTypes.func.isRequired,
  getOrganizationMembers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  organization: PropTypes.shape({
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
  organizationMembers: PropTypes.shape({
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
  organization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  organizationMembers: {
    isFetching: state.rootReducer.organizationMembers.isFetching,
    users: state.rootReducer.organizationMembers.users
  }
});

const mapDispatchToProps = dispatch => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  getOrganizationMembers: bindActionCreators(getOrganizationMembers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationViewContainer);
