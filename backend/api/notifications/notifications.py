import json
from email.utils import make_msgid
from smtplib import SMTPException
from typing import List

import pika
from pika.exceptions import AMQPError
from django.core.cache import caches
from django.db import transaction
from rest_framework import serializers

from api.models.NotificationChannel import NotificationChannel
from api.models.NotificationMessage import NotificationMessage
from api.models.NotificationSubscription import NotificationSubscription
from api.models.User import User
from api.models.CreditTrade import CreditTrade
from api.models.Document import Document
from api.models.Organization import Organization
from api.models.Role import Role
from api.notifications.notification_types import NotificationType
from tfrs.settings import AMQP_CONNECTION_PARAMETERS, EMAIL

subscription_cache = caches['notification_subscriptions']


def send_amqp_notification(user):
    try:
        parameters = AMQP_CONNECTION_PARAMETERS
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        # channel.confirm_delivery()
        channel.exchange_declare(exchange='notifications',
                                 durable=True,
                                 auto_delete=False,
                                 exchange_type='fanout')

        channel.basic_publish(exchange='notifications',
                              routing_key='global',
                              body=json.dumps({
                                  'audience': user.username,
                                  'type': 'notification'
                              }),
                              properties=pika.BasicProperties(
                                  content_type='application/json',
                                  delivery_mode=1
                              ),
                              mandatory=True)

        connection.close()
    except AMQPError as error:
        raise NotificationDeliveryFailure(error)


class EffectiveSubscription(object):
    def __init__(self, channel, notification_type, subscribed):
        self.channel = channel
        self.notification_type = notification_type
        self.subscribed = subscribed

    def __eq__(self, other):
        return (self.channel == other.channel and
                self.subscribed == other.subscribed and
                self.notification_type == other.notification_type)


class EffectiveSubscriptionSerializer(serializers.Serializer):
    channel = serializers.SerializerMethodField()
    notification_type = serializers.SerializerMethodField()

    subscribed = serializers.BooleanField()

    def get_notification_type(self, obj):
        data = obj.notification_type.name
        return data

    def get_channel(self, obj):
        data = obj.channel.channel
        return data


class EffectiveSubscriptionUpdateSerializer(serializers.Serializer):
    channel = serializers.CharField()
    notification_type = serializers.CharField()
    subscribed = serializers.BooleanField()

    def validate(self, data):
        try:
            data['notification_type'] = NotificationType[data.get(
                'notification_type'
            )]
        except KeyError:
            raise serializers.ValidationError({
                'notification_type': 'Notification Type invalid'
            })

        try:
            data['channel'] = NotificationChannel.objects.get(channel=data.get('channel'))
        except NotificationChannel.DoesNotExist:
            raise serializers.ValidationError({
                'channel': 'Channel does not exist'
            })

        return data


