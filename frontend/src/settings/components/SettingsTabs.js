import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

import * as Routes from '../../constants/routes'

const SettingsTabs = props => (
  <ul className="settings-tabs nav nav-tabs" key="nav" role="tablist">
    <li role="presentation" className={`${(props.active === 'notifications') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={Routes.SETTINGS}>
        Notifications
      </Link>
    </li>
    <li role="presentation" className={`${(props.active === 'profile') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={Routes.SETTINGS_PROFILE}>
        User profile
      </Link>
    </li>
  </ul>
)

SettingsTabs.propTypes = {
  active: PropTypes.string.isRequired
}

export default SettingsTabs
