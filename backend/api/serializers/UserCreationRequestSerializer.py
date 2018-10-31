from rest_framework import serializers

from api.models.UserCreationRequest import UserCreationRequest
from api.serializers import UserCreateSerializer


class UserCreationRequestSerializer(serializers.Serializer):
    user = UserCreateSerializer(allow_null=False)
    email = serializers.EmailField(allow_null=False, allow_blank=False)

    def validate(self, data):
        if UserCreationRequest.objects.filter(keycloak_email=data['email']).exists():
            raise serializers.ValidationError('This SSO email is already associated with a user')

        return data

    def create(self, validated_data):
        user_serializer = UserCreateSerializer(data=self.data['user'])
        user_serializer.is_valid()
        user = user_serializer.save()

        return UserCreationRequest.objects.create(
            keycloak_email=validated_data['email'],
            user=user
        )
