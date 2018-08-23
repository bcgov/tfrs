# coding: utf-8
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
from db_comments.patch_fields import patch_fields

from . import User
from . import CreditTradeComment
from . import OrganizationAddress

patch_fields()

from . import NotificationSubscription

# from __future__ import absolute_import

# import models into model package
# try:
#     from . import CreditTrade
# except:
#     import CreditTrade
# try:
#     from . import CreditTradeHistory
# except:
#     import CreditTradeHistory
# try:
#     from . import CreditTradeStatus
# except:
#     import CreditTradeStatus
# try:
#     from . import CreditTradeType
# except:
#     import CreditTradeType
# try:
#     from . import CreditTradeZeroReason
# except:
#     import CreditTradeZeroReason
# try:
#     from . import CurrentUserViewModel
# except:
#     import CurrentUserViewModel
# try:
#     from . import Organization
# except:
#     import Organization
# try:
#     from . import OrganizationActionsType
# except:
#     import OrganizationActionsType
# try:
#     from . import OrganizationAttachment
# except:
#     import OrganizationAttachment
#  try:
#     from . import OrganizationBalance
# except:
#     import OrganizationBalance
# try:
#     from . import OrganizationHistory
# except:
#     import OrganizationHistory
# try:
#     from . import OrganizationStatus
# except:
#     import OrganizationStatus
# try:
#     from . import Permission
# except:
#     import Permission
# try:
#     from . import Role
# except:
#     import Role
# try:
#     from . import RolePermission
# except:
#     import RolePermission
# try:
#     from . import User
# except:
#     import User
