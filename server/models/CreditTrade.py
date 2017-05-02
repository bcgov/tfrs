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
from .User import User
from .Offer import Offer
from .Note import Note
from .Attachment import Attachment
from .History import History


class CreditTrade(models.Model):	    
    status = models.CharField(max_length=255, blank=True, null=True)   
    initiator = models.ForeignKey('FuelSupplier', related_name='CreditTradeinitiator', blank=True, null=True)   
    respondent = models.ForeignKey('FuelSupplier', related_name='CreditTraderespondent')   
    initiatorLastUpdateBy = models.ForeignKey('User', related_name='CreditTradeinitiatorLastUpdateBy')   
    respondentLastUpdatedBy = models.ForeignKey('User', related_name='CreditTraderespondentLastUpdatedBy', blank=True, null=True)   
    reviewedRejectedBy = models.ForeignKey('User', related_name='CreditTradereviewedRejectedBy', blank=True, null=True)   
    approvedRejectedBy = models.ForeignKey('User', related_name='CreditTradeapprovedRejectedBy', blank=True, null=True)   
    cancelledBy = models.ForeignKey('User', related_name='CreditTradecancelledBy', blank=True, null=True)   
    tradeExecutionDate = models.DateField(blank=True, null=True)   
    transactionType = models.CharField(max_length=255)   
    numberOfCredits = models.IntegerField()   
    fairMarketValuePrice = models.CharField(blank=True, null=True, max_length=255)   
    offer = models.ForeignKey('Offer', related_name='CreditTradeoffer', blank=True, null=True)   
    fuelSupplierBalanceBeforeTransaction = models.DateField(blank=True, null=True)   
    notes = models.ManyToManyField('Note', related_name='CreditTradenotes', blank=True)   
    attachments = models.ManyToManyField('Attachment', related_name='CreditTradeattachments', blank=True)   
    history = models.ManyToManyField('History', related_name='CreditTradehistory', blank=True)   

