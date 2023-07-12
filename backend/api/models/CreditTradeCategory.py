"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

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

from django.db import models

class CreditTradeCategory(models.Model):
    """
    Holds the categories for credit trades
    """
    CATEGORY_CHOICES = [
        ('A', 'Reached within the last 6 months'),
        ('B', 'Reached between 6 months to 1 year ago'),
        ('C', 'Reached more than 1 year ago'),
        ('D', 'Override based on value of price per credit'),
    ]

    category = models.CharField(
        max_length=1,
        choices=CATEGORY_CHOICES,
        default='A',
        unique=True,
    )

    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'credit_trade_category'

    db_table_comment = "Categories for Credit Trades based on the date of agreement and approval."