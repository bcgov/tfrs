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


class FuelSupplierAttachment(models.Model):	    
    fuelSupplierFK = models.ForeignKey('FuelSupplier', related_name='FuelSupplierAttachmentfuelSupplierFK')   
    fileName = models.CharField(max_length=250, blank=True, null=True)   
    fileLocation = models.CharField(max_length=2000, blank=True, null=True)   
    description = models.CharField(max_length=4000, blank=True, null=True)   
    complianceYear = models.CharField(max_length=25, blank=True, null=True)   

