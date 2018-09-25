import {createUserManager} from "redux-oidc";

import store from './store';
import {getLoggedInUser} from "../actions/userActions";
import {AxiosInstance as axios} from "axios";

const settings = {
  authority: 'http://localhost:8888/auth/realms/tfrs',
  client_id: 'tfrs-app',
  redirect_uri: 'http://localhost:5001/authCallback'
};

const userManager = createUserManager(settings);

export default userManager;

