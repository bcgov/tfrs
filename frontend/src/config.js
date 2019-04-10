/*
 Used to track feature configuration
*/
const getConfig = (value, def) => {
  if (global.tfrs_config) {
    return global.tfrs_config[value] || def;
  }

  return def;
};

const CONFIG = {
  KEYCLOAK: {
    ENABLED: true,
    AUTHORITY: getConfig('keycloak.authority', 'unconfigured'),
    CLIENT_ID: getConfig('keycloak.client_id', 'unconfigured'),
    CALLBACK_URL: getConfig('keycloak.callback_url', 'unconfigured'),
    POST_LOGOUT_URL: getConfig('keycloak.post_logout_url', 'unconfigured'),
    CUSTOM_LOGIN: getConfig('keycloak.custom_login', false)
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
    STARTING_YEAR: getConfig('compliance_reporting.starting_year', 2017)
  },
  CREDIT_CALCULATION_API: {
    ENABLED: getConfig('credit_calculation_api.enabled', false)

  }
};

export default CONFIG;
