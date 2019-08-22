from rest_framework import serializers
from rest_framework.relations import SlugRelatedField, PrimaryKeyRelatedField

from api.models.ApprovedFuel import ApprovedFuel
from api.models.ComplianceReportSchedules import ScheduleC, ScheduleCRecord, \
    ScheduleARecord, ScheduleA, ScheduleBRecord, ScheduleB, ScheduleD, \
    ScheduleDSheet, ScheduleDSheetInput, ScheduleDSheetOutput, ScheduleSummary
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.FuelCode import FuelCode
from api.models.NotionalTransferType import NotionalTransferType
from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from api.serializers.constants import ComplianceReportValidation


class OutputCellSerializer(serializers.ChoiceField):
    def field_to_native(self, obj, field_name):
        return getattr(obj, 'get_' + field_name + '_display')()


class ScheduleDSheetOutputSerializer(serializers.ModelSerializer):
    description = OutputCellSerializer(
        choices=[e.value for e in ScheduleDSheetOutput.OutputCells])

    class Meta:
        model = ScheduleDSheetOutput
        fields = ('intensity', 'description')


class ScheduleDSheetInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDSheetInput
        fields = ('worksheet_name', 'cell', 'value', 'units', 'description')


class ScheduleDSheetSerializer(serializers.ModelSerializer):
    fuel_type = SlugRelatedField(
        slug_field='name',
        queryset=ApprovedFuel.objects.all()
    )
    fuel_class = SlugRelatedField(
        slug_field='fuel_class',
        queryset=FuelClass.objects.all()
    )
    inputs = ScheduleDSheetInputSerializer(many=True, required=True)
    outputs = ScheduleDSheetOutputSerializer(many=True, required=True)
    feedstock = serializers.CharField(required=True, allow_blank=False, allow_null=False)

    def validate_outputs(self, data):
        required_keys = [e.value for e in ScheduleDSheetOutput.OutputCells]
        failures = []

        actual_keys = [e['description'] for e in data]

        for key in required_keys:
            if key not in actual_keys:
                failures.append(
                    ComplianceReportValidation.missing_key.format(key=key))

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data

    class Meta:
        model = ScheduleDSheet
        fields = ('fuel_type', 'fuel_class', 'feedstock', 'inputs', 'outputs')


class ScheduleDDetailSerializer(serializers.ModelSerializer):
    sheets = ScheduleDSheetSerializer(many=True, required=False)

    class Meta:
        model = ScheduleD
        fields = ('sheets',)


class ScheduleCRecordSerializer(serializers.ModelSerializer):
    fuel_type = SlugRelatedField(
        slug_field='name', queryset=ApprovedFuel.objects.all())
    fuel_class = SlugRelatedField(
        slug_field='fuel_class', queryset=FuelClass.objects.all())
    expected_use = SlugRelatedField(
        slug_field='description', queryset=ExpectedUse.objects.all())

    def validate_quantity(self, value):
        if value == 0:
            raise serializers.ValidationError(ComplianceReportValidation.zero)

        if value < 0:
            raise serializers.ValidationError(ComplianceReportValidation.negative)

        if round(value) != value:
            raise serializers.ValidationError(ComplianceReportValidation.fractional)

        return value

    def validate(self, data):
        if data['expected_use'].description == 'Other' and \
                ('rationale' not in data or len(data['rationale']) == 0):
            raise serializers.ValidationError(ComplianceReportValidation.missing)

        return data

    class Meta:
        model = ScheduleCRecord
        fields = (
            'fuel_type', 'fuel_class', 'quantity', 'expected_use', 'rationale',
            'petroleum_diesel_volume'
        )
        read_only_fields = ('petroleum_diesel_volume',)


class ScheduleCDetailSerializer(serializers.ModelSerializer):
    records = ScheduleCRecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleC
        fields = ('records', 'total_petroleum_diesel')
        read_only_fields = ('total_petroleum_diesel',)


