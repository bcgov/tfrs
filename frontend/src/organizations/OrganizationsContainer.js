/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getOrganizations } from '../actions/organizationActions'
import OrganizationsPage from './components/OrganizationsPage'

const OrganizationsContainer = props => {
  useEffect(() => {
    props.getOrganizations()
  }, [])

  return (
    <OrganizationsPage
      title="Fuel Suppliers"
      organizations={props.organizations}
    />
  )
}

OrganizationsContainer.propTypes = {
  getOrganizations: PropTypes.func.isRequired,
  organizations: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
}

const mapStateToProps = state => ({
  organizations: {
    items: state.rootReducer.organizations.items,
    isFetching: state.rootReducer.organizations.isFetching
  }
})

const mapDispatchToProps = dispatch => ({
  getOrganizations: () => {
    dispatch(getOrganizations())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsContainer)
