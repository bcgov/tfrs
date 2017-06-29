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
from .History import History


class Offer(models.Model):	    
    fuelSupplier = models.ForeignKey('FuelSupplier', related_name='OfferfuelSupplier')   
    status = models.CharField(max_length=255)   
    buyOrSell = models.CharField(max_length=255)   
    numberOfCredits = models.IntegerField()   
    numberOfViews = models.IntegerField()   
    datePosted = models.DateField(blank=True, null=True)   
    note = models.CharField(max_length=255, blank=True, null=True)   
    history = models.ManyToManyField('History', related_name='Offerhistory', blank=True)   

