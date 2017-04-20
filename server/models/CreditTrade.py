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
  from . import FuelSupplier
except:
  import FuelSupplier
try:
  from . import CompliancePeriod
except:
  import CompliancePeriod
try:
  from . import User
except:
  import User
try:
  from . import Note
except:
  import Note
try:
  from . import Attachment
except:
  import Attachment
try:
  from . import History
except:
  import History


class CreditTrade(models.Model):	    
    status = models.CharField(max_length=255)   
    fuelSupplier = models.ForeignKey('FuelSupplier', on_delete=models.CASCADE,related_name='fuelSupplierFuelSupplier')   
    transactionPartnerFuelSupplier = models.ForeignKey('FuelSupplier', on_delete=models.CASCADE,related_name='transactionPartnerFuelSupplierFuelSupplier')   
    compliancePeriod = models.ForeignKey('CompliancePeriod', on_delete=models.CASCADE,related_name='compliancePeriodCompliancePeriod')   
    fuelSupplierLastUpdatedBy = models.ForeignKey('User', on_delete=models.CASCADE,related_name='fuelSupplierLastUpdatedByUser')   
    partnerLastUpdatedBy = models.ForeignKey('User', on_delete=models.CASCADE,related_name='partnerLastUpdatedByUser')   
    reviewedRejectedBy = models.ForeignKey('User', on_delete=models.CASCADE,related_name='reviewedRejectedByUser')   
    approvedRejectedBy = models.ForeignKey('User', on_delete=models.CASCADE,related_name='approvedRejectedByUser')   
    cancelledBy = models.ForeignKey('User', on_delete=models.CASCADE,related_name='cancelledByUser')   
    tradeExecutionDate = models.DateField()   
    transactionType = models.CharField(max_length=255)   
    numberOfCredits = models.IntegerField()   
    fairMarketValuePrice = models.CharField(max_length=255)   
    fuelSupplierBalanceAtTransactionTime = models.DateField()   
    notes = models.ManyToManyField('Note',related_name='notesNote')   
    attachments = models.ManyToManyField('Attachment',related_name='attachmentsAttachment')   
    history = models.ManyToManyField('History',related_name='historyHistory')   
