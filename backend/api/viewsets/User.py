from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F, Q, Value
from django.utils.decorators import method_decorator

from api.decorators import permission_required, exceptions
from api.models.User import User
from api.permissions.User import UserPermissions
from api.serializers \
    import UserSerializer, UserViewSerializer, UserUpdateSerializer
from api.serializers.UserCreationRequestSerializer \
    import UserCreationRequestSerializer
from api.serializers.UserHistory import UserHistorySerializer
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
        'create': UserCreationRequestSerializer,
        'partial_update': UserUpdateSerializer
    }

    column_sort_mappings = {
        'createTimestamp': 'create_timestamp',
        'type': 'type__the_type',
        'id': 'id',
        'status': 'status'
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    @action(detail=True)
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
        sort_by = 'create_timestamp'
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

            credit_trade_history = obj.get_history(
                (Q(credit_trade__initiator_id=request.user.organization_id) |
                 Q(credit_trade__respondent_id=request.user.organization_id)) &
                (Q(status__status__in=[
                    "Accepted", "Refused", "Submitted"
                ]) | Q(is_rescinded=True))).order_by(
                    '{sort_direction}{sort_by}'.format(
                        sort_direction=sort_direction,
                        sort_by=sort_by
                    )
                )

            compliance_report_history = obj.get_compliance_report_history(
                (Q(status__fuel_supplier_status_id="Submitted") &
                 Q(status__analyst_status_id="Unreviewed") &
                 Q(status__manager_status_id="Unreviewed"))
            ).order_by(
                '{sort_direction}{sort_by}'.format(
                    sort_direction=sort_direction,
                    sort_by=sort_by
                )
            )
        else:
            credit_trade_history = obj.get_history(
                Q(status__status__in=[
                    "Accepted", "Approved", "Declined", "Not Recommended",
                    "Recommended"
                ]))
            compliance_report_history = obj.get_compliance_report_history(
                (Q(status__fuel_supplier_status_id="Submitted") &
                 Q(status__analyst_status_id__in=[
                     "Unreviewed", "Recommended", "Not Recommended",
                     "Request Supplemental"
                 ]) &
                 Q(status__manager_status_id__in=[
                     "Unreviewed", "Recommended", "Not Recommended",
                     "Request Supplemental"
                 ]))
            ).order_by(
                '{sort_direction}{sort_by}'.format(
                    sort_direction=sort_direction,
                    sort_by=sort_by
                )
            )

        # I am probably misusing the F expression here
        # But for the ordering to work, I have to keep the fields in order
        # and rename them (check the user model, the select has different
        # names)
        # It also needs to reference a field, (you'll notice there are two
        # id's, This is to bypass the check to the model)
        history = credit_trade_history.values(
            type=Value('Credit Trade'),
            id=F('id'),
            object_id=F('credit_trade_id'),
            status_id=F('status_id'),
            create_timestamp=F('create_timestamp')
        ).order_by('{sort_direction}{sort_by}'.format(
            sort_direction=sort_direction, sort_by=sort_by
        ))

        history = history.union(
            compliance_report_history.values(
                type=Value('Compliance Report'),
                id=F('id'),
                object_id=F('compliance_report_id'),
                status_id=F('status_id'),
                create_timestamp=F('create_timestamp')
            ).order_by('{sort_direction}{sort_by}'.format(
                sort_direction=sort_direction, sort_by=sort_by
            )), all=True
        )

        total = history.count()

        headers = {
            'X-Total-Count': '{}'.format(total)
        }

        if limit is not None and offset is not None:
            history = history[offset:offset + limit]

        serializer = UserHistorySerializer(
            history, read_only=True, many=True,
            context={'request': request}
        )

        return Response(headers=headers,
                        data=serializer.data)

    @action(detail=False)
    def current(self, request):
        """
        Get the current user
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @method_decorator(permission_required('USER_MANAGEMENT'))
    def list(self, request, *args, **kwargs):
        result = User.objects.all()
        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    @method_decorator(permission_required('USER_MANAGEMENT'))
    def by_username(self, request):

        if 'username' not in request.GET:
            return Response(status=400)

        username = request.GET['username']
        result = User.objects.filter(username=username)

        if not result.exists():
            return Response(status=404)

        serializer = self.get_serializer(result.first())
        return Response(serializer.data)

    @action(detail=False)
    @method_decorator(permission_required('USER_MANAGEMENT'))
    def search(self, request, organizations=None, surname=None,
               include_inactive=None, username=None):
        result = User.objects.all()
        if surname is not None:
            result = result.filter(surname__icontains=surname)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        serializer.save()
