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
        items={CREDIT_TRANSFER_NOTIFICATIONS}
        toggleCheck={props.toggleCheck}
        type="credit-transfer"
      />

      <h3>Credit Transactions (Part 3 Awards, Validations, Reductions)</h3>

      <NotificationsCreditTransactionsTable
        addToFields={props.addToFields}
        fields={props.fields.settings.notifications}
        items={GOVERNMENT_TRANSFER_NOTIFICATIONS}
        toggleCheck={props.toggleCheck}
        type="government-transfer"
      />
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
  toggleCheck: PropTypes.func.isRequired
};

export default SettingsDetails;
