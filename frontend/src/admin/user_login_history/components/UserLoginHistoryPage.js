import React from 'react'
import PropTypes from 'prop-types'
import Loading from '../../../app/components/Loading'
import UserLoginHistoryTable from './UserLoginHistoryTable'

const UserLoginHistoryPage = (props) => {
  const { isFetching, items } = props.userLoginHistory
  const isEmpty = items.length === 0

  return (
    <div className="page-user-login-history">
      <h1>User Login History</h1>
      {isFetching && <Loading />}
      {!isFetching && <UserLoginHistoryTable items={items} isEmpty={isEmpty} />}
    </div>
  )
}

UserLoginHistoryPage.propTypes = {
  userLoginHistory: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired
}

export default UserLoginHistoryPage
