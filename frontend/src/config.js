/*
 Used to track feature configuration
*/

let get_config = (value, def) =>{
  if (global.tfrs_config) {
    return global.tfrs_config[value] || def;
  }
  return def;
};


let CONFIG = {
  KEYCLOAK: {
    ENABLED: get_config("keycloak.enabled", false),
    AUTHORITY: get_config("keycloak.authority","unconfigured"),
    CLIENT_ID: get_config("keycloak.client_id", "unconfigured"),
    CALLBACK_URL: get_config("keycloak.callback_url", "unconfigured"),
    POST_LOGOUT_URL: get_config("keycloak.post_logout_url", "unconfigured")
  }
};

export default CONFIG;

