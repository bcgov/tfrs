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
from enum import Enum


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