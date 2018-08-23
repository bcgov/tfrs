/*
 * Presentational component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationsCreditTransactionsTable from './NotificationsCreditTransactionsTable';
import CREDIT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsCreditTransfers';
import GOVERNMENT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsGovernmentTransfers';
import * as Routes from '../../constants/routes';

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

      <NotificationsCreditTransactionsTable items={CREDIT_TRANSFER_NOTIFICATIONS} />

      <h3>Credit Transactions (Part 3 Awards, Validations, Reductions)</h3>

      <NotificationsCreditTransactionsTable items={GOVERNMENT_TRANSFER_NOTIFICATIONS} />
    </div>
  </div>
);

SettingsDetails.propTypes = {
};

export default SettingsDetails;
