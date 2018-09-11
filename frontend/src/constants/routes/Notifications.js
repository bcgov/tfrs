const API = '/notifications';
const BASE_PATH = '/notifications';

const NOTIFICATIONS = {
  API,
  DETAILS: `${BASE_PATH}/:id`,
  LIST: `${BASE_PATH}`,
  SUBSCRIPTIONS: `${API}/subscriptions`,
  UPDATE: `${API}/statuses`
};

export default NOTIFICATIONS;
