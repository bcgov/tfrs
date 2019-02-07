const API = '/notifications';
const BASE_PATH = '/notifications';

const NOTIFICATIONS = {
  API,
  DETAILS: `${BASE_PATH}/:id`,
  LIST: `${BASE_PATH}`,
  SUBSCRIPTIONS: `${API}/subscriptions`,
  UPDATE: `${API}/statuses`,
  UPDATE_SUBSCRIPTIONS: `${API}/update_subscription`
};

export default NOTIFICATIONS;
