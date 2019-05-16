# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel
    Requirements Regulation.

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
import json
from rest_framework import status

from api.services.Autocomplete import Autocomplete

from .base_test_case import BaseTestCase


class TestAutosave(BaseTestCase):
    """Tests for autosave service"""

    def test_autosave_api(self):
        """test autosave API with an authorized user"""
        key = 'autosave_test_1_1'

        payload = {
            'key': key,
            'data': 'blob'
        }

        response = self.clients['gov_analyst'].post('/api/autosave', content_type='application/json',
                                                    data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        # now get it
        response = self.clients['gov_analyst'].get('/api/autosave?key={}'.format(key))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['data'], 'blob')

        # get it as someone else
        response = self.clients['gov_director'].get('/api/autosave?key={}'.format(key))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # update it
        payload = {
            'key': key,
            'data': 'blobv2'
        }

        response = self.clients['gov_analyst'].post('/api/autosave', content_type='application/json',
                                                    data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response = self.clients['gov_analyst'].get('/api/autosave?key={}'.format(key))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['data'], 'blobv2')
