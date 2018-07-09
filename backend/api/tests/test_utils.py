# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
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

from django.test import TestCase
from api import utils


class TestUtils(TestCase):
    """Tests for the utils module"""

    fixtures = []

    valid_names = [
        {'display_name': 'Dane Toe',
         'user_type': 'Business',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Dane Toe',
         'user_type': 'Personal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane (Test) FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
        {'display_name': 'Toe, Dane FFFF:EX',
         'user_type': 'Internal',
         'result': {
             'first_name': "Dane",
             'last_name': "Toe"}
         },
    ]

    def test_names(self):
        """Validate that utils is correctly extracting first and last name"""

        for name in self.valid_names:
            fname, lname = utils.get_firstname_lastname(
                name.get("display_name"), name.get("user_type"))

            assert fname == name.get("result").get("first_name")
            assert lname == name.get("result").get("last_name")
