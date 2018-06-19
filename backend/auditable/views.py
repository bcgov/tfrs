from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status

from api.models.User import User


class AuditableMixin(object,):

    def audit(self, request):
        header_user_guid = request.META.get('HTTP_SMAUTH_USERGUID')
        user = User.objects.get(authorization_guid=header_user_guid)

        if self.action == 'create':
            request.data.update({
                'create_user': user.id
            })

        request.data.update({
            'update_user': user.id
        })
        return request

    def serialize_object(self, request, data):
        header_user_guid = request.META.get('HTTP_SMAUTH_USERGUID')
        user = User.objects.get(authorization_guid=header_user_guid)
        data.update({'create_user': user.id, 'update_user': user.id})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return serializer.data

    def create(self, request, *args, **kwargs):
        objs = []
        if type(request.data) is list:
            for data in request.data:
                objs.append(self.serialize_object(request, data))
        else:
            objs.append(self.serialize_object(request, request.data))

        response = objs[0] if len(objs) == 1 else objs
        headers = self.get_success_headers(response)
        return Response(response, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        instance = serializer.save()

    def update(self, request, *args, **kwargs):
        if request.method == 'PATCH':
            partial = kwargs.pop('partial', True)
        else:
            partial = kwargs.pop('partial', False)

        instance = self.get_object()
        header_user_guid = request.META.get('HTTP_SMAUTH_USERGUID')
        user = User.objects.get(authorization_guid=header_user_guid)
        request.data.update({'update_user': user.id})
        print(instance)
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
