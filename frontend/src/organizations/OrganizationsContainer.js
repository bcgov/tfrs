/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getOrganizations } from '../actions/organizationActions';
import OrganizationsPage from './components/OrganizationsPage';

class OrganizationsContainer extends Component {
  componentDidMount () {
    this.loadData();
  }

  loadData () {
    this.props.getOrganizations();
  }

  render () {
    return (
      <OrganizationsPage
        title="Fuel Suppliers"
        organizations={this.props.organizations}
      />
    );
  }
}

OrganizationsContainer.propTypes = {
  getOrganizations: PropTypes.func.isRequired,
  organizations: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  organizations: {
    items: state.rootReducer.organizations.items,
    isFetching: state.rootReducer.organizations.isFetching
  }
});

const mapDispatchToProps = dispatch => ({
  getOrganizations: () => {
    dispatch(getOrganizations());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsContainer);
