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
from . import CreditTrade
from . import CompliancePeriod
from . import CreditTradeHistory
from . import CreditTradeZeroReason
from . import DocumentMilestone
from . import DocumentStatus
from . import DocumentType
from . import OrganizationActionsType
from . import OrganizationAddress
from . import OrganizationBalance
from . import OrganizationStatus
from . import OrganizationType
from . import Role
from . import Permission
from . import RolePermission
from . import SigningAuthorityAssertion
from . import SigningAuthorityConfirmation
from . import UserRole
from . import CreditTradeComment
from . import UserCreationRequest
from . import FuelCode
from . import FuelCodeStatus
from . import Document
from . import DocumentComment
from . import DocumentCreditTrade
from . import DocumentHistory
from . import DocumentFileAttachment
from . import ApprovedFuel
from . import TransportMode
from . import CarbonIntensityLimit
from . import UnitOfMeasure
from . import DefaultCarbonIntensityCategory
from . import EnergyDensityCategory
from . import EnergyEffectivenessRatioCategory
from . import ApprovedFuelClass
from . import EnergyEffectivenessRatio
from . import DefaultCarbonIntensity
from . import EnergyDensity
from . import PetroleumCarbonIntensity
from . import PetroleumCarbonIntensityCategory
from . import ExpectedUse
from . import ComplianceReport
from . import ComplianceReportSchedules
from . import NotionalTransferType
from . import CarbonIntensityDeterminationType
from . import ProvisionOfTheAct
from . import ApprovedFuelProvision
from . import TransactionType
from . import ComplianceReportHistory

patch_fields()
