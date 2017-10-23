from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status


class AuditableMixin(object,):

    def audit(self, request):
        # Django headers should be in this format: SM-USER
        # For it to translate to HTTP_SM_USER
        http_sm_user = request.META.get('HTTP_SM_USER_ID')

        if self.action == 'create':
            request.data.update({
                'create_user': http_sm_user
            })

        request.data.update({
            'update_user': http_sm_user
        })
        return request

    def serialize_object(self, request):
        http_sm_user = request.META.get('HTTP_SM_USER')
        request.data.update({'create_user':http_sm_user,'update_user':http_sm_user})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return serializer.data

    def create(self, request, *args, **kwargs):
        objs = []
        if type(request.data) is list:
            for obj in request.data:
                objs.append(self.serialize_object(obj))
        else:
            objs.append(self.serialize_object(request))

        response = objs[0] if len(objs) == 1 else objs
        headers = self.get_success_headers(response)
        return Response(response, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        instance = serializer.save()


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        http_sm_user = request.META.get('HTTP_SM_USER')
        request.data.update({'update_user':http_sm_user})
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
