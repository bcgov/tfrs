/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { getOrganization, getOrganizationMembers } from '../actions/organizationActions';
import Loading from '../app/components/Loading';
import OrganizationDetails from './components/OrganizationDetails';
import OrganizationMembers from './components/OrganizationMembers';

class OrganizationAddContainer extends Component {
  render () {
    return (
      <p>Add</p>
    )
  }
}

OrganizationAddContainer.propTypes = {

};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    //addOrganiztion: bindActionCreators(getOrganization, dispatch),
  //getOrganizationMembers: bindActionCreators(getOrganizationMembers, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationAddContainer);
