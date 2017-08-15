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

import datetime

from django.db import models
from django.utils import timezone
from .FuelSupplier import FuelSupplier
from .OpportunityStatus import OpportunityStatus
from .CreditTradeType import CreditTradeType
from .FuelSupplierType import FuelSupplierType
from .CreditTrade import CreditTrade


class Opportunity(models.Model):	    
    fuelSupplierFK = models.ForeignKey('FuelSupplier', related_name='OpportunityfuelSupplierFK')   
    opportunityStatusFK = models.ForeignKey('OpportunityStatus', related_name='OpportunityopportunityStatusFK')   
    creditTradeTypeFK = models.ForeignKey('CreditTradeType', related_name='OpportunitycreditTradeTypeFK')   
    fuelSupplierTypeFK = models.ForeignKey('FuelSupplierType', related_name='OpportunityfuelSupplierTypeFK')   
    numberOfCredits = models.IntegerField()   
    suggestedValuePerCredit = models.CharField(blank=True, null=True, max_length=255)   
    plainEnglishPhrase = models.CharField(max_length=2000)   
    hasTradeNow = models.BooleanField()   
    postedDate = models.DateField(blank=True, null=True)   
    opportunityBackgroundNote = models.CharField(max_length=4000, blank=True, null=True)   
    creditTradesSet = models.ManyToManyField('CreditTrade', related_name='OpportunitycreditTradesSet', blank=True)   

