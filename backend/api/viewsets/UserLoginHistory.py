from rest_framework import filters, mixins, viewsets
from rest_framework.pagination import PageNumberPagination
from api.models import UserLoginHistory
from api.serializers.UserLoginHistory import UserLoginHistorySerializer
from api.permissions.User import UserPermissions


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserLoginHistoryViewSet(mixins.ListModelMixin,
                              mixins.RetrieveModelMixin,
                              viewsets.GenericViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    permission_classes = (UserPermissions,)
    queryset = UserLoginHistory.objects.all()
    serializer_class = UserLoginHistorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-created_timestamp',)

    def get_queryset(self):
        """
        Optionally restricts the returned history records,
        by filtering against query parameters in the URL.
        """
        queryset = super().get_queryset()

        return queryset
