from django.http import JsonResponse
from rest_framework.exceptions import NotFound, APIException, ValidationError
from rest_framework.response import Response

from rest_framework.viewsets import ViewSet

from api.permissions.Autocomplete import AutocompletePermissions
from api.services.Autocomplete import Autocomplete, NoSuchFieldError


class AutocompleteViewSet(ViewSet):
    permission_classes = (AutocompletePermissions,)
    http_method_names = ['get']

    def list(self, request):
        field = request.GET.get('field')
        q = request.GET.get('q')

        if not field or not q:
            raise ValidationError('required query parameter field or q not present')

        try:
            result = Autocomplete.get_matches(field, q)
            response = JsonResponse(result, safe=False)
            response['Cache-Control'] = 'max-age=3600'
            return response
        except NoSuchFieldError as e:
            raise NotFound()

