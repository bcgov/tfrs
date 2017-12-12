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
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeZeroReason import CreditTradeZeroReason

from .models.Organization import Organization
from .models.OrganizationType import OrganizationType
from .models.OrganizationActionsType import OrganizationActionsType
from .models.OrganizationAttachment import OrganizationAttachment
from .models.OrganizationBalance import OrganizationBalance
from .models.OrganizationHistory import OrganizationHistory
from .models.OrganizationStatus import OrganizationStatus
from .models.Permission import Permission

from .models.Role import Role
from .models.RolePermission import RolePermission

from .models.User import User

from .models.UserRole import UserRole


admin.site.register(CreditTrade)
admin.site.register(CreditTradeHistory)
admin.site.register(CreditTradeStatus)
admin.site.register(CreditTradeType)
admin.site.register(CreditTradeZeroReason)
admin.site.register(Organization)
admin.site.register(OrganizationType)
admin.site.register(OrganizationActionsType)
admin.site.register(OrganizationAttachment)
admin.site.register(OrganizationBalance)
admin.site.register(OrganizationHistory)
admin.site.register(OrganizationStatus)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(RolePermission)
admin.site.register(User)
admin.site.register(UserRole)