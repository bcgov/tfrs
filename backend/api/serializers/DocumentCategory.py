"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""
import datetime

from django.db.models import Q
from rest_framework import serializers

from api.models.DocumentCategory import DocumentCategory
from api.serializers.DocumentType import DocumentTypeSerializer


class DocumentCategorySerializer(serializers.ModelSerializer):
    types = serializers.SerializerMethodField()

    def get_types(self, instance):
        """
        Explicit function to ensure that the ordering works as expected
        """
        today = datetime.datetime.today().strftime('%Y-%m-%d')

        types = instance.types.filter(
            Q(expiration_date__gte=today) | Q(expiration_date=None)
        ).order_by('description')
        serializer = DocumentTypeSerializer(types, many=True, read_only=True)
        return serializer.data

    class Meta:
        model = DocumentCategory
        fields = (
            'id', 'name', 'types')
