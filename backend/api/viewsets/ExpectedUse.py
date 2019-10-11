from rest_framework import viewsets, permissions, mixins
from datetime import date
from django.db.models import Q

from api.models.ExpectedUse import ExpectedUse
from api.serializers.ExpectedUse import ExpectedUseSerializer
from auditable.views import AuditableMixin


class ExpectedUseViewSet(AuditableMixin, mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    ordering_fields = '__all__'
    ordering = ('display_order',)
    queryset = ExpectedUse.objects.all().order_by(*ordering)
    serializer_class = ExpectedUseSerializer
    serializer_classes = {
        'default': ExpectedUseSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        """
        This view should return a list of all the compliance reports
        for the currently authenticated user.
        """
        as_of = date.today()

        result = ExpectedUse.objects.filter(
            Q(expiration_date__gte=as_of) | Q(expiration_date=None)
        )
        result = result.filter(
            effective_date__lte=as_of
        )

        return result
