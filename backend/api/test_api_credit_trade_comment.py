"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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
import logging
from django.test import TestCase
from django.test import Client
import django


from rest_framework import status

from . import fakedata
from .serializers import CreditTradeStatusSerializer
from .serializers import CreditTradeTypeSerializer
from .serializers import CreditTradeZeroReasonSerializer
from .serializers import OrganizationActionsTypeSerializer
from .serializers import OrganizationStatusSerializer
from .serializers import PermissionSerializer
from .serializers import RoleSerializer
from .serializers import UserSerializer


'''
Test Credit Trade Comments and related permissions
'''
class Test_Api_Comments(TestCase):
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_organization_fuel_suppliers.json',
                'test_organization_balances.json',
                'test_credit_trade_comments.json',
                'roles.json',
                'permissions.json',
                'roles_permissions.json',
                ]

    def setUp(self):

        # Every test needs a client.

        self.fs_client_1 = Client(
            HTTP_SMGOV_USERGUID='6c239bc5-5f08-4ddd-855a-b3bf39096937',
            HTTP_SMAUTH_USERDISPLAYNAME='Test FS',
            HTTP_SMGOV_USEREMAIL='test_fs@test.com',
            HTTP_SM_UNIVERSALID='fs1')

        self.fs_client_2 = Client(
            HTTP_SMGOV_USERGUID='1dfbe008-d321-4a1f-912d-ecca36730895',
            HTTP_SMAUTH_USERDISPLAYNAME='Test FS2',
            HTTP_SMGOV_USEREMAIL='test_fs2@test.com',
            HTTP_SM_UNIVERSALID='fs12')

        self.gov_client = Client(
            HTTP_SMGOV_USERGUID='935bebdb-de2a-4839-a4da-d87635cffbb3',
            HTTP_SMAUTH_USERDISPLAYNAME='Gov',
            HTTP_SMGOV_USEREMAIL='gov_privileged@test.com',
            HTTP_SM_UNIVERSALID='gov',
            HTTP_SMGOV_USERTYPE='Internal',
            HTTP_SM_AUTHDIRNAME='IDIR')

        django.setup()

    def test_comments_list_returns_404(self):
        listUrl = "/api/comments/"
        response = self.fs_client_1.get(listUrl)
        # Check that the response is 404.
        assert status.HTTP_404_NOT_FOUND == response.status_code

    def test_get_unprivileged_as_owner(self):
        cUrl = "/api/comments/1"
        response = self.fs_client_1.get(cUrl)
        logging.debug(response.content.decode("utf-8"))
        assert status.HTTP_200_OK == response.status_code

    def test_get_privileged_as_owner(self):
        cUrl = "/api/comments/2"
        response = self.fs_client_1.get(cUrl)
        logging.debug(response.content.decode("utf-8"))
        assert status.HTTP_200_OK == response.status_code

    def test_get_unprivileged_as_gov(self):
        cUrl = "/api/comments/1"
        response = self.gov_client.get(cUrl)
        logging.debug(response.content.decode("utf-8"))
        assert status.HTTP_200_OK == response.status_code

    def test_get_privileged_as_gov(self):
        cUrl = "/api/comments/2"
        response = self.gov_client.get(cUrl)
        logging.debug(response.content.decode("utf-8"))
        assert status.HTTP_200_OK == response.status_code

    def test_get_unprivileged_as_other(self):
        cUrl = "/api/comments/3"
        response = self.fs_client_1.get(cUrl)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_as_other_fs(self):
        cUrl = "/api/comments/1"
        response = self.fs_client_2.get(cUrl)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_privileged_as_other(self):
        cUrl = "/api/comments/4"
        response = self.fs_client_1.get(cUrl)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_credit_trade_as_fs(self):
        cUrl = "/api/credit_trades/200"
        response = self.fs_client_1.get(cUrl)
        assert status.HTTP_200_OK == response.status_code

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        comments = data['comments']

        for c in comments:
            assert c['privilegedAccess'] is False

    def test_get_credit_trade_as_gov(self):
        cUrl = "/api/credit_trades/200"
        response = self.gov_client.get(cUrl)
        logging.debug(response)
        assert status.HTTP_200_OK == response.status_code

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        comments = data['comments']
        priv_count = 0

        #check that atleast one is a privileged comment
        for c in comments:
            if c['privilegedAccess']:
                priv_count += 1

        assert priv_count > 0

    def test_post_as_gov(self):
        cUrl = "/api/credit_trades/200"
        response = self.gov_client.get(cUrl)
        logging.debug(response)
        assert status.HTTP_200_OK == response.status_code

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)

        #figure out how many comments there are
        orig_len = len(data['comments'])

        cUrl = "/api/comments"
        test_data = {
            "comment": "generated comment 1",
            "creditTrade": 200,
            "privilegedAccess": False
        }
        response = self.gov_client.post(cUrl, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_201_CREATED == response.status_code
        test_data = {
            "comment": "generated comment 2",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.gov_client.post(cUrl, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_201_CREATED == response.status_code

        cUrl = "/api/credit_trades/200"
        response = self.gov_client.get(cUrl)
        logging.debug(response)
        assert status.HTTP_200_OK == response.status_code

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)

        #expect two more
        assert len(data['comments']) == orig_len+2

    def test_invalid_post_as_gov(self):
        cUrl = "/api/comments"
        test_data = {
            "comment": "badref comment",
            "creditTrade": 200000, #nonexisten
            "privilegedAccess": False
        }
        response = self.gov_client.post(cUrl, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_400_BAD_REQUEST == response.status_code

        test_data = {
            "comment": "noref comment",
            "privilegedAccess": False
        }
        response = self.gov_client.post(cUrl, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_400_BAD_REQUEST == response.status_code

        test_data = {
            "comment": "nullref comment",
            "creditTrade": None,
            "privilegedAccess": False
        }
        response = self.gov_client.post(cUrl, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_400_BAD_REQUEST == response.status_code

    def test_put_as_gov(self):
        cUrl = "/api/comments/1"
        test_data = {
            "comment": "updated comment 1",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.gov_client.put(cUrl, content_type='application/json',
                                       data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_200_OK == response.status_code

if __name__ == '__main__':
    unittest.main()
