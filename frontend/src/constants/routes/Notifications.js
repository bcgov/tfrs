const API = '/notifications';
const BASE_PATH = '/notifications';

const NOTIFICATIONS = {
  API,
  DETAILS: `${BASE_PATH}/:id`,
  LIST: `${BASE_PATH}`,
  COUNT: `${BASE_PATH}/count`,
  SUBSCRIPTIONS: `${API}/subscriptions`,
  UPDATE: `${API}/statuses`,
  UPDATE_SUBSCRIPTIONS: `${API}/update_subscription`
};

export default NOTIFICATIONS;
