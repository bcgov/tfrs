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
from django.db import connection
from django.db.models import Max

from api.models.FuelCode import FuelCode
from .OrganizationAutocomplete import OrganizationAutocomplete

cache = caches['autocomplete']


class NoSuchFieldError(Exception):
    pass


class Completion(ABC):
    """Abstract base class defining the contract of a completion"""

    @abstractmethod
    def get_matches(self, q):
        pass


class GetNextIncrement(Completion):
    """
    Gets the next available value by getting the max value provided
    in 'increment' and filtered by 'column'
    """

    def __init__(self, table, column):
        self.table = table
        self.column = column

        if column == 'fuel_code_version':
            self.table = FuelCode
            self.increment = 'fuel_code_version_minor'

    def get_matches(self, q):
        # get only digits
        if not q.isdigit():
            digits = ''

            for character in q:
                if character.isdigit():
                    digits = digits + character

            q = digits

        if q == '':
            return []

        kwargs = {
            self.column: q
        }

        query = self.table.objects.filter(**kwargs).aggregate(
            Max(self.increment)
        )

        increment = query.get('{0}__max'.format(self.increment), None)

        if increment is not None:
            return ['{version}.{increment}'.format(
                version=q.strip(), increment=increment + 1)]

        return []


class SimpleDatabaseCompletion(Completion):
    """Completions based on a single column in SQLite or PostgreSQL"""

    def __init__(self, table, column):
        self.table = table
        self.column = column

    def _get_matches_sqlite(self, q):
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT DISTINCT {col} FROM {table}"
                " WHERE {col} LIKE '%%' || %s || '%%'"
                " ORDER BY {col} "
                " LIMIT 10"
                .format(table=self.table, col=self.column), [q]
            )
            matches = [row[0] for row in cursor.fetchall()]
            return matches

    def _get_matches_postgres(self, q):
        """Use Postgres Trigram extension for fancy, ranked matching"""
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT DISTINCT {col}, similarity({col}, %s) AS sim"
                " FROM {table}"
                " WHERE similarity({col}, %s) > 0.1"
                " ORDER BY sim DESC, {col}"
                " LIMIT 10"
                .format(table=self.table, col=self.column), [q, q]
            )
            matches = [row[0] for row in cursor.fetchall()]
            return matches

    def get_matches(self, q):
        if connection.vendor == 'sqlite':
            return self._get_matches_sqlite(q)
        elif connection.vendor == 'postgresql':
            return self._get_matches_postgres(q)
        else:
            raise Exception('Completions not available for engine: {}'.format(
                connection.vendor))


class Autocomplete:
    completions = {
        'fuel_code.company': SimpleDatabaseCompletion(
            'fuel_code', 'company'),
        'fuel_code.former_company': SimpleDatabaseCompletion(
            'fuel_code', 'former_company'),
        'fuel_code.feedstock': SimpleDatabaseCompletion(
            'fuel_code', 'feedstock'),
        'fuel_code.feedstock_location': SimpleDatabaseCompletion(
            'fuel_code', 'feedstock_location'),
        'fuel_code.feedstock_misc': SimpleDatabaseCompletion(
            'fuel_code', 'feedstock_misc'),
        'fuel_code.facility_location': SimpleDatabaseCompletion(
            'fuel_code', 'facility_location'),
        'fuel_code.fuel_code_version': GetNextIncrement(
            'fuel_code', 'fuel_code_version'),
        'organization.name': OrganizationAutocomplete()
    }

    @staticmethod
    def get_matches(name, q, cache_results=True):
        if name not in Autocomplete.completions:
            raise NoSuchFieldError('No completion for field {}'.format(name))

        cache_key = '{}:{}'.format(name, q)

        if cache_results:
            result = cache.get(cache_key)
        else:
            result = None

        if not result:
            result = Autocomplete.completions[name].get_matches(q)
            cache.set(cache_key, result)

        return result
