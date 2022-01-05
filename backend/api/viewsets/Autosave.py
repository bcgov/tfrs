from django.utils import timezone

from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_202_ACCEPTED, HTTP_404_NOT_FOUND

from rest_framework.viewsets import ViewSet

from api.models.AutosavedFormData import AutosavedFormData
from api.serializers.AutosavedFormData import AutosavedFormDataSerializer


class AutosaveViewSet(ViewSet):
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get', 'post']
    queryset = AutosavedFormData.objects.all()
    serializer_class = AutosavedFormDataSerializer

    def list(self, request):
        key = request.GET.get('key')
        user = self.request.user

        result = AutosavedFormData.objects.filter(user=user, key=key).first()
        if result is None:
            return HttpResponse(status=HTTP_404_NOT_FOUND)

        result.last_access = timezone.now()
        result.save()

        serializer = AutosavedFormDataSerializer(result)

        return JsonResponse(serializer.data, status=HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        user = self.request.user
        AutosavedFormData.objects.filter(user=user).all().delete()
        return HttpResponse(status=HTTP_200_OK)

    def create(self, request):
        serializer = AutosavedFormDataSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return HttpResponse(status=HTTP_202_ACCEPTED)
