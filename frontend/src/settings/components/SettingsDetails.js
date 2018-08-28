/*
 * Presentational component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import NotificationsCreditTransactionsTable from './NotificationsCreditTransactionsTable';
import CREDIT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsCreditTransfers';
import GOVERNMENT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsGovernmentTransfers';
import * as Routes from '../../constants/routes';
import * as Lang from '../../constants/langEnUs';

const SettingsDetails = props => (
  <div className="page_settings">
    <ul className="nav nav-tabs" key="nav" role="tablist">
      <li role="presentation" className="active">
        <Link id="navbar-administration" to={Routes.SETTINGS}>
          Notifications
        </Link>
      </li>
    </ul>

    <div className="settings-notifications">
      <h3>Credit Transfers</h3>

      <NotificationsCreditTransactionsTable
        addToFields={props.addToFields}
        fields={props.fields.settings.notifications}
        items={CREDIT_TRANSFER_NOTIFICATIONS.filter(notification =>
          (props.loggedInUser.isGovernmentUser
            ? notification.recipients.includes('government')
            : notification.recipients.includes('fuel_supplier')
          ))}
        toggleCheck={props.toggleCheck}
        type="credit-transfer"
      />

      <h3>Credit Transactions (Part 3 Awards, Validations, Reductions)</h3>

      <NotificationsCreditTransactionsTable
        addToFields={props.addToFields}
        fields={props.fields.settings.notifications}
        items={GOVERNMENT_TRANSFER_NOTIFICATIONS.filter(notification =>
          (props.loggedInUser.isGovernmentUser
            ? notification.recipients.includes('government')
            : notification.recipients.includes('fuel_supplier')
          ))}
        toggleCheck={props.toggleCheck}
        type="government-transfer"
      />

      <div className="btn-container">
        <button
          className="btn btn-primary"
          onClick={props.handleSubmit}
          type="button"
        >
          {Lang.BTN_SAVE}
        </button>
      </div>
    </div>
  </div>
);

SettingsDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    settings: PropTypes.shape({
      notifications: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default SettingsDetails;
