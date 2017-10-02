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
from .models.Audit import Audit
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeZeroReason import CreditTradeZeroReason

from .models.FuelSupplier import FuelSupplier
from .models.FuelSupplierActionsType import FuelSupplierActionsType
from .models.FuelSupplierAttachment import FuelSupplierAttachment
from .models.FuelSupplierAttachmentTag import FuelSupplierAttachmentTag
from .models.FuelSupplierBalance import FuelSupplierBalance
from .models.FuelSupplierCCData import FuelSupplierCCData
from .models.FuelSupplierContact import FuelSupplierContact
from .models.FuelSupplierContactRole import FuelSupplierContactRole
from .models.FuelSupplierHistory import FuelSupplierHistory
from .models.FuelSupplierStatus import FuelSupplierStatus
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationType import NotificationType

from .models.Permission import Permission

from .models.Role import Role
from .models.RolePermission import RolePermission


from .models.User import User

from .models.UserFavourite import UserFavourite

from .models.UserRole import UserRole





admin.site.register(Audit)
admin.site.register(CreditTrade)
admin.site.register(CreditTradeHistory)
admin.site.register(CreditTradeStatus)
admin.site.register(CreditTradeType)
admin.site.register(CreditTradeZeroReason)
admin.site.register(FuelSupplier)
admin.site.register(FuelSupplierActionsType)
admin.site.register(FuelSupplierAttachment)
admin.site.register(FuelSupplierAttachmentTag)
admin.site.register(FuelSupplierBalance)
admin.site.register(FuelSupplierCCData)
admin.site.register(FuelSupplierContact)
admin.site.register(FuelSupplierContactRole)
admin.site.register(FuelSupplierHistory)
admin.site.register(FuelSupplierStatus)
admin.site.register(Notification)
admin.site.register(NotificationEvent)
admin.site.register(NotificationType)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(RolePermission)
admin.site.register(User)
admin.site.register(UserFavourite)
admin.site.register(UserRole)