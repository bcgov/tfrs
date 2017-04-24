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

from django.contrib import admin
from .models.Attachment import Attachment
from .models.AttachmentViewModel import AttachmentViewModel
from .models.Audit import Audit
from .models.CompliancePeriod import CompliancePeriod
from .models.Contact import Contact
from .models.CreditTrade import CreditTrade
from .models.CreditTradeLogEntry import CreditTradeLogEntry
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.Group import Group
from .models.GroupMembership import GroupMembership
from .models.GroupMembershipViewModel import GroupMembershipViewModel
from .models.GroupViewModel import GroupViewModel
from .models.History import History
from .models.HistoryViewModel import HistoryViewModel
from .models.LookupList import LookupList
from .models.Note import Note
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationViewModel import NotificationViewModel
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserFavourite import UserFavourite
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel



admin.site.register(Attachment)
admin.site.register(AttachmentViewModel)
admin.site.register(Audit)
admin.site.register(CompliancePeriod)
admin.site.register(Contact)
admin.site.register(CreditTrade)
admin.site.register(CreditTradeLogEntry)
admin.site.register(CurrentUserViewModel)
admin.site.register(FuelSupplier)
admin.site.register(Group)
admin.site.register(GroupMembership)
admin.site.register(GroupMembershipViewModel)
admin.site.register(GroupViewModel)
admin.site.register(History)
admin.site.register(HistoryViewModel)
admin.site.register(LookupList)
admin.site.register(Note)
admin.site.register(Notification)
admin.site.register(NotificationEvent)
admin.site.register(NotificationViewModel)
admin.site.register(Permission)
admin.site.register(PermissionViewModel)
admin.site.register(Role)
admin.site.register(RolePermission)
admin.site.register(RolePermissionViewModel)
admin.site.register(RoleViewModel)
admin.site.register(User)
admin.site.register(UserDetailsViewModel)
admin.site.register(UserFavourite)
admin.site.register(UserFavouriteViewModel)
admin.site.register(UserRole)
admin.site.register(UserRoleViewModel)
admin.site.register(UserViewModel)