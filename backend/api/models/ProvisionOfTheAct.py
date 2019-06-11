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
from django.db.models import ManyToManyField

from auditable.models import Auditable
from api.models.CarbonIntensityDeterminationType import \
    CarbonIntensityDeterminationType
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates


class ProvisionOfTheAct(Auditable, DisplayOrder, EffectiveDates):
    """
    List of provisions within Greenhouse Gas Reduction
    (Renewable and Low Carbon Fuel Requirement) Act.
    e.g. Section 6 (5) (a)
    """
    fuel = ManyToManyField(
        'ApprovedFuel',
        through='ApprovedFuelProvision'
    )

    provision = models.CharField(
        max_length=100,
        db_comment="Name of the Provision. "
                   "e.g. Section 6 (5) (a)"
    )

    description = models.CharField(
        max_length=1000, blank=True, null=True,
        db_comment="Description of the provision. This is the displayed name. "
                   "e.g. Prescribed Carbon Intensity, Approved Fuel Code."
    )

    @property
    def determination_type(self):
        """
        Determination Type for the Provision.
        Relationship through ApprovedFuelProvision.
        Fuel ID filter is just to reduce the number of records fetched,
        but even without it, it should fetch the correct records, just
        contains duplicated records of the same value
        """
        determination_type = CarbonIntensityDeterminationType.objects.filter(
            fuel=self.fuel.first(),
            provision_act=self.id
        )

        return determination_type.first()

    class Meta:
        db_table = 'provision_act'

    db_table_comment = "List of provisions within Greenhouse Gas Reduction " \
                       "(Renewable and Low Carbon Fuel Requirement) Act." \
                       "e.g. Section 6 (5) (a)"
