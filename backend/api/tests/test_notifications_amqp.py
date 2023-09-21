import json
from unittest.mock import patch, Mock
from django.test import TestCase
from .base_test_case import BaseTestCase
from api.models.Organization import Organization
from api.models.Role import Role
from api.models.User import User
from api.models.NotificationChannel import NotificationChannel
from api.notifications.notification_types import NotificationType
from api.notifications.notifications import AMQPNotificationService, NotificationDeliveryFailure, InvalidNotificationArguments
from api.models.NotificationSubscription import NotificationSubscription
from api.tests.payloads.notification_payloads import notifications_payload_active, notifications_payload_inactive, notifications_payload_single_false

class TestAMQPNotificationService(BaseTestCase):

    @patch('api.notifications.notifications.send_amqp_notification')
    def setUp(self, mock_send_amqp):
        super().setUp()

        self.org1 = self.organizations['from']
        self.user1 = self.users['fs_user_1']
        self.org2 = self.organizations['to']
        self.user2 = self.users['fs_user_2']

        self.channel1 = NotificationChannel.objects.get(channel="IN_APP")
        self.channel2 = NotificationChannel.objects.get(channel="EMAIL")

        mock_send_amqp.return_value = True

    def test_compute_effective_subscriptions_default(self):
        subscriptions = AMQPNotificationService.compute_effective_subscriptions(self.user1)
        
        # There are two channels and each has one notification type in our setup. So 2 subscriptions.
        self.assertEqual(len(subscriptions), 132)

    def test_update_subscription_active(self):
        response = self.clients['fs_user_1'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_active)
        )

        subscription = NotificationSubscription.objects.get(
            user=self.user1,
            channel=self.channel1,
            notification_type=NotificationType.CREDIT_TRANSFER_CREATED
        )

        self.assertTrue(subscription.enabled)

    def test_update_subscription_inactive(self):
        response = self.clients['fs_user_1'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_inactive)
        )

        subscription = NotificationSubscription.objects.get(
            user=self.user1,
            channel=self.channel1,
            notification_type=NotificationType.CREDIT_TRANSFER_CREATED
        )

        self.assertFalse(subscription.enabled)

    def test_send_notification_global(self):
        response = self.clients['fs_user_1'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_active)
        )
        response = self.clients['fs_user_2'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_active)
        )
        with patch('api.notifications.notifications.AMQPNotificationService.send_email_for_notification') as mock_email:
            AMQPNotificationService.send_notification(
                message="Test Global Message",
                is_global=True,
                notification_type=NotificationType.CREDIT_TRANSFER_CREATED,
                originating_user=self.user1
            )
            # Check that the in-app notification was sent to all active users
            self.assertEqual(mock_email.call_count, 2)

    def test_send_notification_specific_org(self):
        response = self.clients['fs_user_1'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_active)
        )
        with patch('api.notifications.notifications.AMQPNotificationService.send_email_for_notification') as mock_email:
            AMQPNotificationService.send_notification(
                message="Test Message to Org1",
                interested_organization=self.org1,
                notification_type=NotificationType.CREDIT_TRANSFER_CREATED,
                originating_user=self.user2
            )
            # Check that the in-app notification was sent to all users in the specified organization
            self.assertEqual(mock_email.call_count, 1)

    def test_invalid_notification_args(self):
        with self.assertRaises(InvalidNotificationArguments):
            AMQPNotificationService.send_notification(
                message=None,  # Invalid as message is required
                interested_organization=self.org1,
                notification_type=NotificationType.CREDIT_TRANSFER_CREATED,
                originating_user=self.user1
            )

    def test_user_does_not_receive_unsubscribed_notification(self):
        # Deactivate a particular notification for user1
        response = self.clients['fs_user_1'].post(
            '/api/notifications/update_subscription',
            content_type='application/json',
            data=json.dumps(notifications_payload_single_false)
        )
        with patch('api.notifications.notifications.AMQPNotificationService.send_email_for_notification') as mock_email:
            AMQPNotificationService.send_notification(
                message="Test Message to Org1",
                interested_organization=self.org1,
                notification_type=NotificationType.CREDIT_TRANSFER_CREATED,
                originating_user=self.user2
            )

            # Check that the in-app notification was NOT sent to user1
            mock_email.assert_not_called()