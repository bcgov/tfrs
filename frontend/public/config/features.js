// defaults

window.tfrs_config = {
  'api_base':'http://localhost:8000/api',
  'keycloak.authority': 'http://localhost:8888/auth/realms/tfrs',
  'keycloak.client_id': 'tfrs-on-gold-4308',
  'keycloak.callback_url': 'http://localhost:3000/authCallback',
  'keycloak.post_logout_url': 'http://localhost:3000/',
  'keycloak.realm': 'standard',
  'keycloak.url': 'http://localhost:8888/auth',
  'debug.enabled': true,
  'secure_document_upload.enabled': true,
  'secure_document_upload.max_file_size': 50000000,
  'fuel_codes.enabled': true,
  'keycloak.custom_login': true,
  'credit_transfer.enabled': true,
  'compliance_reporting.enabled': true,
  'credit_calculation_api.enabled': true,
  'exclusion_reports.enabled': true
};
