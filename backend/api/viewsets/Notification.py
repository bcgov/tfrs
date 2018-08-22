import base64
import random
import pika

from rest_framework import viewsets, serializers
from rest_framework.decorators import list_route
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

class NotificationToken(object):

    @staticmethod
    def __generate_token():
        t = bytearray
        rand = random.SystemRandom()

        t = bytes([rand.getrandbits(8) for x in range(48)])

        return base64.encodebytes(t).decode('utf-8')

    def __init__(self, token=None):
        self.token = token or NotificationToken.__generate_token()


class NotificationTokenSerializer(serializers.Serializer):
    token = serializers.CharField()


class NotificationViewSet(viewsets.ViewSet):

    def __init__(self, *args, **kwargs):
        parameters = pika.ConnectionParameters()
        connection = pika.BlockingConnection(parameters)
        self.channel = connection.channel()
        self.channel.confirm_delivery()
        self.channel.exchange_declare(exchange='tokens',
                                      durable=True,
                                      auto_delete=False,
                                      exchange_type='fanout')

        super(NotificationViewSet, self).__init__(*args, **kwargs)

    @list_route(methods=['get'])
    def subscribe(self, request):
        token = NotificationToken()
        serializer = NotificationTokenSerializer(token)

        self.channel.basic_publish(exchange='tokens',
                                   routing_key='tokens',
                                   body=JSONRenderer().render(serializer.data),
                                   properties=pika.BasicProperties(content_type='application/json',
                                                                   delivery_mode=1),
                                   mandatory=True)

        return Response(serializer.data)
