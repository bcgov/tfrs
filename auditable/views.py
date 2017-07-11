from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status


class AuditableMixin(object,):

    def create(self, request, *args, **kwargs):
        http_sm_user = request.META.get('HTTP_SM_USER')
        request.data.update({'CREATE_USER':http_sm_user,'UPDATE_USER':http_sm_user})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer,request)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer,request):
        instance = serializer.save()


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        http_sm_user = request.META.get('HTTP_SM_USER')
        request.data.update({'UPDATE_USER':http_sm_user})
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
