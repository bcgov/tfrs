# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name,duplicate-code
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
import json
import logging
import typing
from collections import namedtuple, defaultdict
from enum import Enum
from typing import Callable

import datetime

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.tests.data_creation_utilities import DataCreationUtilities


class CreditTradeRelationshipMixin(object):
    """Mixin to provide user mapping for related parties to credit transactions"""

    class UserRelationship(Enum):
        """Enumerates the ways in which a client (user) can be related to a credit trade"""
        INITIATOR = 1
        RESPONDENT = 2
        THIRD_PARTY = 3
        GOVERNMENT_ANALYST = 4
        GOVERNMENT_DIRECTOR = 5

    user_map = {
        UserRelationship.INITIATOR: 'fs_user_1',
        UserRelationship.RESPONDENT: 'fs_user_2',
        UserRelationship.THIRD_PARTY: 'fs_user_3',
        UserRelationship.GOVERNMENT_ANALYST: 'gov_analyst',
        UserRelationship.GOVERNMENT_DIRECTOR: 'gov_director'
    }


class CreditTradeFlowHooksMixin(object):
    ChangeRecord = namedtuple('ChangeRecord', [
        'trade_id',
        'requesting_username',
        'relationship',
        'expected_to_be_successful',
        'data_before_request',
        'data_after_request',
        'response_code'
    ])

    PreChangeRecord = namedtuple('PreChangeRecord', [
        'trade_id',
        'current_status',
        'rescinded'
    ])

    StatusChange = namedtuple('StatusChange', [
        'relationship',
        'status',
        'rescinded'
    ])

    def _sensible_status_changes(self, current_status, rescinded):
        """Return a list of valid potential status changes for a given starting state"""

        status_changes = defaultdict(lambda: [])

        status_changes[('Draft', False)] = [
            self.StatusChange(self.UserRelationship.INITIATOR, 'Submitted', False),
            self.StatusChange(self.UserRelationship.INITIATOR, 'Cancelled', False)
        ]
        status_changes[('Submitted', False)] = [
            self.StatusChange(self.UserRelationship.INITIATOR, 'Submitted', True),  # rescind
            self.StatusChange(self.UserRelationship.RESPONDENT, 'Accepted', False),
            self.StatusChange(self.UserRelationship.RESPONDENT, 'Refused', False)
        ]
        status_changes[('Accepted', False)] = [
            self.StatusChange(self.UserRelationship.INITIATOR, 'Accepted', True),  # rescind
            self.StatusChange(self.UserRelationship.RESPONDENT, 'Accepted', True),  # rescind
            self.StatusChange(self.UserRelationship.GOVERNMENT_ANALYST, 'Recommended', False),
            self.StatusChange(self.UserRelationship.GOVERNMENT_ANALYST, 'Not Recommended', False)
        ]
        status_changes[('Recommended', False)] = [
            self.StatusChange(self.UserRelationship.INITIATOR, 'Recommended', True),  # rescind
            self.StatusChange(self.UserRelationship.RESPONDENT, 'Recommended', True),  # rescind
            self.StatusChange(self.UserRelationship.GOVERNMENT_DIRECTOR, 'Approved', False),
            self.StatusChange(self.UserRelationship.GOVERNMENT_DIRECTOR, 'Declined', False)
        ]
        status_changes[('Not Recommended', False)] = [
            self.StatusChange(self.UserRelationship.INITIATOR, 'Not Recommended', True),  # rescind
            self.StatusChange(self.UserRelationship.RESPONDENT, 'Not Recommended', True),  # rescind
            self.StatusChange(self.UserRelationship.GOVERNMENT_DIRECTOR, 'Approved', False),
            self.StatusChange(self.UserRelationship.GOVERNMENT_DIRECTOR, 'Declined', False)
        ]

        return status_changes[(current_status, rescinded)]

    def _path_builder(self, node, path=[], valid_paths=[]):
        """Recursively build an array of valid paths through the status tree"""

        s = self._sensible_status_changes(node.status, node.rescinded)

        is_leaf = not s

        path = path + [node]

        if is_leaf:
            valid_paths.append(path)  # end of the line

        for branch in s:
            self._path_builder(branch, path, valid_paths)

        return valid_paths

    def check_credit_trade_workflow(self,
                                    before_change_callback: Callable[[PreChangeRecord], None]
                                    = lambda x: None,
                                    after_change_callback: Callable[[ChangeRecord], None]
                                    = lambda x: None,
                                    path_end_callback: Callable[[], None]
                                    = lambda: None):
        """Evaluate all normal status paths through the application via REST API as appropriate users

        with callbacks for tests:

        before_change_callback called just before a status change.
            Initial status and trade_id may be None

        after_change_callback called after a change
            data_before_request can be None if this was a creation

        path_end_callback called when this pathway is done
            (another will begin unless this was the last)
        """

        initiating_org = self.users[
            self.user_map[
                self.UserRelationship.INITIATOR
            ]].organization

        responding_org = self.users[
            self.user_map[
                self.UserRelationship.RESPONDENT
            ]].organization

        payload = {
            'fairMarketValuePerCredit': 1,
            'initiator': initiating_org.id,
            'numberOfCredits': 1,
            'respondent': responding_org.id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        valid_paths = (self._path_builder(
            self.StatusChange(self.UserRelationship.INITIATOR, 'Draft', False)
        ))

        for path in valid_paths:
            logging.debug('evaluating path: {}'.format(
                '\n'.join(
                    [
                        '{} sets status to {} and rescinded to {}'.format(
                            c.relationship, c.status, c.rescinded) for c in path
                    ]
                )))

            trade_id = None
            response_data = None

            for node in path:

                before_change_callback(self.PreChangeRecord(
                    trade_id,
                    CreditTrade.objects.filter(
                        id=trade_id
                    ).first().status.status if trade_id else None,
                    CreditTrade.objects.filter(
                        id=trade_id
                    ).first().is_rescinded if trade_id else None
                ))

                payload['status'] = CreditTradeStatus.objects.get_by_natural_key(node.status).id
                payload['is_rescinded'] = node.rescinded

                if not trade_id:
                    response = self.clients[self.user_map[node.relationship]].post(
                        '/api/credit_trades',
                        content_type='application/json',
                        data=json.dumps(payload)
                    )
                else:
                    response = self.clients[self.user_map[node.relationship]].put(
                        '/api/credit_trades/{}'.format(trade_id),
                        content_type='application/json',
                        data=json.dumps(payload)
                    )

                previous_response_data = response_data
                response_data = json.loads(response.content.decode('utf-8'))
                trade_id = response_data['id']

                after_change_callback(self.ChangeRecord(
                    trade_id,
                    self.user_map[node.relationship],
                    node.relationship,
                    True,
                    previous_response_data,
                    response_data,
                    response.status_code
                ))

            path_end_callback()
