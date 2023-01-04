/*
 * Container component
 * All data handling & manipulation should be handled here.
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { getOrganization, getOrganizationMembers } from '../actions/organizationActions'
import OrganizationPage from './components/OrganizationPage'
import { useParams } from 'react-router'

const OrganizationViewContainer = props => {
  const { id } = useParams()

  useEffect(() => {
    props.getOrganization(id)
    props.getOrganizationMembers(id)
  }, [id])

  return (
    <OrganizationPage
      loggedInUser={props.loggedInUser}
      members={props.organizationMembers}
      organization={props.organization}
    />
  )
}

OrganizationViewContainer.propTypes = {
  getOrganization: PropTypes.func.isRequired,
  getOrganizationMembers: PropTypes.func.isRequired,
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
}

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
})

const mapDispatchToProps = dispatch => ({
  getOrganization: bindActionCreators(getOrganization, dispatch),
  getOrganizationMembers: bindActionCreators(getOrganizationMembers, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationViewContainer)
