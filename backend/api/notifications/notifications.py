import json
from enum import Enum
from typing import List

import pika
from django.db import transaction
from pika.exceptions import AMQPError

from api.models.NotificationMessage import NotificationMessage
from api.models.User import User
from api.models.CreditTrade import CreditTrade
from api.models.Organization import Organization
from api.models.Role import Role
from tfrs.settings import AMQP_CONNECTION_PARAMETERS


class NotificationType(Enum):
    CREDIT_TRADE_CREATED = "Credit Trade Created"
    CREDIT_TRADE_SIGNED_1OF2 = "Credit Trade Signed 1/2"
    CREDIT_TRADE_SIGNED_2OF2 = "Credit Trade Signed 2/2"


class AMQPNotificationService:

    @staticmethod
    def __determine_message_recipients(is_global: bool = False,
                                       interested_organization: Organization = None,
                                       interested_roles: List[Role] = None):
        return User.objects.all()

    @staticmethod
    @transaction.atomic
    def send_notification(message: str,
                          interested_organization: Organization,
                          interested_roles: List[Role] = [],
                          related_credit_trade: CreditTrade = None,
                          related_organization: Organization = None,
                          related_user: User = None,
                          is_error: bool = False,
                          is_warning: bool = False,
                          is_global: bool = False,
                          originating_user: User = None):

        if (interested_roles is None or len(interested_roles) == 0) and not is_global:
            raise InvalidNotificationArguments('interested_roles is required'
                                               ' if this is not a global notification')
        if interested_organization is None and not is_global:
            raise InvalidNotificationArguments('interested_organization is required'
                                               ' if this is not a global notification')
        if message is None or len(message) == 0:
            raise InvalidNotificationArguments('msg is required')

        for recipient in AMQPNotificationService.__determine_message_recipients(
                is_global=is_global,
                interested_roles=interested_roles,
                interested_organization=interested_organization
        ):
            notification = NotificationMessage(
                user=recipient,
                originating_user=originating_user,
                related_credit_trade=related_credit_trade,
                related_organization=related_organization,
                related_user=related_user,
                message=message,
                is_error=is_error,
                is_warning=is_warning
            )
            notification.save()

        try:
            parameters = AMQP_CONNECTION_PARAMETERS
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            channel.confirm_delivery()
            channel.exchange_declare(exchange='notifications',
                                     durable=True,
                                     auto_delete=False,
                                     exchange_type='fanout')

            channel.basic_publish(exchange='notifications',
                                  routing_key='global',
                                  body=json.dumps({
                                      'message': 'notification'
                                  }),
                                  properties=pika.BasicProperties(content_type='application/json',
                                                                  delivery_mode=1),
                                  mandatory=True)
        except AMQPError as error:
            raise NotificationDeliveryFailure(error)


class InvalidNotificationArguments(Exception):
    pass


class NotificationDeliveryFailure(Exception):
    pass
