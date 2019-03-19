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

cache = caches['autocomplete']


class NoSuchFieldError(Exception):
    pass


class Completion(ABC):
    """Abstract base class defining the contract of a completion"""

    @abstractmethod
    def get_matches(self, q):
        pass


class SimpleDatabaseCompletion(Completion):
    """Completions based on a single column in SQLite or PostgreSQL"""

    def __init__(self, table, column):
        self.table = table
        self.column = column

    def _get_matches_sqlite(self, q):
        with connection.cursor() as cursor:
            cursor.execute("select distinct {col} from {table} WHERE {col} like '%%' || %s || '%%'"
                           "order by {col} limit 10"
                           .format(table=self.table, col=self.column),
                           [q])

            matches = [row[0] for row in cursor.fetchall]
            return matches

    def _get_matches_postgres(self, q):
        """Use Postgres Trigram extension for fancy, ranked matching"""
        with connection.cursor() as cursor:
            cursor.execute("SELECT distinct {col}, similarity({col}, %s) as sim"
                           " FROM {table}"
                           " WHERE similarity({col}, %s) > 0.1"
                           " ORDER BY sim DESC, {col}"
                           " limit 10"
                           .format(table=self.table, col=self.column),
                           [q, q])

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
            'fuel_code', 'feedstock_misc')
    }

    @staticmethod
    def get_matches(name, q):
        if name not in Autocomplete.completions:
            raise NoSuchFieldError('No completion for field {}'.format(name))

        cache_key = '{}:{}'.format(name, q)

        result = cache.get(cache_key)
        if not result:
            result = Autocomplete.completions[name].get_matches(q)
            cache.set(cache_key, result)

        return result
