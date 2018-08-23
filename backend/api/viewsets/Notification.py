import base64
import random
import pika

from rest_framework import viewsets, serializers, mixins
from rest_framework.decorators import list_route
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from api.models.NotificationMessage import NotificationMessage
from api.permissions.Notifications import NotificationPermissions
from api.serializers.Notifications import NotificationMessageSerializer
from auditable.views import AuditableMixin


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


class NotificationViewSet(AuditableMixin,
                          mixins.ListModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):

    permission_classes = (NotificationPermissions,)
    http_method_names = ['get', 'put', 'post']
    serializer_class = NotificationMessageSerializer
    queryset = NotificationMessage.objects.all()
    ordering = ('-id',)

    def get_queryset(self):
        user = self.request.user
        return NotificationMessage.objects.filter(user=user).all()

    @list_route(methods=['get'])
    def subscribe(self, request):
        token = NotificationToken()
        serializer = NotificationTokenSerializer(token)

        # self.channel.basic_publish(exchange='tokens',
        #                            routing_key='tokens',
        #                            body=JSONRenderer().render(serializer.data),
        #                            properties=pika.BasicProperties(content_type='application/json',
        #                                                            delivery_mode=1),
        #                            mandatory=True)

        return Response(serializer.data)