class AMQPNotificationService:

    @staticmethod
    def __determine_message_recipients(
            is_global: bool = False,
            interested_organization: Organization = None,
            interested_roles: List[Role] = None
    ) -> List[User]:

        if is_global:
            return User.objects.all()

        if interested_organization is not None:
            users = User.objects.filter(organization=interested_organization)
            # if interested_roles is not None:
            #     users = users.filter(role__in=interested_roles)
            return users.all()

        return []

    @staticmethod
    def send_email_for_notification(notification: NotificationMessage):
        if not EMAIL['ENABLED']:
            return

        email_recipient = notification.user.email
        from email.message import EmailMessage
        import smtplib
        msg = EmailMessage()
        msg.set_content('You have received a new notification in TFRS.\nPlease sign in to view it.')
        bcgov_cid = make_msgid()
        msg.add_alternative("""\
        <html>
        <head>
        <style type="text/css">
        td {{
        padding: 15px 8px 15px 8px;
        }}
        </style>
        </head>
        <body>
        <table style="width: 100%; font-family: sans-serif; border-collapse: collapse; border: 2px solid #003366;">
        <tbody>
        <tr style="background: #003366; font-size: 24px; color: white;">
        <td width="185"
        style="text-align: right">
        <img alt="Government of British Columbia" width="155" height="52" src="cid:{bcgov_cid}"/>
        </td>
        <td style="font-weight: 400;">
        Transportation Fuels Reporting System
        </td>
        </tr>
        <tr style="min-height: 400px'">
        <td colspan="2"
        style="font-weight: bold;
        border-top: 4px solid #fcba19;
        font-size: 13px;
        line-height: 20px;
        padding-top: 20px;
        padding-bottom: 20px;">
        <p style="margin-left: 20px;">You have received a new notification in TFRS.</p>
        <p style="margin-left: 20px;">Please <a href="https://lowcarbonfuels.gov.bc.ca">sign in</a>
        to view it.</p>
        </td>
        </tr>
        </tbody>
        </table>
        </body>
        </html>
        """.format(bcgov_cid=bcgov_cid[1:-1]), subtype='html')

        with open('assets/bcgov.png', 'rb') as image:
            msg.get_payload()[1].add_related(image.read(), 'image', 'png', cid=bcgov_cid)

        msg['Subject'] = 'TFRS Notification'
        msg['From'] = EMAIL['FROM_ADDRESS']
        msg['To'] = email_recipient

        with smtplib.SMTP(host=EMAIL['SMTP_SERVER_HOST'],
                          port=EMAIL['SMTP_SERVER_PORT']) as server:
            try:
                server.send_message(msg)
            except SMTPException as error:
                raise NotificationDeliveryFailure(error)

    @staticmethod
    def compute_effective_subscriptions(user: User) -> List[EffectiveSubscription]:

        cached = subscription_cache.get(user.username)
        if cached is not None:
            return cached

        all_channels = NotificationChannel.objects.all()
        user_subscriptions = NotificationSubscription.objects.filter(
            user_id=user.id)
        all_notification_types = NotificationType

        effective_subscriptions = []

        for channel in all_channels:
            for notification_type in all_notification_types:
                subscription = user_subscriptions.filter(
                    channel=channel,
                    notification_type=notification_type
                ).first()
                is_subscribed = subscription.enabled if subscription else channel.subscribe_by_default
                effective_subscriptions.append(
                    EffectiveSubscription(channel=channel,
                                          notification_type=notification_type,
                                          subscribed=is_subscribed)
                )

        subscription_cache.set(user.username, effective_subscriptions)

        return effective_subscriptions

    @staticmethod
    def update_subscription(
            user: User,
            channel: NotificationChannel,
            notification_type: NotificationType,
            subscribed: bool
    ):

        existing_subscription = NotificationSubscription.objects.filter(
            user_id=user.id,
            channel=channel,
            notification_type=notification_type)

        if existing_subscription.exists():
            existing = existing_subscription.first()
            existing.enabled = subscribed
            existing.save()
        else:
            NotificationSubscription(
                user=user,
                channel=channel,
                notification_type=notification_type,
                enabled=subscribed
            ).save()

        subscription_cache.delete(user.username)

    @staticmethod
    @transaction.atomic
    def send_notification(message: str,
                          interested_organization: Organization,
                          interested_roles: List[Role] = [],
                          related_credit_trade: CreditTrade = None,
                          related_document: Document = None,
                          related_organization: Organization = None,
                          related_user: User = None,
                          is_error: bool = False,
                          is_warning: bool = False,
                          is_global: bool = False,
                          notification_type: NotificationType = None,
                          originating_user: User = None):

        if interested_organization is None and not is_global:
            raise InvalidNotificationArguments(
                'interested_organization is required'
                ' if this is not a global notification'
            )

        if message is None or len(message) == 0:
            raise InvalidNotificationArguments('msg is required')

        app_subscription = EffectiveSubscription(
            channel=NotificationChannel.objects.get(channel='IN_APP'),
            notification_type=notification_type,
            subscribed=True
        )

        email_subscription = EffectiveSubscription(
            channel=NotificationChannel.objects.get(channel='EMAIL'),
            notification_type=notification_type,
            subscribed=True
        )

        for recipient in AMQPNotificationService.__determine_message_recipients(
                is_global=is_global,
                interested_roles=interested_roles,
                interested_organization=interested_organization
        ):
            if not recipient.is_active:
                continue

            effective_subscriptions = AMQPNotificationService.compute_effective_subscriptions(recipient)

            if app_subscription in effective_subscriptions:
                notification = NotificationMessage(
                    user=recipient,
                    originating_user=originating_user,
                    related_credit_trade=related_credit_trade,
                    related_document=related_document,
                    related_organization=related_organization,
                    related_user=related_user,
                    message=message,
                    is_error=is_error,
                    is_warning=is_warning
                )
                notification.save()
                send_amqp_notification(recipient)

                if email_subscription in effective_subscriptions:
                    AMQPNotificationService.send_email_for_notification(notification)


class InvalidNotificationArguments(Exception):
    pass


class NotificationDeliveryFailure(Exception):
    pass
