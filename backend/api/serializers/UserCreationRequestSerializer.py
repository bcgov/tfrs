from rest_framework import serializers


class UserCreationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