class ScheduleBRecordSerializer(serializers.ModelSerializer):
    fuel_type = SlugRelatedField(
        slug_field='name', queryset=ApprovedFuel.objects.all())
    fuel_class = SlugRelatedField(
        slug_field='fuel_class', queryset=FuelClass.objects.all())
    provision_of_the_act = SlugRelatedField(
        slug_field='provision', queryset=ProvisionOfTheAct.objects.all())
    fuel_code = PrimaryKeyRelatedField(
        queryset=FuelCode.objects.all(), required=False, allow_null=True)
    fuel_type = SlugRelatedField(slug_field='name', queryset=ApprovedFuel.objects.all())
    fuel_class = SlugRelatedField(slug_field='fuel_class', queryset=FuelClass.objects.all())
    provision_of_the_act = SlugRelatedField(slug_field='provision', queryset=ProvisionOfTheAct.objects.all())
    fuel_code = PrimaryKeyRelatedField(queryset=FuelCode.objects.all(), required=False, allow_null=True)
    schedule_d_sheet_index = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    intensity = serializers.FloatField(required=False, allow_null=True, min_value=0)

    def validate_quantity(self, value):
        if value == 0:
            raise serializers.ValidationError(ComplianceReportValidation.zero)

        if value < 0:
            raise serializers.ValidationError(ComplianceReportValidation.negative)

        if round(value) != value:
            raise serializers.ValidationError(ComplianceReportValidation.fractional)

        return value

    def validate(self, data):
        """
        Check that start is before finish.
        """
        if (data['provision_of_the_act'].provision == 'Section 6 (5) (d) (ii) (A)' and
                ('schedule_d_sheet_index' not in data or
                 data['schedule_d_sheet_index'] is None)):
            raise serializers.ValidationError({'schedule_d_index': ComplianceReportValidation.missing})

        if (data['provision_of_the_act'].provision == 'Section 6 (5) (d) (ii) (B)' and
                ('intensity' not in data or data['intensity'] is None)):
            raise serializers.ValidationError({'intensity': ComplianceReportValidation.missing})

        if (data['provision_of_the_act'].provision == 'Section 6 (5) (c)' and
                ('fuel_code' not in data or data['fuel_code'] is None)):
            raise serializers.ValidationError({'fuel_code': ComplianceReportValidation.missing})

        if (('intensity' in data and data['intensity'] is not None) and
                ('fuel_code' in data and data['fuel_code'] is not None)):
            raise serializers.ValidationError(
                {
                    'fuel_code': ComplianceReportValidation.extra_value,
                    'intensity': ComplianceReportValidation.extra_value
                }
            )

        if (('intensity' in data and data['intensity'] is not None) and
                data['provision_of_the_act'].provision != 'Section 6 (5) (d) (ii) (B)'):
            raise serializers.ValidationError({'intensity': ComplianceReportValidation.extra_value})

        return data

    class Meta:
        model = ScheduleBRecord
        fields = (
            'fuel_type', 'fuel_class', 'provision_of_the_act', 'quantity',
            'fuel_code', 'intensity', 'schedule_d_sheet_index',
            'energy_density', 'eer', 'ci_limit', 'energy_content',
            'effective_carbon_intensity', 'credits', 'debits',
            'petroleum_diesel_volume', 'petroleum_gasoline_volume',
            'renewable_diesel_volume', 'renewable_gasoline_volume',
            'unit_of_measure'
        )
        read_only_fields = (
            'energy_density', 'eer', 'ci_limit', 'energy_content',
            'effective_carbon_intensity', 'credits', 'debits',
            'petroleum_diesel_volume', 'petroleum_gasoline_volume',
            'renewable_diesel_volume', 'renewable_gasoline_volume',
            'unit_of_measure'
        )


class ScheduleBDetailSerializer(serializers.ModelSerializer):
    records = ScheduleBRecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleB
        fields = ('records', 'total_credits', 'total_debits',
                  'total_petroleum_diesel', 'total_petroleum_gasoline',
                  'total_renewable_diesel', 'total_renewable_gasoline')
        read_only_fields = ('total_credits', 'total_debits',
                            'total_petroleum_diesel', 'total_petroleum_gasoline',
                            'total_renewable_diesel', 'total_renewable_gasoline')


class ScheduleARecordSerializer(serializers.ModelSerializer):
    transfer_type = SlugRelatedField(
        slug_field='the_type', queryset=NotionalTransferType.objects.all())
    fuel_class = SlugRelatedField(
        slug_field='fuel_class', queryset=FuelClass.objects.all())

    def validate_quantity(self, value):
        if value == 0:
            raise serializers.ValidationError(ComplianceReportValidation.zero)

        if value < 0:
            raise serializers.ValidationError(ComplianceReportValidation.negative)

        if round(value) != value:
            raise serializers.ValidationError(ComplianceReportValidation.fractional)

        return value

    class Meta:
        model = ScheduleARecord
        fields = (
            'transfer_type', 'fuel_class', 'quantity', 'trading_partner',
            'postal_address'
        )


class ScheduleADetailSerializer(serializers.ModelSerializer):
    records = ScheduleARecordSerializer(many=True, required=False)

    class Meta:
        model = ScheduleA
        fields = ('records',)


class ScheduleSummaryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleSummary
        fields = ('diesel_class_retained', 'gasoline_class_retained',
                  'diesel_class_deferred', 'gasoline_class_deferred',
                  'credits_offset')
