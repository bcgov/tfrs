from rest_framework import serializers

from api.models.UserCreationRequest import UserCreationRequest
from api.serializers import UserCreateSerializer


class UserCreationRequestSerializer(serializers.Serializer):
    """
    Serializer for creating a user
    """
    user = UserCreateSerializer(allow_null=False)
    email = serializers.EmailField(allow_null=False, allow_blank=False)

    def __init__(self, *args, **kwargs):
        """
        This is to restrict non-government users from creating users
        for other organizations
        """
        super(UserCreationRequestSerializer, self).__init__(*args, **kwargs)
        data = kwargs.get('data')
        request = self.context.get('request')

        if not request.user.is_government_user:
            user = data['user']
            user['organization'] = request.user.organization.id

    def validate(self, data):
        """
        Validation to check that the email hasn't been used yet.
        """
        if UserCreationRequest.objects.filter(
                keycloak_email=data['email']).exists():
            raise serializers.ValidationError(
                'This SSO email is already associated with a user')

        return data

    def create(self, validated_data):
        user_serializer = UserCreateSerializer(data=self.data['user'])
        user_serializer.is_valid()
        user = user_serializer.save()

        return UserCreationRequest.objects.create(
            keycloak_email=validated_data['email'],
            user=user
        )
