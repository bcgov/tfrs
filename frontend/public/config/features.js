// local dev defaults

window.tfrs_config = {
  api_base: 'http://localhost:8000/api',
  'keycloak.realm': 'standard',
  'keycloak.client_id': 'tfrs-on-gold-4308',
  'keycloak.auth_url': 'https://dev.loginproxy.gov.bc.ca/auth',
  'keycloak.callback_url': 'http://localhost:3000/',
  'keycloak.post_logout_url': 'http://localhost:3000/',
  'keycloak.siteminder_logout_url': 'https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=',
  'debug.enabled': false,
  'secure_document_upload.enabled': true,
  'secure_document_upload.max_file_size': 50000000,
  'fuel_codes.enabled': true,
  'keycloak.custom_login': true,
  'credit_transfer.enabled': true,
  'compliance_reporting.enabled': true,
  'credit_calculation_api.enabled': true,
  'exclusion_reports.enabled': true
}
