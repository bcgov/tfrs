import React from 'react'
import PropTypes from 'prop-types'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Loading from '../../app/components/Loading'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import USERS from '../../constants/routes/Users'
import OrganizationsTable from './OrganizationsTable'
import * as Routes from '../../constants/routes'
import { download } from '../../utils/functions'
import { useNavigate } from 'react-router'

const OrganizationsPage = (props) => {
  const navigate = useNavigate()
  const { isFetching, items } = props.organizations
  const isEmpty = items.length === 0
  return (
    <div className="page_organizations">
      <h1>{props.title}</h1>
      <div className="actions-container">
        <button
          id="create-organization"
          className="btn btn-primary"
          type="button"
          onClick={() => navigate(ORGANIZATIONS.ADD)}
        >
          <FontAwesomeIcon icon="plus-circle" /> Create Organization
        </button>
        <button
          id="download-xls"
          className="btn btn-info"
          type="button"
          onClick={(e) => {
            const element = e.target
            const original = element.innerHTML

            element.firstChild.textContent = ' Downloading...'

            return download(Routes.BASE_URL + ORGANIZATIONS.EXPORT).then(() => {
              element.innerHTML = original
            })
          }}
        >
          <FontAwesomeIcon icon="file-excel" /> <span>Download Organization Information</span>
        </button>
        <button
          id="download-xls"
          className="btn btn-info"
          type="button"
          onClick={(e) => {
            const element = e.target
            const original = element.innerHTML

            element.firstChild.textContent = ' Downloading...'

            return download(Routes.BASE_URL + USERS.EXPORT).then(() => {
              element.innerHTML = original
            })
          }}
        >
          <FontAwesomeIcon icon="file-excel" /> <span>Download User Information</span>
        </button>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <OrganizationsTable
        items={items}
        isFetching={isFetching}
        isEmpty={isEmpty}
      />
      }
    </div>
  )
}

OrganizationsPage.propTypes = {
  organizations: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired
}

export default OrganizationsPage
