import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Loading from '../../app/components/Loading'
import * as Lang from '../../constants/langEnUs'
import OrganizationDetails from './OrganizationDetails'
import OrganizationMembers from './OrganizationMembers'
import { useNavigate } from 'react-router'

const OrganizationPage = (props) => {
  const navigate = useNavigate()
  const { isFetching, details } = props.organization

  return (
    <div className="page_organization">
      {isFetching && <Loading />}
      {!isFetching && [
        <OrganizationDetails
          key="details"
          loggedInUser={props.loggedInUser}
          organization={details}
        />,
        <OrganizationMembers
          key="members"
          loggedInUser={props.loggedInUser}
          members={props.members}
          organizationId={details.id}
        />,
        <div
          className="btn-container"
          key="buttons"
        >
          <button
            className="btn btn-default"
            onClick={() => navigate(-1)}
            type="button"
          >
            <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
          </button>
        </div>
      ]}
    </div>
  )
}

OrganizationPage.propTypes = {
  loggedInUser: PropTypes.shape().isRequired,
  members: PropTypes.shape({
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
  }).isRequired,
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
  }).isRequired
}

export default OrganizationPage
