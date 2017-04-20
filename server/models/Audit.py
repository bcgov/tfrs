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


class Audit(models.Model):	    
    appCreateTimestamp = models.DateField()   
    appCreateUserid = models.CharField(max_length=255)   
    appCreateUserGuid = models.CharField(max_length=255)   
    appCreateUserDirectory = models.CharField(max_length=255)   
    appLastUpdateTimestamp = models.DateField()   
    appLastUpdateUserid = models.CharField(max_length=255)   
    appLastUpdateUserGuid = models.CharField(max_length=255)   
    appLastUpdateUserDirectory = models.CharField(max_length=255)   
    entityName = models.CharField(max_length=255)   
    entityId = models.IntegerField()   
    propertyName = models.CharField(max_length=255)   
    oldValue = models.CharField(max_length=255)   
    newValue = models.CharField(max_length=255)   
    isDelete = models.BooleanField()   
