/*
 Used to track feature configuration
*/
const getConfig = (value, def) => {
  // console.log("getConfig", value, def)
  if (global.tfrs_config) {
    return global.tfrs_config[value] || def
  }
  console.log('getConfig AFTER', value, def)

  return def
}

const CONFIG = {
  API_BASE: getConfig('api_base', `${window.location.protocol}//${window.location.host}:8000/api`),
  KEYCLOAK: {
    ENABLED: true,
    AUTHORITY: getConfig('keycloak.authority', 'unconfigured'),
    CLIENT_ID: getConfig('keycloak.client_id', 'unconfigured'),
    CALLBACK_URL: getConfig('keycloak.callback_url', 'unconfigured'),
    POST_LOGOUT_URL: getConfig('keycloak.post_logout_url', 'unconfigured'),
    CUSTOM_LOGIN: getConfig('keycloak.custom_login', true),

    // LOGOUT_URL: getConfig('keycloak.logout_url', false),
    REALM: getConfig('keycloak.realm', false),
    URL: getConfig('keycloak.url', false)
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
  }
}

export default CONFIG
