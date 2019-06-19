from rest_framework import serializers
from rest_framework.relations import SlugRelatedField, PrimaryKeyRelatedField

from api.models.ApprovedFuel import ApprovedFuel
from api.models.ComplianceReportSchedules import ScheduleC, ScheduleCRecord, ScheduleARecord, ScheduleA, ScheduleBRecord, ScheduleB
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.FuelCode import FuelCode
from api.models.NotionalTransferType import NotionalTransferType
from api.models.ProvisionOfTheAct import ProvisionOfTheAct


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


class ScheduleBRecordSerializer(serializers.ModelSerializer):

    fuel_type = SlugRelatedField(slug_field='name', queryset=ApprovedFuel.objects.all())
    fuel_class = SlugRelatedField(slug_field='fuel_class', queryset=FuelClass.objects.all())
    provision_of_the_act = SlugRelatedField(slug_field='provision', queryset=ProvisionOfTheAct.objects.all())
    fuel_code = PrimaryKeyRelatedField(queryset=FuelCode.objects.all(), required=False, allow_null=True)

    class Meta:
        model = ScheduleBRecord
        fields = ('fuel_type', 'fuel_class', 'provision_of_the_act', 'quantity', 'fuel_code')


class ScheduleBDetailSerializer(serializers.ModelSerializer):
    records = ScheduleBRecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleB
        fields = ('records',)


class ScheduleARecordSerializer(serializers.ModelSerializer):

    transfer_type = SlugRelatedField(slug_field='the_type', queryset=NotionalTransferType.objects.all())
    fuel_class = SlugRelatedField(slug_field='fuel_class', queryset=FuelClass.objects.all())

    class Meta:
        model = ScheduleARecord
        fields = ('transfer_type', 'fuel_class', 'quantity', 'trading_partner', 'postal_address')


class ScheduleADetailSerializer(serializers.ModelSerializer):
    records = ScheduleARecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleA
        fields = ('records',)
