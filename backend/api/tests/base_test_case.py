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
import logging
import sys
from unittest import mock

import jwt
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.test import TestCase

from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.Organization import Organization
from api.models.User import User
from api.tests.logging_client import LoggingClient

from tfrs import settings


class BaseTestCase(TestCase):
    """
    Base Test class that we can use to setup the initial data
    """

    fixtures = [
        'test/test_compliance_periods.json',
        'test/test_organization_fuel_suppliers.json',
        'test/test_organization_balances.json',
        'test/test_prodlike_government_users_and_roles.json',
        'test/test_users_and_organizations_v0.3.1.json',
        'test/test_users_multiple_roles.json'
    ]

    usernames = [
        'fs_user_1',
        'fs_user_2',
        'fs_user_3',
        'gov_director',
        'gov_analyst',
        'gov_manager',
        'gov_admin',
        'gov_multi_role'
    ]

    # For use in child classes
    extra_fixtures = None
    extra_usernames = None

    @classmethod
    def setUpClass(cls):
        """Load any extra fixtures that child classes have declared"""
        if cls.extra_fixtures is not None:
            cls.fixtures = cls.fixtures + cls.extra_fixtures
        super().setUpClass()

    def __init__(self, *args, **kwargs):
        """
        Add any extra usernames that child classes have declared to our
        list of clients
        """

        if self.extra_usernames is not None:
            self.usernames = self.usernames + self.extra_usernames

        super().__init__(*args, **kwargs)

    def tearDown(self):
        super().tearDown()
        self.patcher.stop()

    def setUp(self):
        """Configure test clients"""

        super().setUp()

        # Turn the documents API on
        settings.DOCUMENTS_API['ENABLED'] = True

        self.patcher = mock.patch('api.notifications.notifications.send_amqp_notification')
        self.patcher.start()

        # generate a new RSA key

        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )

        # override the jwt verification keys for testing

        settings.KEYCLOAK['ENABLED'] = True
        settings.KEYCLOAK['DOWNLOAD_CERTS'] = False
        settings.KEYCLOAK['ISSUER'] = 'tfrs-test'
        settings.KEYCLOAK['AUDIENCE'] = 'tfrs-app'
        settings.KEYCLOAK['RS256_KEY'] = private_key.public_key().public_bytes(
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
            encoding=serialization.Encoding.PEM
        ).decode('utf-8')

        # the private half, used to sign our jwt (keycloak does this in actual use)

        self.private_key = private_key.private_bytes(
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
            encoding=serialization.Encoding.PEM
        ).decode('utf-8')

        self.users = dict(map(
            lambda u: (u, User.objects.get_by_natural_key(u)),
            self.usernames
        ))

        self.clients = dict(
            map(lambda user: (
                user.username,
                LoggingClient(
                    HTTP_AUTHORIZATION='Bearer {}'.format(
                        jwt.encode(
                            payload={
                                'user_id': str(user.username),
                                'iss': 'tfrs-test',
                                'aud': 'tfrs-app'
                            },
                            key=self.private_key,
                            algorithm='RS256'
                        ).decode('utf-8')
                    )
                )), self.users.values()))

        from_organization = Organization.objects.get_by_natural_key(
            "Test Org 1")
        to_organization = Organization.objects.get_by_natural_key(
            "Test Org 2")

        self.credit_trade_types = {
            'buy': CreditTradeType.objects.get(the_type='Buy'),
            'sell': CreditTradeType.objects.get(the_type='Sell'),
            'part3award': CreditTradeType.objects.get(the_type='Part 3 Award')
        }

        self.organizations = {
            'from': from_organization,
            'to': to_organization
        }

        self.statuses = {
            'accepted': CreditTradeStatus.objects.get(status='Accepted'),
            'approved': CreditTradeStatus.objects.get(status='Approved'),
            'cancelled': CreditTradeStatus.objects.get(status='Cancelled'),
            'draft': CreditTradeStatus.objects.get(status='Draft'),
            'not_recommended':
                CreditTradeStatus.objects.get(status='Not Recommended'),
            'recommended': CreditTradeStatus.objects.get(status='Recommended'),
            'recorded': CreditTradeStatus.objects.get(status='Recorded'),
            'refused': CreditTradeStatus.objects.get(status='Refused'),
            'submitted': CreditTradeStatus.objects.get(status='Submitted')
        }

        self.zero_reason = {
            'other': CreditTradeZeroReason.objects.get(reason='Other'),
            'affiliate': CreditTradeZeroReason.objects.get(reason='Internal')
        }

        logging.getLogger('django.request').setLevel(logging.ERROR)
        logging.getLogger('api.tests').setLevel(logging.DEBUG)
        logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
