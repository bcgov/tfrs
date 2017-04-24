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


class Contact(models.Model):	    
    givenName = models.CharField(max_length=255)   
    surname = models.CharField(max_length=255)   
    organizationName = models.CharField(max_length=255)   
    role = models.CharField(max_length=255)   
    notes = models.CharField(max_length=255)   
    emailAddress = models.CharField(max_length=255)   
    workPhoneNumber = models.CharField(max_length=255)   
    mobilePhoneNumber = models.CharField(max_length=255)   
    faxPhoneNumber = models.CharField(max_length=255)   
    address1 = models.CharField(max_length=255)   
    address2 = models.CharField(max_length=255)   
    city = models.CharField(max_length=255)   
    province = models.CharField(max_length=255)   
    postalCode = models.CharField(max_length=255)   
