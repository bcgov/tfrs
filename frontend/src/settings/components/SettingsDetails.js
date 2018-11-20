/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';
import NotificationsCreditTransactionsTable from './NotificationsCreditTransactionsTable';
import CREDIT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsCreditTransfers';
import GOVERNMENT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsGovernmentTransfers';
import * as Lang from '../../constants/langEnUs';
import SettingsTabs from './SettingsTabs';

const SettingsDetails = props => (
  <div className="page_settings">
    <SettingsTabs active="notifications" />

    <h1>Notifications</h1>

    <div className="settings-notifications">
      <div className="alert alert-info info-alert">
        <p>
          NOTE: The section below controls whether or not notifications are sent to you
          for various options by the system.
        </p>
        <p>
          Simply use the checkboxes to select which notifications you would like to receive.
        </p>
      </div>
      {(props.subscriptions.isFetching || !props.subscriptions.success) &&
        <Loading />
      }

      {!props.subscriptions.isFetching && props.subscriptions.success && [
        <h3 key="header-credit-transactions">
          Credit Transfer Proposals
        </h3>,
        <NotificationsCreditTransactionsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={CREDIT_TRANSFER_NOTIFICATIONS.filter(notification =>
            (props.loggedInUser.isGovernmentUser
              ? notification.recipients.includes('government')
              : notification.recipients.includes('fuel_supplier')
            ))}
          key="table-credit-transactions"
          toggleCheck={props.toggleCheck}
          type="credit-transfer"
        />,
        <h3 key="header-pvr">
          Part 3 Awards, Credit Validations, and Credit Reductions
        </h3>,
        <NotificationsCreditTransactionsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={GOVERNMENT_TRANSFER_NOTIFICATIONS.filter(notification =>
            (props.loggedInUser.isGovernmentUser
              ? notification.recipients.includes('government')
              : notification.recipients.includes('fuel_supplier')
            ))}
          key="table-pvr"
          toggleCheck={props.toggleCheck}
          type="government-transfer"
        />,
        <div className="btn-container" key="container-buttons">
          <button
            className="btn btn-primary"
            onClick={props.handleSubmit}
            type="button"
          >
            {Lang.BTN_SAVE}
          </button>
        </div>
      ]}
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
  subscriptions: PropTypes.shape({
    isFetching: PropTypes.bool,
    success: PropTypes.bool
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
};

export default SettingsDetails;
