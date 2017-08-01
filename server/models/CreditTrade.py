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
from .CreditTradeStatus import CreditTradeStatus
from .FuelSupplier import FuelSupplier
from .CreditTradeType import CreditTradeType
from .CreditTradeHistory import CreditTradeHistory
from server.exceptions import CustomValidation


class CreditTrade(models.Model):	    
    creditTradeStatusId = models.ForeignKey('CreditTradeStatus', related_name='CreditTradecreditTradeStatusId')   
    initiator = models.ForeignKey('FuelSupplier', related_name='CreditTradeinitiator', blank=True, null=True)   
    respondent = models.ForeignKey('FuelSupplier', related_name='CreditTraderespondent')   
    tradeEffectiveDate = models.DateField(blank=True, null=True)   
    creditTradeTypeId = models.ForeignKey('CreditTradeType', related_name='CreditTradecreditTradeTypeId')   
    numberOfCredits = models.IntegerField(validators=[CustomValidation('Value must be a positive integer','numberOfCredits',status_code=422)])
    fairMarketValuePerCredit = models.CharField(blank=True, null=True, max_length=255)   
    history = models.ManyToManyField('CreditTradeHistory', related_name='CreditTradehistory', blank=True)   
    plainEnglishPhrase = models.CharField(max_length=255)   

