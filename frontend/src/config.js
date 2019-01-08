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
    POST_LOGOUT_URL: getConfig('keycloak.post_logout_url', 'unconfigured')
  },
  DEBUG: {
    ENABLED: getConfig('debug.enabled', false)
  },
  SECURE_DOCUMENT_UPLOAD: {
    ENABLED: getConfig('secure_document_upload.enabled', false),
    MAX_FILE_SIZE: getConfig('secure_document_upload.max_file_size', 50000000)
  }
};

export default CONFIG;
