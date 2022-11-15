/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

import { roles } from '../../actions/roleActions'
import RoleDetails from '../../roles/components/RoleDetails'

const RoleViewContainer = props => {
  const { id } = useParams()

  useEffect(() => {
    props.getRole(id)
  }, [id])

  return (
    <RoleDetails role={props.role} />
  )
}

RoleViewContainer.defaultProps = {
  role: {
    details: {},
    error: {},
    isFetching: true
  }
}

RoleViewContainer.propTypes = {
  getRole: PropTypes.func.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  role: PropTypes.shape({
    details: PropTypes.shape({}),
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool
  })
}

const mapStateToProps = state => ({
  role: {
    details: state.rootReducer.roles.item ? state.rootReducer.roles.item : null,
    error: state.rootReducer.roles.errorMessage,
    isGetting: state.rootReducer.roles.isGetting
  }
})

const mapDispatchToProps = {
  getRole: roles.get
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleViewContainer)
