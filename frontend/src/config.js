/*
 Used to track feature configuration, defaults here and also injected via
  Webpack (from environment variables or similar)
*/

let CONFIG = {
  KEYCLOAK: {
    ENABLED: true,
    AUTHORITY: 'http://localhost:8888/auth/realms/tfrs',
    CLIENT_ID: 'tfrs-app',
    CALLBACK_URL: 'http://localhost:5001/authCallback'
  }
};

export default CONFIG;

