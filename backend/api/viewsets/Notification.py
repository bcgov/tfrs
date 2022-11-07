import base64
import random

from django.http import JsonResponse
from django.views.decorators.cache import never_cache

from rest_framework import viewsets, serializers, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models.NotificationMessage import NotificationMessage
from api.notifications.notifications import AMQPNotificationService, \
    EffectiveSubscriptionSerializer, EffectiveSubscriptionUpdateSerializer
from api.permissions.Notifications import NotificationPermissions
from api.serializers.Notifications import NotificationMessageSerializer
from auditable.views import AuditableMixin
from api.paginations import BasicPagination
from django.db.models import Q

class NotificationToken(object):

    @staticmethod
    def __generate_token():
        token = bytearray
        rand = random.SystemRandom()

        token = bytes([rand.getrandbits(8) for x in range(48)])

        return base64.encodebytes(token).decode('utf-8')

    def __init__(self, token=None):
        self.token = token or NotificationToken.__generate_token()


class NotificationTokenSerializer(serializers.Serializer):
    token = serializers.CharField()


class NotificationViewSet(AuditableMixin,
                          mixins.ListModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):

    pagination_class = BasicPagination
    permission_classes = (NotificationPermissions,)
    http_method_names = ['get', 'put', 'post']
    serializer_classes = {
        'update_subscription': EffectiveSubscriptionUpdateSerializer,
        'default': NotificationMessageSerializer
    }

    queryset = NotificationMessage.objects.all()
    ordering = ('-id',)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        user = self.request.user
        qs = NotificationMessage.objects.filter(
            is_archived=False,
            user=user
        )

        request = self.request
        if request.path.endswith('processed_list') and request.method == 'POST':
            qs = qs.order_by('-create_timestamp')
            filters = request.data.get('filters')
            if filters:
                for filter in filters:
                    id = filter.get('id')
                    value = filter.get('value')
                    if id and value:
                        if id == 'notification':
                            #todo: this can be improved
                            qs = qs.filter(message__icontains = value)
                        elif id == 'date':
                            qs = qs.filter(update_timestamp__icontains = value)
                        elif id == 'user':
                            user_split = value.split()
                            q_object = None
                            for x in user_split:
                                q_sub_object = Q(originating_user__first_name__icontains = x) | Q(originating_user__last_name__icontains = x)
                                if not q_object:
                                    q_object = q_sub_object
                                else:
                                    q_object = q_object | q_sub_object
                            qs = qs.filter(q_object)
                        elif id == 'creditTrade':
                            if value.isnumeric():
                                qs = qs.filter(related_credit_trade__id__exact = value)
                            elif value == '-':
                                qs = qs.filter(related_credit_trade__isnull = True)
                            else:
                                qs = qs.none()
                        elif id == 'organization':
                            qs = qs.filter(related_organization__name__icontains = value)
        return qs


    @action(detail=False, methods=['post'])
    def processed_list(self, request):
        return super().list(request)

    @never_cache
    @action(detail=False, methods=['get'])
    def count(self, request):
        user = self.request.user

        count = NotificationMessage.objects.filter(
            is_archived=False,
            is_read=False,
            user=user
        ).count()

        data = {
            'unreadCount': count
        }

        return JsonResponse(data)

    @never_cache
    def list(self, request, *args, **kwargs):
        """
        Lists all the notifications for the current user.
        Note: no-cache decorator applied to prevent caching by IE
        """
        return super().list(self, request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def subscribe(self, request):
        token = NotificationToken()
        serializer = NotificationTokenSerializer(token)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def subscriptions(self, request):
        user = request.user
        data = AMQPNotificationService.compute_effective_subscriptions(user)
        serializer = EffectiveSubscriptionSerializer(data, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def statuses(self, request):
        """
        Expects an array of id's
        Updates the notifications to read or unread
        """
        data = request.data
        user = request.user

        if 'ids' not in data:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        ids = data.get('ids')

        if isinstance(ids, str) and ids == 'all':
            notifications = NotificationMessage.objects.filter(
                is_archived=False,
                is_read=False,
                user=user
            )
        else:
            notifications = NotificationMessage.objects.filter(
                id__in=ids,
                user=user
            )

        if 'is_archived' in data:
            notifications.update(
                is_archived=data['is_archived']
            )

        if 'is_read' in data:
            notifications.update(
                is_read=data['is_read']
            )

        serializer = self.get_serializer(notifications, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def update_subscription(self, request):
        """
        Updates the User's subscriptions to specified notification types
        """
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
