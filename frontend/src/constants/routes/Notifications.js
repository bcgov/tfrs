const API = '/notifications';
const BASE_PATH = '/notifications';

const NOTIFICATIONS = {
  API,
  LIST: BASE_PATH,
  DETAILS: `${BASE_PATH}/:id`,
  SUBSCRIPTIONS_API: `${API}/subscriptions`
};

export default NOTIFICATIONS;
