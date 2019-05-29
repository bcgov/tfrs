from rest_framework import serializers
from rest_framework.relations import SlugRelatedField

from api.models.ApprovedFuel import ApprovedFuel
from api.models.ComplianceReportSchedules import ScheduleC, ScheduleCRecord
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass


class ScheduleCRecordSerializer(serializers.ModelSerializer):

    fuel_type = SlugRelatedField(slug_field='name', queryset=ApprovedFuel.objects.all())
    fuel_class = SlugRelatedField(slug_field='fuel_class', queryset=FuelClass.objects.all())
    expected_use = SlugRelatedField(slug_field='description', queryset=ExpectedUse.objects.all())

    class Meta:
        model = ScheduleCRecord
        fields = ('fuel_type', 'fuel_class', 'quantity', 'expected_use', 'rationale')


class ScheduleCDetailSerializer(serializers.ModelSerializer):
    records = ScheduleCRecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleC
        fields = ('records',)
