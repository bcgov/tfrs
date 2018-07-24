# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting
    for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel
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
import logging

from collections import defaultdict, namedtuple
from itertools import product

from rest_framework import status

from api.models.Organization import Organization
from api.tests.mixins.credit_trade_relationship import CreditTradeRelationshipMixin, CreditTradeFlowHooksMixin
from .data_creation_utilities import DataCreationUtilities
from .base_test_case import BaseTestCase


class TestAPIComments(BaseTestCase, CreditTradeRelationshipMixin, CreditTradeFlowHooksMixin):
    """
    Test Credit Trade Comments actions and permissions
    """

    extra_fixtures = [
        'test_credit_trade_comments.json'
    ]

    extra_usernames = ['fs_air_liquide', 'fs_shell', 'fs_husky']

    tested_users = ['gov_analyst', 'gov_director'] + extra_usernames

    def test_comments_list_returns_client_error(self):
        """Test that listing comments is not a valid action"""
        list_url = "/api/comments"
        response = self.clients['fs_air_liquide'].get(list_url)
        # Check that the response is 404.
        assert status.is_client_error(response.status_code)

    def test_comment_get_permissions(self):
        """Test that Credit Trade Comment GET permissions function correctly in all cases"""

        # From the test fixtures
        all_comments = [1, 2, 3, 4, 5]
        all_users = self.tested_users

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response is no access"})

        # Expected successes
        expected_results[((1, 'fs_air_liquide'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by owner"
        }
        expected_results[((2, 'fs_air_liquide'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by owner"
        }
        expected_results[((5, 'fs_shell'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by owner"
        }
        expected_results[((1, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government analyst"
        }
        expected_results[((2, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government analyst"
        }
        expected_results[((3, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government analyst"
        }
        expected_results[((4, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government analyst"
        }
        expected_results[((5, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government analyst"
        }
        expected_results[((1, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government director"
        }
        expected_results[((2, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government director"
        }
        expected_results[((3, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government director"
        }
        expected_results[((4, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government director"
        }
        expected_results[((5, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'reason': "Access by government director"
        }

        for (user, comment) in product(all_users, all_comments):
            expected_status = expected_results[((comment, user))]['status']
            reason = expected_results[((comment, user))]['reason']

            with self.subTest(user=user,
                              comment_id=comment,
                              expected_status=expected_status,
                              reason=reason):
                c_url = "/api/comments/{}".format(comment)
                response = self.clients[user].get(c_url)
                self.assertEqual(response.status_code, expected_status)

    def test_comment_filtering(self):
        """Test that comments are filtered correctly for credit trade GET requests"""

        # From the test fixtures
        all_credit_trades = [200]
        all_users = self.tested_users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_404_NOT_FOUND,
            'response_contains_no_privileged_comments': True,
            'reason': "Default response is no access (and don't even confirm it exists)"
        })

        expected_results[((200, 'fs_husky'))] = {
            'status': status.HTTP_200_OK,
            'response_contains_no_privileged_comments': True,
            'reason': "Access by initiator"
        }
        expected_results[((200, 'fs_air_liquide'))] = {
            'status': status.HTTP_200_OK,
            'response_contains_no_privileged_comments': True,
            'reason': "Access by respondent"
        }
        expected_results[((200, 'gov_director'))] = {
            'status': status.HTTP_200_OK,
            'response_contains_no_privileged_comments': False,
            'reason': "Access by government analyst"
        }
        expected_results[((200, 'gov_analyst'))] = {
            'status': status.HTTP_200_OK,
            'response_contains_no_privileged_comments': False,
            'reason': "Access by government director"
        }

        for (user, trade) in product(all_users, all_credit_trades):
            expected_status = expected_results[((trade, user))]['status']
            expect_only_unprivileged = expected_results[((trade, user))][
                'response_contains_no_privileged_comments']
            reason = expected_results[((trade, user))]['reason']

            with self.subTest(user=user, trade_id=trade, expected_status=expected_status,
                              expect_filtered=expect_only_unprivileged,
                              reason=reason):
                response = self.clients[user].get("/api/credit_trades/{}".format(trade))
                self.assertEqual(response.status_code, expected_status)

                if status.is_success(response.status_code):
                    json_string = response.content.decode("utf-8")
                    data = json.loads(json_string)
                    comments = data['comments']

                    for comment in comments:
                        if expect_only_unprivileged:
                            assert comment['privilegedAccess'] is False

    def test_comment_post_permissions(self):
        """Test that Credit Trade Comment POST permissions function correctly"""

        initiating_organization = Organization.objects.get_by_natural_key("Husky Oil Ltd.")
        responding_organization = Organization.objects.get_by_natural_key("Shell Canada Products")

        created_trades = DataCreationUtilities.create_possible_credit_trades(
            initiating_organization,
            responding_organization
        )

        # From the test fixtures
        all_users = self.tested_users

        # Test that all activities not explicitly allowed are prevented
        expected_results = defaultdict(lambda: {
            'actions': [],
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response is no access"
        })

        # These are the exceptions
        # Key is (status, rescinded_flag, username, creating_privileged_comment)
        expected_results[('Draft', False, 'fs_husky', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Initiator can comment in Draft'
            }
        expected_results[('Submitted', True, 'fs_husky', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Initiator can comment in Submitted (Signed 1/2) if rescinded'
            }
        expected_results[('Accepted', True, 'fs_husky', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Initiator can comment in Accepted (Signed 2/2) if rescinded'
            }
        expected_results[('Recommended', True, 'fs_husky', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Initiator can comment in Recommended if rescinded'
            }
        expected_results[('Not Recommended', True, 'fs_husky', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Initiator can comment in Not Recommended if rescinded'
            }
        expected_results[('Submitted', False, 'fs_shell', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Respondent can comment in Submitted (Signed 1/2)'
            }
        expected_results[('Accepted', True, 'fs_shell', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Respondent can comment in Submitted (Signed 2/2) if rescinded'
            }
        expected_results[('Recommended', True, 'fs_shell', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Respondent can comment in Recommended if rescinded'
            }
        expected_results[('Not Recommended', True, 'fs_shell', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Respondent can comment in Not Recommended if rescinded'
            }
        expected_results[('Accepted', False, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Accepted (Signed 2/2)'
            }
        expected_results[('Accepted', False, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Accepted (Signed2/2)'
            }
        expected_results[('Accepted', True, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Accepted (Signed 2/2)'
            }
        expected_results[('Accepted', True, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Accepted (Signed 2/2)'
            }
        expected_results[('Recommended', False, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Recommended'
            }
        expected_results[('Recommended', False, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Recommended'
            }
        expected_results[('Not Recommended', False, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Not Recommended'
            }
        expected_results[('Not Recommended', False, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Not Recommended'
            }
        expected_results[('Recommended', True, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Recommended'
            }
        expected_results[('Recommended', True, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Recommended'
            }
        expected_results[('Not Recommended', True, 'gov_analyst', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Not Recommended'
            }
        expected_results[('Not Recommended', True, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Analyst can comment in Not Recommended'
            }
        expected_results[('Approved', False, 'gov_analyst', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }
        expected_results[('Recommended', False, 'gov_director', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Recommended'
            }
        expected_results[('Recommended', False, 'gov_director', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Recommended'
            }
        expected_results[('Not Recommended', False, 'gov_director', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }
        expected_results[('Not Recommended', False, 'gov_director', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }
        expected_results[('Recommended', True, 'gov_director', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Recommended'
            }
        expected_results[('Recommended', True, 'gov_director', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Recommended'
            }
        expected_results[('Not Recommended', True, 'gov_director', False)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }
        expected_results[('Not Recommended', True, 'gov_director', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }
        expected_results[('Approved', False, 'gov_director', True)] = \
            {
                'status': status.HTTP_201_CREATED,
                'reason': 'Director can comment in Not Recommended'
            }

        for (trade, user, privileged) in product(created_trades, all_users, [True, False]):
            expected_result = expected_results[
                (
                    trade['status'],
                    trade['rescinded'],
                    user,
                    privileged
                )
            ]
            with self.subTest("Test posting comment",
                              credit_trade_id=trade['id'],
                              credit_trade_status=trade['status'],
                              credit_trade_is_rescinded=trade['rescinded'],
                              as_user=user,
                              user_in_initiator_org=True if user == 'fs_husky' else False,
                              user_in_respondent_org=True if user == 'fs_shell' else False,
                              creating_privileged_comment=privileged,
                              expected_result=expected_result['status'],
                              reason=expected_result['reason']):
                # check permissions on POST
                response = self.clients[user].post(
                    "/api/comments", content_type='application/json',
                    data=json.dumps({
                        "comment": "generated comment",
                        "creditTrade": trade['id'],
                        "privilegedAccess": privileged
                    }))
                self.assertEqual(response.status_code, expected_result['status'])

    def test_invalid_post(self):
        """Test Credit Trade Comment POSTs that are invalid in several ways"""

        c_url = "/api/comments"
        test_data = {
            "comment": "badref comment",
            "creditTrade": 200000,  # nonexistent
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "noref comment",
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_client_error(response.status_code)

        test_data = {
            "comment": "nullref comment",
            "creditTrade": None,
            "privilegedAccess": False
        }
        response = self.clients['gov_director'].post(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_client_error(response.status_code)

    def test_put_as_gov(self):
        """Test Credit Trade Comment PUT with multiple valid strings"""

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
            response = self.clients['gov_director'].put(
                c_url,
                content_type='application/json',
                data=json.dumps(test_data)
            )
            assert status.is_success(response.status_code)

            response = self.clients['gov_director'].get(c_url)

            assert status.is_success(response.status_code)
            assert json.loads(response.content.decode("utf-8"))['comment'] == test_string

    def test_put_as_gov_clobber_ro(self):
        """
        Test that read-only or write-once fields cannot be written
        in Credit Trade Comment PUT requests
        """

        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment with clobbered ro values",
            "id": 90,
            "creditTrade": None,
            "privilegedAccess": True
        }
        response = self.clients['gov_director'].put(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_success(response.status_code)

        response = self.clients['gov_director'].get(c_url)
        assert status.is_success(response.status_code)
        self.assertEqual(
            json.loads(response.content.decode("utf-8"))['comment'],
            "updated comment with clobbered ro values"
        )
        self.assertEqual(
            json.loads(response.content.decode("utf-8"))['id'],
            1
        )
        self.assertEqual(
            json.loads(response.content.decode("utf-8"))['creditTrade'],
            200
        )

    def test_put_as_fs_valid(self):
        """Test a valid Credit Trade Comment PUT by a Fuel supplier"""

        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment 1",
            "creditTrade": status.HTTP_200_OK,
            "privilegedAccess": False
        }
        response = self.clients['fs_air_liquide'].put(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_success(response.status_code)

    def test_put_as_fs_invalid_trade(self):
        """Test an invalid Credit Trade Comment PUT by a Fuel supplier (not party to the trade)"""

        c_url = "/api/comments/1"
        test_data = {
            "comment": "updated comment 1",
            "creditTrade": 201,
            "privilegedAccess": False
        }
        response = self.clients['fs_air_liquide'].put(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data)
        )
        assert status.is_success(response.status_code)

    def test_put_as_fs_invalid(self):
        """
        Test a Credit Trade Comment PUT by a Fuel supplier for a comment belonging to another user
        """

        # User  doesn't own this comment
        c_url = "/api/comments/3"
        test_data = {
            "comment": "updated comment 3",
            "creditTrade": 200,
            "privilegedAccess": True
        }
        response = self.clients['fs_air_liquide'].put(
            c_url,
            content_type='application/json',
            data=json.dumps(test_data))
        assert status.is_client_error(response.status_code)

    def test_individual_comment_actions(self):
        """ Test that users can edit comments on a credit trade before the status changes
        but not after.
        """

        ToCheck = namedtuple('ToCheck',
                             ['status', 'rescinded', 'relationship', 'create_privileged'])
        CreatedComment = namedtuple('CreatedComment', ['id', 'creating_user_relationship'])

        to_check = [
            ToCheck('Draft', False, self.UserRelationship.INITIATOR, False),
            ToCheck('Submitted', False, self.UserRelationship.RESPONDENT, False),
            ToCheck('Accepted', False, self.UserRelationship.GOVERNMENT_ANALYST, False),
            ToCheck('Accepted', False, self.UserRelationship.GOVERNMENT_ANALYST, True),
            ToCheck('Recommended', False, self.UserRelationship.GOVERNMENT_DIRECTOR, False),
            ToCheck('Not Recommended', False, self.UserRelationship.GOVERNMENT_DIRECTOR, False),
            ToCheck('Recommended', False, self.UserRelationship.GOVERNMENT_DIRECTOR, True),
            ToCheck('Not Recommended', False, self.UserRelationship.GOVERNMENT_DIRECTOR, True),
        ]

        comments_to_check = []

        def check_before(cr: self.PreChangeRecord):
            comments_to_check.clear()

            if cr.trade_id:

                # Create comments
                for comment_action in to_check:
                    if comment_action.status == cr.current_status and comment_action.rescinded == cr.rescinded:
                        logging.debug('posting comment to {} as {}'.format(
                            cr.trade_id, comment_action.relationship))

                        response = self.clients[self.user_map[comment_action.relationship]].post(
                            "/api/comments",
                            content_type='application/json',
                            data=json.dumps(
                                {
                                    "comment": "original comment",
                                    "creditTrade": cr.trade_id,
                                    "privilegedAccess": comment_action.create_privileged
                                }
                            )
                        )

                        response_data = json.loads(response.content.decode('utf-8'))

                        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

                        comments_to_check.append(CreatedComment(response_data['id'],
                                                                comment_action.relationship))

                # Assert that for each comment we created, the creator can edit the comment
                # until the status changes
                for comment in comments_to_check:
                    with self.subTest("Validating that comment can be edited by the creator"
                                      " until the trade status changes",
                                      comment_id=comment.id,
                                      creating_user_relationship=comment.creating_user_relationship):

                        logging.debug('verifying comment {} as {}'.format(
                            cr.trade_id, comment.creating_user_relationship))

                        response = self.clients[self.user_map[comment.creating_user_relationship]].get(
                            '/api/comments/{}'.format(comment.id)
                        )
                        self.assertTrue(status.is_success(response.status_code))
                        response_data = json.loads(response.content.decode('utf-8'))

                        self.assertIn('EDIT_COMMENT', response_data['actions'])

        def check_after(cr: self.ChangeRecord):
            self.assertTrue(status.is_success(cr.response_code))

            # Assert that for each comment we created, the creator can edit the comment
            # until the status changes
            for comment in comments_to_check:
                with self.subTest("Validating that comment cannot be edited after the trade status changes",
                                  comment_id=comment.id,
                                  creating_user_relationship=comment.creating_user_relationship):

                    logging.debug('verifying comment {} as {}'.format(
                        cr.trade_id, comment.creating_user_relationship))

                    response = self.clients[self.user_map[comment.creating_user_relationship]].get(
                        '/api/comments/{}'.format(comment.id)
                    )
                    self.assertTrue(status.is_success(response.status_code))
                    response_data = json.loads(response.content.decode('utf-8'))

                    self.assertNotIn('EDIT_COMMENT', response_data['actions'])

        CreditTradeFlowHooksMixin.check_credit_trade_workflow(
            self,
            before_change_callback=check_before,
            after_change_callback=check_after        )

