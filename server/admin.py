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

from .models.Audit import Audit
from .models.Contact import Contact
from .models.CreditTrade import CreditTrade
from .models.CreditTradeLogEntry import CreditTradeLogEntry

from .models.FuelSupplier import FuelSupplier
from .models.Group import Group
from .models.GroupMembership import GroupMembership


from .models.History import History

from .models.LookupList import LookupList
from .models.Note import Note
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent

from .models.Offer import Offer
from .models.Permission import Permission

from .models.Role import Role
from .models.RolePermission import RolePermission


from .models.User import User

from .models.UserFavourite import UserFavourite

from .models.UserRole import UserRole





admin.site.register(Attachment)
admin.site.register(Audit)
admin.site.register(Contact)
admin.site.register(CreditTrade)
admin.site.register(CreditTradeLogEntry)
admin.site.register(FuelSupplier)
admin.site.register(Group)
admin.site.register(GroupMembership)
admin.site.register(History)
admin.site.register(LookupList)
admin.site.register(Note)
admin.site.register(Notification)
admin.site.register(NotificationEvent)
admin.site.register(Offer)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(RolePermission)
admin.site.register(User)
admin.site.register(UserFavourite)
admin.site.register(UserRole)