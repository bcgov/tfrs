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
try:
  from . import CreditTrade
except:
  import CreditTrade
try:
  from . import User
except:
  import User
try:
  from . import CompliancePeriod
except:
  import CompliancePeriod


class CreditTradeLogEntry(models.Model):	    
    creditTrade = models.ForeignKey('CreditTrade', on_delete=models.CASCADE,related_name='creditTradeCreditTrade')   
    user = models.ForeignKey('User', on_delete=models.CASCADE,related_name='userUser')   
    logEntryTime = models.DateField()   
    newCompliancePeriod = models.ForeignKey('CompliancePeriod', on_delete=models.CASCADE,related_name='newCompliancePeriodCompliancePeriod')   
    newStatus = models.CharField(max_length=255)   
    newTradeExecutionDate = models.DateField()   
    newTransactionType = models.CharField(max_length=255)   
    newNumberOfCredits = models.IntegerField()   
    newFairMarketValuePrice = models.CharField(max_length=255)   
    newFuelSupplierBalanceAtTransactionTime = models.IntegerField()   
