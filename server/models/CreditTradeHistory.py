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
from .CreditTrade import CreditTrade
from .User import User
from .FuelSupplier import FuelSupplier
from .CreditTradeStatus import CreditTradeStatus
from .CreditTradeType import CreditTradeType

from auditable.models import Auditable

class CreditTradeHistory(Auditable):	    
    creditTradeFK = models.ForeignKey('CreditTrade', related_name='CreditTradeHistorycreditTradeFK', null=True)
    userFK = models.ForeignKey('User', related_name='CreditTradeHistoryuserFK')   
    creditTradeUpdateTime = models.DateTimeField()   
    newRespondentFK = models.ForeignKey('FuelSupplier', related_name='CreditTradeHistorynewRespondentFK')   
    creditTradeStatusFK = models.ForeignKey('CreditTradeStatus', related_name='CreditTradeHistorycreditTradeStatusFK')   
    creditTradeTypeFK = models.ForeignKey('CreditTradeType', related_name='CreditTradeHistorycreditTradeTypeFK')   
    newNumberOfCredits = models.IntegerField()   
    newFairMarketValuePerCredit = models.CharField(blank=True, null=True, max_length=255)   
    newCreditTradeZeroReasonFK = models.ForeignKey('CreditTradeZeroReason', related_name='CreditTradeHistorynewCreditTradeZeroReasonFK', blank=True, null=True)
    newTradeEffectiveDate = models.DateField(blank=True, null=True)
    newNote = models.CharField(max_length=4000, blank=True, null=True)
    isInternalHistoryRecord = models.BooleanField()

    class Meta:
        db_table = 'credit_trade_history'

