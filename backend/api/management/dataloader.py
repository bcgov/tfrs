import abc

from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CompliancePeriod import CompliancePeriod


class DataLoader(OperationalDataScript):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.add_objects()

    data = {
    }

    comment = 'Data load script'

    is_revertable = True

    def check_run_preconditions(self):
        exceptions = 0

        for (key, value) in self.data.items():
            if value.__class__.objects.filter(**{key[0]: key[1]}).exists():
                print('{} with {} = {} already exists.'.format(value, key[0], key[1]))
                exceptions += 1

        if exceptions > 0:
            print('Encountered {} unexpected entries. Preconditions not met.'.format(exceptions))
            return False

        return True

    @transaction.atomic
    def run(self):
        for (key, value) in self.data.items():
            print('inserting {} with {} = {}'.format(value, key[0], key[1]))
            value.save()

    def check_revert_preconditions(self):
        exceptions = 0

        for (key, value) in self.data.items():
            if not value.__class__.objects.filter(**{key[0]: key[1]}).exists():
                print('{} with {} = {} doesn\'t exist.'.format(value, key[0], key[1]))
                exceptions += 1

        if exceptions > 0:
            print('Encountered {} unexpected entries. Preconditions not met.'.format(exceptions))
            return False

        return True

    @transaction.atomic
    def revert(self):
        for (key, value) in self.data.items():
            print('deleting {} with {} = {}'.format(value, key[0], key[1]))
            found = value.__class__.objects.filter(**{key[0]: key[1]}).first()
            found.delete()

    @abc.abstractmethod
    def add_objects(self):
        pass

    def add_object(self, key_attribute, key_value, model_object):
        self.data[(key_attribute, key_value)] = model_object

# This is necessary for the loader to get a reference to the class
script_class = DataLoader
