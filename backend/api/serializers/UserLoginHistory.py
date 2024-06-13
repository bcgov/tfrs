from rest_framework import serializers
from api.models import UserLoginHistory

class UserLoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLoginHistory
        fields = '__all__'