import base64
import random
import pika
import json
from django.http import HttpResponse

from rest_framework import viewsets, serializers, mixins, status
from rest_framework.decorators import list_route
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from api.models.NotificationMessage import NotificationMessage
from api.notifications.notifications import AMQPNotificationService, EffectiveSubscriptionSerializer, \
    EffectiveSubscriptionUpdateSerializer
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
    #serializer_class = NotificationMessageSerializer
    serializer_classes = {
        'update_subscription': EffectiveSubscriptionUpdateSerializer,
        'default': NotificationMessageSerializer,
    }

    queryset = NotificationMessage.objects.all()
    ordering = ('-id',)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        user = self.request.user
        return NotificationMessage.objects.filter(user=user).all()

    @list_route(methods=['get'])
    def subscribe(self, request):
        token = NotificationToken()
        serializer = NotificationTokenSerializer(token)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def effective_subscriptions(self, request):
        user = request.user
        data = AMQPNotificationService.compute_effective_subscriptions(user)
        serializer = EffectiveSubscriptionSerializer(data, many=True)
        return Response(serializer.data)

        # self.channel.basic_publish(exchange='tokens',
        #                            routing_key='tokens',
        #                            body=JSONRenderer().render(serializer.data),
        #                            properties=pika.BasicProperties(content_type='application/json',
        #                                                            delivery_mode=1),
        #                            mandatory=True)

        #return Response(serializer.data)

    @list_route(methods=['post'])
    def update_subscription(self, request):

        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            updated_subscriptions = serializer.validated_data
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            updated_subscriptions = [serializer.validated_data]

        for subscription in updated_subscriptions:
            AMQPNotificationService.update_subscription(
                user=request.user,
                channel=subscription['channel'],
                notification_type=subscription['notification_type'],
                subscribed=subscription['subscribed']
            )

        return Response(None, status=status.HTTP_200_OK)
