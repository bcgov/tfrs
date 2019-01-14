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

import datetime
import json

from rest_framework import status

from .base_test_case import BaseTestCase


class TestCreditTradesCaching(BaseTestCase):
    """Validate that caching performance improvements are working correctly"""

    def setUp(self):
        """Test data setup"""

        super().setUp()

        # Give Test Org 2 a credit so that that the the government analyst
        # sees at least one transaction that fs_user_1 does not.

        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': self.users['gov_director'].organization.id,
            'numberOfCredits': 1,
            'respondent': self.users['fs_user_2'].organization.id,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_etag_caching_credit_trades(self):
        """Validate ETag calculation for /api/credit_trades"""

        response = self.clients['gov_analyst'].get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        got_etag = response['ETag']
        self.assertGreater(len(got_etag), 32)

        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH='nonsense etag')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        got_etag = response['ETag']
        self.assertGreater(len(got_etag), 32)

        # also get one as somebody else
        response = self.clients['fs_user_1'].get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        got_etag_for_fs1 = response['ETag']
        self.assertGreater(len(got_etag_for_fs1), 32)

        # they see different things
        self.assertNotEqual(got_etag_for_fs1, got_etag)

        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        self.assertEqual(response.status_code, status.HTTP_304_NOT_MODIFIED)

        # create a new credit trade to invalidate the cache (and save the id for later)

        payload = {'fairMarketValuePerCredit': '1.00',
                   'initiator': self.users['fs_user_1'].organization.id,
                   'numberOfCredits': 1,
                   'respondent': self.users['fs_user_2'].organization.id,
                   'status': self.statuses['submitted'].id,
                   'tradeEffectiveDate': datetime.datetime.today().strftime(
                       '%Y-%m-%d'
                   ),
                   'type': self.credit_trade_types['sell'].id,
                   'zeroReason': None}

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_id = json.loads(response.content.decode('utf-8'))['id']

        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': self.users['fs_user_1'].organization.id,
            'numberOfCredits': 1,
            'respondent': self.users['fs_user_2'].organization.id,
            'status': self.statuses['accepted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(created_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # now our etag should be invalid again
        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        got_etag = response['ETag']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # now good again (but different)
        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        self.assertEqual(response.status_code, status.HTTP_304_NOT_MODIFIED)

        # now go update that record we created earlier to invalidate the cache a different way
        response = self.clients['gov_analyst'].patch(
            '/api/credit_trades/{}'.format(created_id),
            content_type='application/json',
            data=json.dumps({"status": self.statuses['recommended'].id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # now our etag should be invalid yet again
        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        got_etag = response['ETag']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # now good again (but different)
        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        self.assertEqual(response.status_code, status.HTTP_304_NOT_MODIFIED)

        # Rename an organization and confirm that this invalidates the Etag
        response = self.clients['gov_analyst'].patch('/api/organizations/{}'.format(
            self.users['fs_user_2'].organization.id
        ),
            content_type='application/json',
            data=json.dumps({
                'name': 'Renamed FS2'
            })
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['gov_analyst'] \
            .get('/api/credit_trades', HTTP_IF_NONE_MATCH=got_etag)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
