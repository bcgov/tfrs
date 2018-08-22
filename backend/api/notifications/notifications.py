import json
import uuid
from datetime import datetime

import pika
from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder


class AMQPNotificationService:

    @staticmethod
    def send_notification(message: str):
        parameters = pika.ConnectionParameters()
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
                                  'message': message
                              }),
                              properties=pika.BasicProperties(content_type='application/json',
                                                              delivery_mode=1),
                              mandatory=True)


class NotificationService:

    @staticmethod
    async def send_notification(message):
        print('calling group send')
        channel = get_channel_layer()
        await channel.group_send(
            'global',
            {
                'type': 'notification.event',
                'notification': json.dumps({
                    'id': uuid.uuid4(),
                    'message': message
                },
                    sort_keys=True,
                    indent=1,
                    cls=DjangoJSONEncoder
                )
            }
        )


class NotificationDispatch(JsonWebsocketConsumer):
    groups = []

    def connect(self):
        self.accept('tfrs-notification-v1')

        # subscribe to organization channel, user channel, and global channel

        self.groups = [
            'global',
            'organization_{}'.format(self.scope["user"].organization.id),
            'user_{}'.format(self.scope["user"].id)
        ]

        for group_name in self.groups:
            async_to_sync(self.channel_layer.group_add)(
                group_name,
                self.channel_name
            )

        self.send_json(
            {
                'status': 'SUBSCRIBED',
                'at': datetime.today(),
                'user': self.scope["user"].display_name,
                'organization': self.scope["user"].organization.name
            }
        )

    def disconnect(self, close_code):
        for group_name in self.groups:
            print('disconnecting from {}'.format(group_name))
            async_to_sync(self.channel_layer.group_discard)(group_name, self.channel_name)

    def receive_json(self, content, **kwargs):
        pass

    def notification_event(self, event):
        """ received an event from one of our channels """

        print('received global notification')

        print(event)

        self.send_json(
            {
                'status': 'NOTIFICATION_RECEIVED',
                'at': datetime.today(),
                'user': self.scope["user"].display_name,
                'organization': self.scope["user"].organization.name,
                'notification': json.loads(event['notification'])
            }
        )

    def encode_json(cls, content):
        return json.dumps(
            content,
            sort_keys=True,
            indent=1,
            cls=DjangoJSONEncoder
        )
