from datetime import timedelta
from django.apps import apps
from django.db.models import F


class CreditCalculationService(object):
    """
    Helper functions for Credit Calculation
    """
    @staticmethod
    def get(**kwargs):
        """
        Gets the ratio/density that applies to the date provided
        """
        model_name = kwargs.pop('model_name')
        date = kwargs.pop('date')

        model = apps.get_model('api', model_name)

        return model.objects.filter(
            effective_date__lte=date,
            **kwargs
        ).exclude(
            expiration_date__lt=date
        ).exclude(
            expiration_date=F('effective_date')
        ).order_by('-effective_date', '-update_timestamp').first()

    @staticmethod
    def get_later(**kwargs):
        """
        Gets the ratio/density that comes after the date provided.
        This is so we can set the expiry date for the ratio/density
        that we're about to create
        """
        category_id = kwargs.pop('category_id', None)
        compliance_period_id = kwargs.pop('compliance_period_id', None)
        effective_date = kwargs.pop('effective_date')
        fuel_class_id = kwargs.get('fuel_class_id', None)
        model_name = kwargs.pop('model_name')
        _update_user = kwargs.pop('update_user')

        model = apps.get_model('api', model_name)

        rows = model.objects.filter(
            effective_date__gt=effective_date
        ).exclude(
            expiration_date=F('effective_date')
        )

        if category_id:
            rows = rows.filter(category_id=category_id)

        if compliance_period_id:
            rows = rows.filter(compliance_period_id=compliance_period_id)

        if fuel_class_id:
            rows = rows.filter(fuel_class_id=fuel_class_id)

        return rows.order_by('effective_date', '-update_timestamp').first()

    @staticmethod
    def get_prior(**kwargs):
        """
        Gets the ratio/density that has an effective date prior to the
        date provided.
        This is so we can update it later an make sure no overlaps occur
        """
        category_id = kwargs.pop('category_id', None)
        compliance_period_id = kwargs.pop('compliance_period_id', None)
        effective_date = kwargs.pop('effective_date')
        fuel_class_id = kwargs.get('fuel_class_id', None)
        model_name = kwargs.pop('model_name')
        _update_user = kwargs.pop('update_user')

        model = apps.get_model('api', model_name)

        rows = model.objects.filter(
            effective_date__lte=effective_date
        ).exclude(
            expiration_date=F('effective_date')
        )

        if category_id:
            rows = rows.filter(category_id=category_id)

        if compliance_period_id:
            rows = rows.filter(compliance_period_id=compliance_period_id)

        if fuel_class_id:
            rows = rows.filter(fuel_class_id=fuel_class_id)

        return rows.order_by('-effective_date', '-update_timestamp').first()

    @staticmethod
    def update(**kwargs):
        """
        Creates a record for the density/ratio being provided, as well as
        update the expiry/effective dates to make sure there are no gaps
        between records
        """
        effective_date = kwargs.pop('effective_date')
        model_name = kwargs.pop('model_name')
        update_user = kwargs.pop('update_user')

        model = apps.get_model('api', model_name)

        later_ratio = CreditCalculationService.get_later(
            effective_date=effective_date,
            model_name=model_name,
            update_user=update_user,
            **kwargs
        )

        if later_ratio:
            expiration_date = later_ratio.effective_date - timedelta(days=1)
        else:
            expiration_date = None

        prior_ratio = CreditCalculationService.get_prior(
            effective_date=effective_date,
            model_name=model_name,
            update_user=update_user,
            **kwargs
        )

        new_ratio = model.objects.create(
            create_user=update_user,
            effective_date=effective_date,
            update_user=update_user,
            expiration_date=expiration_date,
            **kwargs
        )

        if prior_ratio:
            expiration_date = new_ratio.effective_date - timedelta(days=1)
            if expiration_date < prior_ratio.effective_date:
                expiration_date = prior_ratio.effective_date

            prior_ratio.expiration_date = expiration_date
            prior_ratio.update_user = update_user
            prior_ratio.save()
