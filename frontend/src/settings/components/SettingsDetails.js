/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import NotificationsTable from './NotificationsTable'
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport'
import PERMISSIONS_SECURE_DOCUMENT_UPLOAD from '../../constants/permissions/SecureDocumentUpload'
import COMPLIANCE_REPORT_NOTIFICATIONS from '../../constants/settings/notificationsComplianceReports'
import EXCLUSION_REPORT_NOTIFICATIONS from '../../constants/settings/notificationsExclusionReports'
import CREDIT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsCreditTransfers'
import GOVERNMENT_TRANSFER_NOTIFICATIONS from '../../constants/settings/notificationsGovernmentTransfers'
import * as Lang from '../../constants/langEnUs'
import SettingsTabs from './SettingsTabs'
import DOCUMENT_NOTIFICATIONS from '../../constants/settings/notificationsDocuments'
import CONFIG from '../../config'

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
          Simply use the checkboxes to select which notifications you would like to receive and then click the Save button to save your preferences.
        </p>
      </div>
      {(props.subscriptions.isFetching || !props.subscriptions.success) &&
        <Loading />
      }

      {!props.subscriptions.isFetching && props.subscriptions.success && [
        <h3 key="header-credit-transactions">
          Credit Transfer Proposals
        </h3>,
        <NotificationsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={CREDIT_TRANSFER_NOTIFICATIONS.filter((notification) => {
            if (props.loggedInUser.isGovernmentUser) {
              return notification.recipients.includes('government')
            }

            if (notification.recipients.includes('fuel_supplier')) {
              if (notification.feature === 'base') {
                return true
              }

              if (CONFIG.CREDIT_TRANSFER.ENABLED && notification.feature === 'credit_transfer') {
                return true
              }
            }

            return false
          })}
          key="table-credit-transactions"
          toggleCheck={props.toggleCheck}
          type="credit-transfer"
        />,
        <h3 key="header-pvr">
          Part 3 Awards
        </h3>,
        <NotificationsTable
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
        />
      ]}
      {!props.subscriptions.isFetching && props.subscriptions.success &&
      CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED &&
      typeof props.loggedInUser.hasPermission === 'function' &&
      props.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW) && [
        <h3 key="header-doc">
          File Submission
        </h3>,
        <NotificationsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={DOCUMENT_NOTIFICATIONS.filter(notification =>
            (props.loggedInUser.isGovernmentUser
              ? notification.recipients.includes('government')
              : notification.recipients.includes('fuel_supplier')
            ))}
          key="table-doc"
          toggleCheck={props.toggleCheck}
          type="documents"
        />
      ]}
      {!props.subscriptions.isFetching && props.subscriptions.success &&
      CONFIG.COMPLIANCE_REPORTING.ENABLED &&
      typeof props.loggedInUser.hasPermission === 'function' &&
      props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW) && [
        <h3 key="header-compliance-reports">
          Compliance Reports
        </h3>,
        <NotificationsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={COMPLIANCE_REPORT_NOTIFICATIONS.filter(notification =>
            (props.loggedInUser.isGovernmentUser
              ? notification.recipients.includes('government')
              : notification.recipients.includes('fuel_supplier')
            ))}
          key="table-compliance-reports"
          toggleCheck={props.toggleCheck}
          type="compliance-report"
        />,
        <h3 key="header-exclusion-reports">
          Exclusion Reports
        </h3>,
        <NotificationsTable
          addToFields={props.addToFields}
          fields={props.fields.settings.notifications}
          items={EXCLUSION_REPORT_NOTIFICATIONS.filter(notification =>
            (props.loggedInUser.isGovernmentUser
              ? notification.recipients.includes('government')
              : notification.recipients.includes('fuel_supplier')
            ))}
          key="table-exclusion-reports"
          toggleCheck={props.toggleCheck}
          type="exclusion-report"
        />
      ]}
      {!props.subscriptions.isFetching && props.subscriptions.success && [
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
)

SettingsDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    settings: PropTypes.shape({
      notifications: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func.isRequired,
    isGovernmentUser: PropTypes.bool
  }).isRequired,
  subscriptions: PropTypes.shape({
    isFetching: PropTypes.bool,
    success: PropTypes.bool
  }).isRequired,
  toggleCheck: PropTypes.func.isRequired
}

export default SettingsDetails
