// defaults

window.tfrs_config = {
  'keycloak.authority': 'http://localhost:8888/auth/realms/tfrs',
  'keycloak.client_id': 'tfrs-app',
  'keycloak.callback_url': 'http://localhost:5001/authCallback',
  'keycloak.post_logout_url': 'http://localhost:5001/',
  'debug.enabled': true,
  'secure_document_upload.enabled': true,
  'secure_document_upload.max_file_size': 50000000,
  'fuel_codes.enabled': true
};
