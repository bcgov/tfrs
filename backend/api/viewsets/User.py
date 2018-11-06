from rest_framework import mixins, viewsets
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from api.decorators import permission_required, exceptions
from api.models.User import User
from api.permissions.User import UserPermissions
from api.serializers import UserSerializer, UserViewSerializer, UserUpdateSerializer, CreditTradeHistoryMinSerializer, Q
from api.serializers.UserCreationRequestSerializer import UserCreationRequestSerializer
from auditable.views import AuditableMixin


class UserViewSet(AuditableMixin, viewsets.GenericViewSet,
                  mixins.CreateModelMixin, mixins.ListModelMixin,
                  mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and  `update`  actions.
    """
    permission_classes = (UserPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = User.objects.all()

    serializer_classes = {
        'default': UserSerializer,
        'retrieve': UserViewSerializer,
        'by_username': UserViewSerializer,
        'update': UserUpdateSerializer,
        'create': UserCreationRequestSerializer
    }

    column_sort_mappings = {
        'updateTimestamp': 'credit_trade_update_time',
        'creditTradeId': 'id',
        'creditType': 'type__the_type',
        'action': 'status__status'
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    @detail_route()
    def history(self, request, pk=None):
        """
        Function to get the user's activity.
        This should be restricted based on the user's roles.
        A government user won't see draft, submitted, refused.
        A regular user won't see recommended and not recommended.
        Regular users will only see histories related to their organization
        """
        obj = User.objects.filter(id=pk).first()

        limit = None
        offset = None
        sort_by = 'credit_trade_update_time'
        sort_direction = '-'

        if 'limit' in request.GET:
            limit = int(request.GET['limit'])

        if 'offset' in request.GET:
            offset = int(request.GET['offset'])

        if 'sort_by' in request.GET:
            sort_by = self.column_sort_mappings[request.GET['sort_by']]

        if 'sort_direction' in request.GET:
            sort_direction = request.GET['sort_direction']

        # if the user is not a government user we should limit what we show
        # so no recommended/not recommended
        if not request.user.is_government_user:
            if request.user.organization != obj.organization:
                raise exceptions.PermissionDenied(
                    'You do not have sufficient authorization to use this '
                    'functionality.'
                )

            history = obj.get_history(
                (Q(credit_trade__initiator_id=request.user.organization_id) |
                 Q(credit_trade__respondent_id=request.user.organization_id)) &
                (Q(status__status__in=[
                    "Accepted", "Refused", "Submitted"
                ]) | Q(is_rescinded=True)))
        else:
            history = obj.get_history(
                Q(status__status__in=[
                    "Accepted", "Approved", "Declined", "Not Recommended",
                    "Recommended"
                ]))

        history = history.order_by('{sort_direction}{sort_by}'
                                   .format(sort_direction=sort_direction,
                                           sort_by=sort_by))
        total = history.count()

        headers = {
            'X-Total-Count': '{}'.format(total)
        }

        if limit is not None and offset is not None:
            history = history[offset:offset + limit]

        serializer = CreditTradeHistoryMinSerializer(history, read_only=True,
                                                     many=True)

        return Response(headers=headers,
                        data=serializer.data)

    @list_route()
    def current(self, request):
        """
        Get the current user
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @permission_required('USER_MANAGEMENT')
    def list(self, request, *args, **kwargs):
        result = User.objects.all()
        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    @permission_required('USER_MANAGEMENT')
    def by_username(self, request):

        if 'username' not in request.GET:
            return Response(status=400)

        username = request.GET['username']
        result = User.objects.filter(username=username)

        if not result.exists():
            return Response(status=404)

        serializer = self.get_serializer(result.first())
        return Response(serializer.data)

    @list_route()
    @permission_required('USER_MANAGEMENT')
    def search(self, request, organizations=None, surname=None,
               include_inactive=None, username=None):
        result = User.objects.all()
        if surname is not None:
            result = result.filter(surname__icontains=surname)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        ucr = serializer.save()
