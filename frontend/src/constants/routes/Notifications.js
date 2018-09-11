const API = '/api/notifications';
const BASE_PATH = '/notifications';

const NOTIFICATIONS = {
  API,
  DETAILS: `${BASE_PATH}/:id`,
  LIST: `${BASE_PATH}`,
  SUBSCRIPTIONS_API: `${BASE_PATH}/subscriptions`,
  UPDATE: `${API}/statuses`
};

export default NOTIFICATIONS;
