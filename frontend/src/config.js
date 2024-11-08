/*
 Used to track feature configuration
*/
const getConfig = (value, def) => {
  if (global.tfrs_config) {
    return global.tfrs_config[value] || def
  }
  return def
}

const CONFIG = {
  API_BASE: getConfig('api_base', `${window.location.protocol}//${window.location.host}:8000/api`),
  KEYCLOAK: {
    REALM: getConfig('keycloak.realm', false),
    CLIENT_ID: getConfig('keycloak.client_id', 'unconfigured'),
    AUTH_URL: getConfig('keycloak.auth_url', 'unconfigured'),
    CALLBACK_URL: getConfig('keycloak.callback_url', 'unconfigured'),
    POST_LOGOUT_URL: getConfig('keycloak.post_logout_url', 'unconfigured'),
    SM_LOGOUT_URL: getConfig('keycloak.siteminder_logout_url', 'unconfigured')
  },
  DEBUG: {
    ENABLED: getConfig('debug.enabled', false)
  },
  SECURE_DOCUMENT_UPLOAD: {
    ENABLED: getConfig('secure_document_upload.enabled', false),
    MAX_FILE_SIZE: getConfig('secure_document_upload.max_file_size', 50000000)
  },
  FUEL_CODES: {
    ENABLED: getConfig('fuel_codes.enabled', false)
  },
  CREDIT_TRANSFER: {
    ENABLED: getConfig('credit_transfer.enabled', false)
  },
  COMPLIANCE_REPORTING: {
    ENABLED: getConfig('compliance_reporting.enabled', false),
    CREATE_EFFECTIVE_DATE: getConfig('compliance_reporting.create_effective_date', '2013-07-01')
  },
  CREDIT_CALCULATION_API: {
    ENABLED: getConfig('credit_calculation_api.enabled', false)
  },
  EXCLUSION_REPORTS: {
    ENABLED: getConfig('exclusion_reports.enabled', false),
    CREATE_EFFECTIVE_DATE: getConfig('exclusion_reports.create_effective_date', '2013-07-01')
  },

  // Tear down configuration manages UI visibility for BCeID and IDIR roles.
  TEAR_DOWN: {
    BCeID: {
      WIDGETS: {
        BALANCE: getConfig('tear_down.bceid.widgets.balance', false),
        FEEDBACK: getConfig('tear_down.bceid.widgets.feedback', false),
        WEBSITE: getConfig('tear_down.bceid.widgets.website', false),
        CREDIT_TRANSACTIONS: getConfig('tear_down.bceid.widgets.creditTransactions', false),
        FILE_SUBMISSIONS: getConfig('tear_down.bceid.widgets.fileSubmissions', false)
      },
      HEADER: {
        CREDIT_INFORMATION: getConfig('tear_down.bceid.header.creditInformation', false)
      },
      NAVIGATION: {
        TRANSACTIONS: getConfig('tear_down.bceid.navigation.transactions', false),
        FILE_SUBMISSIONS: getConfig('tear_down.bceid.navigation.fileSubmissions', false),
        HELP_LINK: getConfig('tear_down.bceid.navigation.helpLink', false)
      },
      ORGANIZATION: {
        CREDIT_INFORMATION: getConfig('tear_down.bceid.organization.creditInformation', false),
        ROLES: {
          FILE_SUBMISSION: getConfig('tear_down.bceid.organization.roles.fileSubmission', false),
          CREDIT_TRANSFERS: getConfig('tear_down.bceid.organization.roles.creditTransfers', false)
        }
      }
    },
    IDIR: {
      WIDGETS: {
        BALANCE: getConfig('tear_down.idir.widgets.balance', false),
        CREDIT_TRANSACTIONS: getConfig('tear_down.idir.widgets.creditTransactions', false),
        FILE_SUBMISSIONS: getConfig('tear_down.idir.widgets.fileSubmissions', false)
      },
      NAVIGATION: {
        TRANSACTIONS: getConfig('tear_down.idir.navigation.transactions', false),
        FILE_SUBMISSIONS: getConfig('tear_down.idir.navigation.fileSubmissions', false),
        HELP_LINK: getConfig('tear_down.idir.navigation.helpLink', false)
      },
      ORGANIZATIONS: {
        TABLE_COLUMNS: {
          COMPLIANCE_UNITS: getConfig('tear_down.idir.organizations.tableColumns.complianceUnits', false),
          IN_RESERVE: getConfig('tear_down.idir.organizations.tableColumns.inReserve', false)
        }
      },
      ORGANIZATION: {
        CREDIT_INFORMATION: getConfig('tear_down.idir.organization.creditInformation', false)
      }
    }
  }
}

export default CONFIG
