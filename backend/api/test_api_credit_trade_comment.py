# -*- coding: utf-8 -*-
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
from rest_framework import status
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
                'roles_permissions_v0.3.0.json'
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
        list_url = "/api/comments/"
        response = self.fs_client_1.get(list_url)
        # Check that the response is 404.
        assert status.HTTP_404_NOT_FOUND == response.status_code

    def test_get_unprivileged_as_owner(self):
        c_url = "/api/comments/1"
        response = self.fs_client_1.get(c_url)
        logging.debug(response.content.decode("utf-8"))
        assert status.is_success(response.status_code)

    def test_get_privileged_as_owner(self):
        c_url = "/api/comments/2"
        response = self.fs_client_1.get(c_url)
        logging.debug(response.content.decode("utf-8"))
        assert status.is_success(response.status_code)

    def test_get_unprivileged_as_gov(self):
        c_url = "/api/comments/1"
        response = self.gov_client.get(c_url)
        logging.debug(response.content.decode("utf-8"))
        assert status.is_success(response.status_code)

    def test_get_privileged_as_gov(self):
        c_url = "/api/comments/2"
        response = self.gov_client.get(c_url)
        logging.debug(response.content.decode("utf-8"))
        assert status.is_success(response.status_code)

    def test_get_unprivileged_as_other(self):
        c_url = "/api/comments/3"
        response = self.fs_client_1.get(c_url)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_as_other_fs(self):
        c_url = "/api/comments/1"
        response = self.fs_client_2.get(c_url)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_privileged_as_other(self):
        c_url = "/api/comments/4"
        response = self.fs_client_1.get(c_url)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_get_credit_trade_as_fs(self):
        c_url = "/api/credit_trades/200"
        response = self.fs_client_1.get(c_url)
        assert status.is_success(response.status_code)

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        comments = data['comments']

        for c in comments:
            assert c['privilegedAccess'] is False

    def test_get_credit_trade_as_gov(self):
        c_url = "/api/credit_trades/200"
        response = self.gov_client.get(c_url)
        logging.debug(response)
        assert status.is_success(response.status_code)

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
        c_url = "/api/credit_trades/200"
        response = self.gov_client.get(c_url)
        logging.debug(response)
        assert status.is_success(response.status_code)

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)

        # figure out how many comments there are
        orig_len = len(data['comments'])

        c_url = "/api/comments"
        test_data = {
            "comment": "generated comment 1",
            "creditTrade": 200,
            "privilegedAccess": False
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)
        test_data = {
            "comment": "generated comment 2",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

        c_url = "/api/credit_trades/200"
        response = self.gov_client.get(c_url)
        logging.debug(response)
        assert status.is_success(response.status_code)

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)

        # expect two more
        assert len(data['comments']) == orig_len+2

    def test_invalid_post_as_gov(self):
        c_url = "/api/comments"
        test_data = {
            "comment": "badref comment",
            "creditTrade": 200000, #nonexistent
            "privilegedAccess": False
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "noref comment",
            "privilegedAccess": False
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "nullref comment",
            "creditTrade": None,
            "privilegedAccess": False
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_client_error(response.status_code)

    def test_put_as_gov(self):
        valid_strings = [None, "", "updated comment", u"update with emojis \U0001F525\U0001F525",
                         "update with escape\r\n chars and \"quotes\"", u"zero-width\u200Bspace",
                         u"Chinese characters \u4E2D\u56FD", "RLM \u200F and LRM \u200E!"]

        for test_string in valid_strings:
            c_url = "/api/comments/1"
            test_data = {
                "comment": test_string,
                "creditTrade": 200,
                "privilegedAccess": True
            }
            response = self.gov_client.put(c_url, content_type='application/json',
                                           data=json.dumps(test_data))
            logging.debug(response)
            assert status.is_success(response.status_code)

            response = self.gov_client.get(c_url)
            logging.debug(u"validating that response comment is expected: '{}'".format(test_string))
            logging.debug(response.content.decode("utf-8"))
            assert status.is_success(response.status_code)
            assert json.loads(response.content.decode("utf-8"))['comment'] == test_string

    def test_put_as_gov_clobber_ro(self):
        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment with clobbered ro values",
            "id": 90,
            "creditTrade": None,
            "privilegedAccess": True
        }
        response = self.gov_client.put(c_url, content_type='application/json',
                                       data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

        response = self.gov_client.get(c_url)
        logging.debug(response.content.decode("utf-8"))
        assert status.is_success(response.status_code)
        assert json.loads(response.content.decode("utf-8"))['comment'] == \
            "updated comment with clobbered ro values"
        assert json.loads(response.content.decode("utf-8"))['id'] == 1
        assert json.loads(response.content.decode("utf-8"))['creditTrade'] == 200

    def test_put_as_fs_valid(self):
        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment 1",
            "creditTrade": 200,
            "privilegedAccess": False
        }
        response = self.fs_client_1.put(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

    def test_put_as_fs_invalid_trade(self):
        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment 1",
            "creditTrade": 201,
            "privilegedAccess": False
        }
        response = self.fs_client_1.put(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

    def test_put_as_fs_invalid(self):
        # User 400 doesn't own this comment
        c_url = "/api/comments/3"
        test_data = {
            "comment": "updated comment 3",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.fs_client_1.put(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_post_as_fs_valid(self):
        c_url = "/api/comments"
        test_data = {
            "comment": "generated comment",
            "creditTrade": 200,
            "privilegedAccess": False
        }
        response = self.gov_client.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

    def test_post_as_fs_invalid_privileged(self):
        # This user doesn't have permission to create a privileged comment
        c_url = "/api/comments"
        test_data = {
            "comment": "generated comment",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.fs_client_1.post(c_url, content_type='application/json',
                                        data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_403_FORBIDDEN == response.status_code

    def test_post_as_fs_invalid_wrong_org(self):
        # This user is not a party to credit_trade 200
        c_url = "/api/comments"
        test_data = {
            "comment": "generated comment",
            "creditTrade": 200,
            "privilegedAccess": False
        }
        response = self.fs_client_2.post(c_url, content_type='application/json',
                                         data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_403_FORBIDDEN == response.status_code

