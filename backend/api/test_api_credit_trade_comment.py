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
from collections import defaultdict
from itertools import product
import django

from rest_framework import status

from .models.User import User
from .models.CreditTradeComment import CreditTradeComment
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.Organization import Organization
from .models.CreditTrade import CreditTrade

'''
Test Credit Trade Comments and related permissions
'''


class TestAPIComments(TestCase):
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_organization_fuel_suppliers.json',
                'test_organization_balances.json',
                'roles.json',
                'permissions.json',
                'roles_permissions.json',
                'roles_permissions_v0.3.0.json',
                'test_credit_trade_comments.json',
                ]

    users = ['fs_husky', 'fs_air_liquide', 'fs_shell', 'gov_director', 'gov_analyst']

    def setUp(self):
        self.clients = dict()

        for username in TestAPIComments.users:
            user = User.objects.get_by_natural_key(username)
            self.clients[username] = Client(
                HTTP_SMGOV_USERGUID=str(user.authorization_guid),
                HTTP_SMAUTH_USERDISPLAYNAME=str(user.display_name),
                HTTP_SMGOV_USEREMAIL=str(user.authorization_email),
                HTTP_SM_UNIVERSALID=str(user.authorization_id),
                HTTP_SM_AUTHDIRNAME=('IDIR' if user.organization.id == 1 else 'BCeID'),
                HTTP_SMGOV_USERTYPE=('Internal' if user.organization.id == 1 else '')
            )

        django.setup()

    def test_comments_list_returns_404(self):
        list_url = "/api/comments/"
        response = self.clients['fs_air_liquide'].get(list_url)
        # Check that the response is 404.
        assert status.HTTP_404_NOT_FOUND == response.status_code

    def test_comment_retrieval_permissions(self):

        # From the test fixtures
        all_comments = [1, 2, 3, 4, 5]
        all_users = self.users

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response is no access"})

        # Expected successes
        expected_results[(1, 'fs_air_liquide')] = {'status': status.HTTP_200_OK,
                                                   'reason': "Access by owner"}
        expected_results[(2, 'fs_air_liquide')] = {'status': status.HTTP_200_OK,
                                                   'reason': "Access by owner"}
        expected_results[(5, 'fs_shell')] = {'status': status.HTTP_200_OK,
                                             'reason': "Access by owner"}
        expected_results[(1, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                'reason': "Access by government analyst"}
        expected_results[(2, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                'reason': "Access by government analyst"}
        expected_results[(3, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                'reason': "Access by government analyst"}
        expected_results[(4, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                'reason': "Access by government analyst"}
        expected_results[(5, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                'reason': "Access by government analyst"}
        expected_results[(1, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                 'reason': "Access by government director"}
        expected_results[(2, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                 'reason': "Access by government director"}
        expected_results[(3, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                 'reason': "Access by government director"}
        expected_results[(4, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                 'reason': "Access by government director"}
        expected_results[(5, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                 'reason': "Access by government director"}

        for (user, comment) in product(all_users, all_comments):
            expected_status = expected_results[(comment, user)]['status']
            reason = expected_results[(comment, user)]['reason']

            with self.subTest(user=user, comment_id=comment, expected_status=expected_status, reason=reason):
                c_url = "/api/comments/{}".format(comment)
                response = self.clients[user].get(c_url)
                logging.debug(response.content.decode("utf-8"))
                self.assertEqual(response.status_code, expected_status)

    def test_credit_trade_retrieval_filtering(self):

        # From the test fixtures
        all_credit_trades = [200]
        all_users = self.users

        expected_results = defaultdict(lambda: {'status': status.HTTP_404_NOT_FOUND,
                                                'response_contains_no_privileged_comments': True,
                                                'reason': "Default response is no access "
                                                          "(and don't even confirm it exists)"})

        expected_results[(200, 'fs_husky')] = {'status': status.HTTP_200_OK,
                                                     'response_contains_no_privileged_comments': True,
                                                     'reason': "Access by initiator"}
        expected_results[(200, 'fs_air_liquide')] = {'status': status.HTTP_200_OK,
                                                     'response_contains_no_privileged_comments': True,
                                                     'reason': "Access by respondent"}
        expected_results[(200, 'gov_director')] = {'status': status.HTTP_200_OK,
                                                     'response_contains_no_privileged_comments': False,
                                                     'reason': "Access by government analyst"}
        expected_results[(200, 'gov_analyst')] = {'status': status.HTTP_200_OK,
                                                     'response_contains_no_privileged_comments': False,
                                                     'reason': "Access by government director"}

        for (user, trade) in product(all_users, all_credit_trades):
            expected_status = expected_results[(trade, user)]['status']
            expect_response_contains_no_privileged_comments =  expected_results[(trade, user)]['response_contains_no_privileged_comments']
            reason = expected_results[(trade, user)]['reason']

            with self.subTest(user=user, trade_id=trade, expected_status=expected_status, expect_response_contains_no_privileged_comments=expect_response_contains_no_privileged_comments, reason=reason):
                c_url = "/api/credit_trades/{}".format(trade)
                response = self.clients[user].get(c_url)
                logging.debug(response.content.decode("utf-8"))
                self.assertEqual(response.status_code, expected_status)

                if status.is_success(response.status_code):
                    json_string = response.content.decode("utf-8")
                    data = json.loads(json_string)
                    comments = data['comments']

                    for c in comments:
                        if expect_response_contains_no_privileged_comments:
                            assert c['privilegedAccess'] is False

    def test_comment_posting_permissions(self):
        # From the test fixtures
        all_users = self.users

        all_statuses = [s.status for s in CreditTradeStatus.objects.all()]

        initiating_organization = Organization.objects.get_by_natural_key("Husky Oil Ltd.")
        responding_organization = Organization.objects.get_by_natural_key("Shell Canada Products")

        created_trades = []

        # Create test data for this test -- one trade with each possible status
        for (ct_status, rescinded) in product(all_statuses, [True, False]):
            trade = CreditTrade()
            trade.initiator = initiating_organization
            trade.respondent = responding_organization
            trade.type = CreditTradeType.objects.get_by_natural_key("Buy")
            trade.status = CreditTradeStatus.objects.get_by_natural_key(ct_status)
            trade.fair_market_value_per_credit = 20.0
            trade.number_of_credits = 500
            trade.rescinded = rescinded
            trade.save()
            trade.refresh_from_db()
            logging.debug("created credit trade {}".format(trade.id))
            created_trades.append({
                'status': ct_status,
                'rescinded': rescinded,
                'id': trade.id
            })

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response is no access"})

        # These are the exceptions
        # Key is (status, rescinded_flag, username, creating_privileged_comment)
        expected_results['Draft', False, 'fs_husky', False] = {'status': status.HTTP_201_CREATED,
                                                               'reason': 'Initiator can comment in Draft'}
        expected_results['Draft', True, 'fs_husky', False] = {'status': status.HTTP_201_CREATED,
                                                               'reason': 'Initiator can comment in Draft'}
        expected_results['Submitted', False, 'fs_shell', False] = {'status': status.HTTP_201_CREATED,
                                                                'reason': 'Respondent can comment in Submitted(Signed1/2)'}
        expected_results['Submitted', True, 'fs_shell', False] = {'status': status.HTTP_201_CREATED,
                                                                   'reason': 'Respondent can comment in Submitted(Signed1/2)'}
        expected_results['Accepted', False, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                  'reason': 'Analyst can comment in Accepted(Signed2/2)'}
        expected_results['Accepted', False, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                     'reason': 'Analyst can comment in Accepted(Signed2/2)'}
        expected_results['Accepted', True, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                     'reason': 'Analyst can comment in Accepted(Signed2/2)'}
        expected_results['Accepted', True, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                'reason': 'Analyst can comment in Accepted(Signed2/2)'}
        expected_results['Recommended', False, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                     'reason': 'Analyst can comment in Recommended'}
        expected_results['Recommended', False, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                        'reason': 'Analyst can comment in Recommended'}
        expected_results['Not Recommended', False, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                        'reason': 'Analyst can comment in Not Recommended'}
        expected_results['Not Recommended', False, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                   'reason': 'Analyst can comment in Not Recommended'}
        expected_results['Recommended', True, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                        'reason': 'Analyst can comment in Recommended'}
        expected_results['Recommended', True, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                       'reason': 'Analyst can comment in Recommended'}
        expected_results['Not Recommended', True, 'gov_analyst', False] = {'status': status.HTTP_201_CREATED,
                                                                            'reason': 'Analyst can comment in Not Recommended'}
        expected_results['Not Recommended', True, 'gov_analyst', True] = {'status': status.HTTP_201_CREATED,
                                                                           'reason': 'Analyst can comment in Not Recommended'}
        expected_results['Recommended', False, 'gov_director', False] = {'status': status.HTTP_201_CREATED,
                                                                        'reason': 'Director can comment in Recommended'}
        expected_results['Recommended', False, 'gov_director', True] = {'status': status.HTTP_201_CREATED,
                                                                       'reason': 'Director can comment in Recommended'}
        expected_results['Not Recommended', False, 'gov_director', False] = {'status': status.HTTP_201_CREATED,
                                                                            'reason': 'Director can comment in Not Recommended'}
        expected_results['Not Recommended', False, 'gov_director', True] = {'status': status.HTTP_201_CREATED,
                                                                           'reason': 'Director can comment in Not Recommended'}
        expected_results['Recommended', True, 'gov_director', False] = {'status': status.HTTP_201_CREATED,
                                                                       'reason': 'Director can comment in Recommended'}
        expected_results['Recommended', True, 'gov_director', True] = {'status': status.HTTP_201_CREATED,
                                                                      'reason': 'Director can comment in Recommended'}
        expected_results['Not Recommended', True, 'gov_director', False] = {'status': status.HTTP_201_CREATED,
                                                                           'reason': 'Director can comment in Not Recommended'}
        expected_results['Not Recommended', True, 'gov_director', True] = {'status': status.HTTP_201_CREATED,
                                                                          'reason': 'Director can comment in Not Recommended'}

        for (c, user, privileged) in product(created_trades, all_users, [True, False]):
            expected_result = expected_results[(c['status'], c['rescinded'], user, privileged)]

            with self.subTest("Test posting comment",
                              credit_trade_id=c['id'],
                              credit_trade_status=c['status'],
                              credit_trade_is_rescinded=c['rescinded'],
                              as_user=user,
                              user_in_initiator_org=True if user == 'fs_husky' else False,
                              user_in_respondent_org=True if user == 'fs_shell' else False,
                              creating_privilged_comment=privileged,
                              expected_result=expected_result['status'],
                              reason=expected_result['reason']):
                c_url = "/api/comments"
                test_data = {
                    "comment": "generated comment",
                    "creditTrade": c['id'],
                    "privilegedAccess": privileged
                }
                response = self.clients[user].post(c_url, content_type='application/json',
                                                   data=json.dumps(test_data))
                logging.debug(json.loads(response.content.decode('utf-8')))
                self.assertEquals(response.status_code,expected_result['status'])



    def test_invalid_post(self):
        c_url = "/api/comments"
        test_data = {
            "comment": "badref comment",
            "creditTrade": 200000,  # nonexistent
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(c_url, content_type='application/json',
                                                 data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "noref comment",
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(c_url, content_type='application/json',
                                                 data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "nullref comment",
            "creditTrade": None,
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(c_url, content_type='application/json',
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
                "creditTrade": status.HTTP_200_OK,
                "privilegedAccess": True
            }
            response = self.clients['gov_director'].put(c_url, content_type='application/json',
                                                    data=json.dumps(test_data))
            logging.debug(response)
            assert status.is_success(response.status_code)

            response = self.clients['gov_director'].get(c_url)
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
        response = self.clients['gov_director'].put(c_url, content_type='application/json',
                                                data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

        response = self.clients['gov_director'].get(c_url)
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
            "creditTrade": status.HTTP_200_OK,
            "privilegedAccess": False
        }
        response = self.clients['fs_air_liquide'].put(c_url, content_type='application/json',
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
        response = self.clients['fs_air_liquide'].put(c_url, content_type='application/json',
                                           data=json.dumps(test_data))
        logging.debug(response)
        assert status.is_success(response.status_code)

    def test_put_as_fs_invalid(self):
        # User 400 doesn't own this comment
        c_url = "/api/comments/3"
        test_data = {
            "comment": "updated comment 3",
            "creditTrade": status.HTTP_200_OK,
            "privilegedAccess": True
        }
        response = self.clients['fs_air_liquide'].put(c_url, content_type='application/json',
                                           data=json.dumps(test_data))
        logging.debug(response)
        assert status.HTTP_403_FORBIDDEN == response.status_code

