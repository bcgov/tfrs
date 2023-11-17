/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { roles } from '../actions/roleActions'
import OrganizationDetails from './components/OrganizationDetails'
import OrganizationRoles from './components/OrganizationRoles'

const OrganizationRolesContainer = props => {
  useEffect(() => {
    props.getRoles()
  }, [])

  return ([
    <OrganizationDetails
      key="details"
      organization={props.loggedInUser.organization}
      loggedInUser={{
        isGovernmentUser: props.loggedInUser.isGovernmentUser,
        hasPermission: props.loggedInUser.hasPermission
      }}
    />,
    <OrganizationRoles
      data={props.roles}
      key="roles"
      loggedInUser={props.loggedInUser}
    />
  ])
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
}

const mapStateToProps = state => ({
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  myOrganization: {
    details: state.rootReducer.organizationRequest.fuelSupplier,
    isFetching: state.rootReducer.organizationRequest.isFetching
  },
  roles: state.rootReducer.roles
})

const mapDispatchToProps = {
  getRoles: roles.find
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationRolesContainer)
