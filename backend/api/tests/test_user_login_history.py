from api.models.UserLoginHistory import UserLoginHistory
from api.tests.base_test_case import BaseTestCase

class UserLoginHistoryTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.user_login_history = UserLoginHistory.objects.create(
            keycloak_email='test@example.com',
            external_username='test_username',
            keycloak_user_id='test_user_id@idir',
            is_login_successful=True
        )

    def test_user_login_history_created(self):
        user_login_history = UserLoginHistory.objects.get(id=self.user_login_history.id)
        self.assertEqual(user_login_history.keycloak_email, 'test@example.com')
        self.assertEqual(user_login_history.external_username, 'test_username')
        self.assertEqual(user_login_history.keycloak_user_id, 'test_user_id@idir')
        self.assertTrue(user_login_history.is_login_successful)
