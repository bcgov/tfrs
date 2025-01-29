import React from 'react'
import PropTypes from 'prop-types'

import Administration from './Administration'
import Balance from './Balance'
import BalanceBCEID from './BalanceBCEID'
import CreditTransactions from './CreditTransactions'
import CreditTransactionsBCEID from './CreditTransactionsBCEID'
import ComplianceReports from './ComplianceReports'
import ComplianceReportsBCEID from './ComplianceReportsBCEID'
import DirectorReview from './DirectorReview'
import Feedback from './Feedback'
import LcfsWebsiteLink from './LcfsWebsiteLink'
import FileSubmissions from './FileSubmissions'
import FuelCodes from './FuelCodes'
import OrganizationDetails from './OrganizationDetails'
import FileSubmission from './FileSubmission'
import UserSettings from './UserSettings'
import CONFIG from '../../config'
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import PERMISSIONS_FUEL_CODES from '../../constants/permissions/FuelCodes'
import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations'
import PERMISSIONS_SECURE_DOCUMENT_UPLOAD from '../../constants/permissions/SecureDocumentUpload'

const BCEIDDashboardPage = obj => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      {!CONFIG.TEAR_DOWN.BCeID.WIDGETS.BALANCE && (
        <BalanceBCEID loggedInUser={obj.loggedInUser} />
      )}
      {!CONFIG.TEAR_DOWN.BCeID.WIDGETS.FEEDBACK && <Feedback />}
      {!CONFIG.TEAR_DOWN.BCeID.WIDGETS.WEBSITE && <LcfsWebsiteLink />}
    </div>

    <div className="col-md-5">
      {(!CONFIG.TEAR_DOWN.BCeID.WIDGETS.CREDIT_TRANSACTIONS && 
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.VIEW)) &&
      <CreditTransactionsBCEID
        creditTransfers={obj.creditTransfers}
        loggedInUser={obj.loggedInUser}
        setFilter={obj.setFilter}
      />
      }

      {(CONFIG.COMPLIANCE_REPORTING.ENABLED &&
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW)) &&
        <ComplianceReportsBCEID
          complianceReports={obj.complianceReports}
          createComplianceReport={obj.createComplianceReport}
          createExclusionReport={obj.createExclusionReport}
          loggedInUser={obj.loggedInUser}
          setFilter={obj.setFilter}
        />
      }

      {(!CONFIG.TEAR_DOWN.BCeID.WIDGETS.FILE_SUBMISSIONS &&
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW)) &&
        <FileSubmission />
      }

    </div>

    <div className="col-md-4">
      <OrganizationDetails
        loggedInUser={obj.loggedInUser}
      />

      <UserSettings
        loggedInUser={obj.loggedInUser}
        unreadNotificationsCount={obj.unreadNotificationsCount}
      />
    </div>
  </div>
)

const DirectorDashboardPage = obj => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      {(!CONFIG.TEAR_DOWN.IDIR.WIDGETS.BALANCE &&
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.VIEW)) &&
        <Balance
          loggedInUser={obj.loggedInUser}
          organization={obj.organization}
          organizations={obj.organizations}
          selectOrganization={obj.selectOrganization}
        />
      }

    </div>

    <div className="col-md-5">
      <DirectorReview
        complianceReports={obj.complianceReports}
        creditTransfers={obj.creditTransfers}
        loggedInUser={obj.loggedInUser}
        setFilter={obj.setFilter}
      />
    </div>

    <div className="col-md-4">
      <Administration />

      <UserSettings
        loggedInUser={obj.loggedInUser}
        unreadNotificationsCount={obj.unreadNotificationsCount}
      />
    </div>
  </div>
)

const IDIRDashboardPage = obj => (
  <div className="row dashboard-page">
    <div className="col-md-3">
      {(!CONFIG.TEAR_DOWN.IDIR.WIDGETS.BALANCE &&
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.VIEW)) &&
        <Balance
          loggedInUser={obj.loggedInUser}
          organization={obj.organization}
          organizations={obj.organizations}
          selectOrganization={obj.selectOrganization}
        />
      }

    </div>

    <div className="col-md-5">
      {(!CONFIG.TEAR_DOWN.IDIR.WIDGETS.CREDIT_TRANSACTIONS &&
        typeof obj.loggedInUser.hasPermission === 'function' &&
        obj.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.VIEW)) &&
        <CreditTransactions
          creditTransfers={obj.creditTransfers}
          setFilter={obj.setFilter}
        />
      }

      {(CONFIG.COMPLIANCE_REPORTING.ENABLED &&
        typeof obj.loggedInUser.hasPermission === 'function' &&
        obj.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.VIEW)) &&
        <ComplianceReports
          complianceReports={obj.complianceReports}
          setFilter={obj.setFilter}
        />
      }

      {(CONFIG.COMPLIANCE_REPORTING.ENABLED &&
        typeof obj.loggedInUser.hasPermission === 'function' &&
        obj.loggedInUser.hasPermission(PERMISSIONS_FUEL_CODES.VIEW)) &&
        <FuelCodes
          fuelCodes={obj.fuelCodes}
          setFilter={obj.setFilter}
        />
      }
    </div>

    <div className="col-md-4">
      {(!CONFIG.TEAR_DOWN.IDIR.WIDGETS.FILE_SUBMISSIONS &&
      typeof obj.loggedInUser.hasPermission === 'function' &&
      obj.loggedInUser.hasPermission(PERMISSIONS_SECURE_DOCUMENT_UPLOAD.VIEW)) &&
      CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED &&
      <FileSubmissions
        documentUploads={obj.documentUploads}
        setFilter={obj.setFilter}
      />
      }

      <Administration />

      <UserSettings
        loggedInUser={obj.loggedInUser}
        unreadNotificationsCount={obj.unreadNotificationsCount}
      />
    </div>
  </div>
)

const DashboardPage = (props) => {
  if (!props.loggedInUser.isGovernmentUser) {
    return BCEIDDashboardPage(props)
  }

  if (props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.APPROVE) ||
  props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.APPROVE)) {
    return DirectorDashboardPage(props)
  }

  return IDIRDashboardPage(props)
}

DashboardPage.defaultProps = {
  organization: {},
  organizations: [],
  unreadNotificationsCount: 0
}

DashboardPage.propTypes = {
  complianceReports: PropTypes.shape().isRequired,
  createComplianceReport: PropTypes.func.isRequired,
  createExclusionReport: PropTypes.func.isRequired,
  creditTransfers: PropTypes.shape().isRequired,
  documentUploads: PropTypes.shape().isRequired,
  fuelCodes: PropTypes.shape().isRequired,
  loggedInUser: PropTypes.shape().isRequired,
  organization: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.bool
  ]),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  selectOrganization: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  unreadNotificationsCount: PropTypes.number
}

export default DashboardPage
