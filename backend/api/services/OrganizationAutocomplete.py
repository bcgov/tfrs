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
from abc import ABC, abstractmethod

from django.core.cache import caches
from django.db.models import Max

from api.models.Organization import Organization
from api.serializers.Organization import OrganizationDisplaySerializer

cache = caches['autocomplete']


class Completion(ABC):
    """Abstract base class defining the contract of a completion"""

    @abstractmethod
    def get_matches(self, q):
        pass


class OrganizationAutocomplete(Completion):
    """
    Gets the next available value by getting the max value provided
    in 'increment' and filtered by 'column'
    """

    def get_matches(self, q):
        results = Organization.objects.filter(
            name__icontains=q
        ).order_by('name')[:10]

        serializer = OrganizationDisplaySerializer(
            results, many=True, read_only=True)

        return serializer.data
